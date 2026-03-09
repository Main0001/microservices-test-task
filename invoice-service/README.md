# Invoice Service

REST API сервис для создания счетов-фактур (инвойсов), генерации PDF и отправки на email. Реализован как тестовое задание.

## Стек технологий

| Технология | Версия | Назначение |
|---|---|---|
| NestJS | 11 | Веб-фреймворк |
| Prisma | 7 | ORM |
| PostgreSQL | 16 | База данных |
| Redis | 7 | Бэкенд для очередей |
| BullMQ | 5 | Асинхронная обработка задач |
| Handlebars | 4 | HTML-шаблон для PDF |
| html-pdf-node | 1 | Генерация PDF из HTML |
| Nodemailer | 8 | Отправка email через SMTP |
| Swagger | 11 | Документация API |
| Docker | — | Контейнеризация |

---

## API Endpoints

| Метод | Путь | Описание |
|---|---|---|
| `POST` | `/invoices` | Создать инвойс и запустить асинхронную обработку |
| `GET` | `/invoices` | Список всех инвойсов (с пагинацией) |
| `GET` | `/invoices/:id` | Получить инвойс по ID |

**Swagger UI:** `http://localhost:3000/api`

### POST /invoices — Тело запроса

```json
{
  "email": "john.doe@example.com",
  "items": [
    { "description": "Дизайн логотипа", "amount": 150.00 },
    { "description": "Вёрстка сайта", "amount": 350.00 }
  ]
}
```

### POST /invoices — Ответ (202 Accepted)

```json
{
  "invoiceId": "uuid",
  "invoiceNumber": "INV-2026-0001",
  "status": "PENDING",
  "message": "Invoice is being processed"
}
```

### GET /invoices — Query параметры

| Параметр | По умолчанию | Описание |
|---|---|---|
| `page` | `1` | Номер страницы |
| `limit` | `10` | Количество элементов на странице |

---

## Переменные окружения

Скопируйте `.env.example` в `.env` и заполните значения:

```bash
cp .env.example .env
```

| Переменная | Пример | Описание |
|---|---|---|
| `PORT` | `3000` | Порт приложения |
| `NODE_ENV` | `development` | Окружение |
| `DB_HOST` | `localhost` | Хост PostgreSQL |
| `DB_PORT` | `5432` | Порт PostgreSQL |
| `DB_USER` | `postgres` | Пользователь PostgreSQL |
| `DB_PASSWORD` | `postgres` | Пароль PostgreSQL |
| `DB_NAME` | `invoice_db` | Название базы данных |
| `DATABASE_URL` | `postgresql://...` | Строка подключения Prisma |
| `REDIS_HOST` | `localhost` | Хост Redis |
| `REDIS_PORT` | `6379` | Порт Redis |
| `MAIL_HOST` | `smtp.mailersend.net` | SMTP хост |
| `MAIL_PORT` | `587` | SMTP порт |
| `MAIL_USER` | `...` | SMTP логин |
| `MAIL_PASS` | `...` | SMTP пароль |
| `MAIL_FROM` | `noreply@yourdomain.com` | Email отправителя |
| `SENDER_NAME` | `Иван Иванов` | Имя отправителя в PDF |
| `SENDER_COMPANY` | `Моя Компания` | Компания отправителя в PDF |
| `SENDER_ADDRESS` | `ул. Главная, 1` | Адрес отправителя в PDF |
| `SENDER_PHONE` | `+375 29 000-00-00` | Телефон отправителя в PDF |

---

## Запуск через Docker (рекомендуется)

Это основной способ запуска всего приложения.

### Требования

