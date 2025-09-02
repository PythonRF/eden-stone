### Первый этап: сборка проекта
FROM node:21-alpine AS builder

WORKDIR /app

# Копируем package.json и lock
COPY package*.json ./

# Устанавливаем все зависимости, включая dev
RUN npm install --frozen-lockfile

# Копируем весь код
COPY . .

# Сборка Next.js
RUN npm run build


### Второй этап: продакшн
FROM node:21-alpine

WORKDIR /app

# Копируем package.json и lock
COPY package*.json ./

# Устанавливаем только прод-зависимости
RUN npm install --frozen-lockfile --production

# Копируем только необходимые артефакты сборки
COPY --from=builder /app/public ./public
COPY --from=builder /app/.next ./.next
COPY --from=builder /app/next.config.ts ./next.config.ts

# Открываем порт для Next.js
EXPOSE 3000

# Старт
CMD ["npm", "run", "start"]