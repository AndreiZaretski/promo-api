# PromoCode API

REST API для управления промокодами и активациями.

## 📌 Стек
- Node.js + TypeScript
- NestJS
- Prisma ORM
- PostgreSQL
- Docker

## 🚀 Запуск проекта

### Запуск через Docker
1. Убедитесь, что у вас установлены Docker и Docker Compose.
2. В корне проекта создайте файл `.env` на основе `.env.example`.
3. Запустите контейнеры
  docker compose up api-dev 
4. При старте контейнера автоматически накатываются миграции.
5. После этого приложение запускается и будет доступно на:
   - API: `http://localhost:3000`
   - Swagger UI: `http://localhost:3000/api`

### Запуск локально без Docker
1. Установите зависимости:
   ```bash
   npm install
2. Поднимите PostgreSQL локально и создайте базу `promo`.
3. В файле `.env` укажите строку подключения:
   DATABASE_URL=postgresql://postgres:postgres@127.0.0.1:5432/promo
4. Примените миграции:
  npx prisma generate
  npx prisma migrate dev --name init
5. Запустите сервер:

  npm run start:dev
  Приложение будет доступно на:

   - API: `http://localhost:3000`
   - Swagger UI: `http://localhost:3000/api`

### Запуск в режиме production

#### Локально без Docker
npm run build
npx prisma generate
npx prisma migrate deploy
npm run start:prod


## 📄 .env.example
  POSTGRES_USER=postgres
  POSTGRES_PASSWORD=postgres
  POSTGRES_DB=promo
  DB_PORT=5432

  DEV_PORT=3000
  PROD_PORT=3001

  DATABASE_URL=postgresql://postgres:postgres@127.0.0.1:5432/promo
  DATABASE_URL_DOCKER=postgresql://postgres:postgres@db:5432/promo?schema=public

## 🛠️ Endpoints
POST /promocode — создать промокод
Body: { code, discount, limit, expiresAt }

GET /promocode — список промокодов

GET /promocode/:id — получить промокод по id

POST /promocode/:code/activate — активировать промокод по коду и email
Body: { email }

## 📘 Пример использования
 ### Создание промокода
 curl -X POST http://localhost:3000/promocode \
  -H "Content-Type: application/json" \
  -d '{"code":"SPRING2026","discount":20,"limit":100,"expiresAt":"2026-05-01T00:00:00Z"}'
### Активация промокода

curl -X POST http://localhost:3000/promocode/SPRING2026/activate \
  -H "Content-Type: application/json" \
  -d '{"email":"user@example.com"}'