- [Docker Desktop](https://www.docker.com/products/docker-desktop/) установлен и запущен

### Шаг 1 — Сборка и запуск всех контейнеров

```bash
docker-compose up --build -d
```

Запускаются три контейнера:
- `app` — NestJS-приложение
- `postgres` — PostgreSQL 16
- `redis` — Redis 7

Контейнер приложения ожидает готовности `postgres` и `redis` перед стартом (healthcheck).

### Шаг 2 — Применение миграций базы данных

```bash
docker-compose exec app npx prisma migrate deploy
```

Применяет все SQL-миграции из папки `prisma/migrations/` к базе данных.

### Шаг 3 — Загрузка тестовых данных (опционально)

```bash
docker-compose exec app npx ts-node prisma/seed.ts
```

> При первом запуске `npx` предложит установить `ts-node` — введите `y` и нажмите Enter.

Создаёт в базе тестовых клиентов и инвойсы.

После выполнения всех шагов приложение доступно по адресу:
- **API:** http://localhost:3000
- **Swagger UI:** http://localhost:3000/api

### Проверка работы

```bash
# Статус контейнеров
docker-compose ps

# Логи приложения в реальном времени
docker-compose logs app -f

# Открыть Swagger UI в браузере
# http://localhost:3000/api
```

---

## Запуск локально (без Docker для приложения)

Используйте этот способ для разработки с hot-reload.

### Требования

- Node.js 20+
- Docker Desktop (для PostgreSQL и Redis)

### Шаг 1 — Установка зависимостей

```bash
npm install
```

### Шаг 2 — Подготовка файла окружения

```bash
cp .env.example .env
```

Оставьте `DB_HOST=localhost` и `REDIS_HOST=localhost`. Заполните переменные `MAIL_*`.

### Шаг 3 — Запуск PostgreSQL и Redis через Docker

```bash
docker-compose up postgres redis -d
```

### Шаг 4 — Применение миграций

```bash
npx prisma migrate deploy
```

### Шаг 5 — Загрузка тестовых данных (опционально)

```bash
npx ts-node prisma/seed.ts
```

### Шаг 6 — Запуск приложения

```bash
# Режим разработки с hot-reload
npm run start:dev

# Или сборка и запуск продакшн-версии
npm run build
node dist/src/main
```

Приложение будет доступно по адресу `http://localhost:3000`.
Swagger UI: `http://localhost:3000/api`.

---

## Docker — Полезные команды

```bash
# Запустить все контейнеры в фоне
docker-compose up -d

# Пересобрать образ и запустить (после изменений в коде)
docker-compose up --build -d

# Остановить все контейнеры
docker-compose down

# Остановить контейнеры и удалить все тома с данными (полный сброс)
docker-compose down -v

# Полная очистка: удалить контейнеры, образы и тома
docker-compose down -v --rmi all

# Логи приложения в реальном времени
docker-compose logs app -f

# Выполнить команду внутри работающего контейнера
docker-compose exec app <команда>

# Применить миграции внутри контейнера
docker-compose exec app npx prisma migrate deploy

# Загрузить тестовые данные внутри контейнера
# При первом запуске npx предложит установить ts-node — введите y и нажмите Enter
docker-compose exec app npx ts-node prisma/seed.ts

# Открыть интерактивную оболочку внутри контейнера
docker-compose exec app sh
```

---

## Команды для работы с миграциями

```bash
# Применить все миграции (для продакшна и Docker)
npx prisma migrate deploy

# Создать новую миграцию после изменения схемы (только для разработки)
npx prisma migrate dev --name <название-миграции>

# Полный сброс базы и повторное применение всех миграций
npx prisma migrate reset

# Посмотреть статус миграций
npx prisma migrate status
```

---



## Тестовые данные (seed)

Скрипт создаёт следующих тестовых клиентов:

| Email | Имя | Компания |
|---|---|---|
| `john.doe@example.com` | John Doe | Acme Corp |
| `jane.smith@company.org` | Jane Smith | Smith & Partners |
| `carlos.garcia@gmail.com` | Carlos Garcia | — |
| `emily.chen@techcorp.io` | Emily Chen | TechCorp Ltd |
| `mark.taylor@startup.io` | Mark Taylor | Startup.io |