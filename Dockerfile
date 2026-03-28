# Stage 1: build
FROM node:20-alpine AS builder
WORKDIR /app

# Копируем файлы для установки
COPY package*.json ./
COPY prisma ./prisma/

# Ставим ВСЕ зависимости
RUN npm install

# Копируем остальной код
COPY . .

# Генерируем клиент Prisma (создает файлы в src/generated/prisma)
RUN npx prisma generate

# Запускаем билд. 
# Если падает здесь — проверь, что в tsconfig.json есть paths для @prisma/client
RUN npm run build

# Stage 2: development
FROM node:20-alpine AS dev
WORKDIR /app
COPY package*.json ./
RUN npm install
COPY . .
RUN npx prisma generate 
CMD ["sh", "-c", "npx prisma migrate deploy && npm run start:dev"]

# Stage 3: production
FROM node:20-alpine AS production
WORKDIR /app

COPY --from=builder /app/node_modules ./node_modules
COPY --from=builder /app/dist ./dist
COPY --from=builder /app/prisma ./prisma
COPY package*.json ./

CMD ["sh", "-c", "npx prisma migrate deploy && node dist/main.js"]
# CMD ["sh", "-c", "npx prisma migrate deploy --url $DATABASE_URL && node dist/main.js"]
