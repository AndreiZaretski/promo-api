# Stage 1: build
FROM node:20-alpine AS builder
WORKDIR /app
COPY package*.json ./
RUN npm install
COPY . .
RUN npm run build

# Stage 2: development
FROM node:20-alpine AS dev
WORKDIR /app
COPY package*.json ./
RUN npm install   # ставим все зависимости, включая dev
COPY . .
CMD ["npm", "run", "start:dev"]


# Stage 3: production
FROM node:20-alpine AS production
WORKDIR /app
COPY --from=builder /app/dist ./dist
COPY package*.json ./
RUN npm install --omit=dev
CMD ["node", "dist/main.js"]
