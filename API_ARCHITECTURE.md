# API architecture

The API is mounted at `/api`; Swagger is available at `/api/docs` while the backend is running.

## Public

- `GET /public/home|settings|courses|instructors`
- `GET /public/gallery`, `GET /public/gallery/categories`
- `GET /public/events`, `GET /public/events/:slug`, `POST /public/events/:id/register`
- `GET /public/blogs`, `GET /public/blogs/:slug`
- `POST /public/contact`
- `POST /admissions`, `GET /admissions/:id`
- `GET /jam-sessions/slots`, `POST /jam-sessions`, `GET /jam-sessions/:booking`

## Authentication

- `POST /auth/login|register|logout|forgot-password|reset-password`
- `GET /auth/me`
- `PATCH /auth/profile|password`

The browser receives an HTTP-only `omnaad_session` cookie. Authentication and authorization are checked again for every protected API request.

## Payments and receipts

- `POST /payments/admissions/:id/order|verify`
- `POST /payments/jam/:booking/order`, `POST /payments/jam/verify`
- `GET /payments/admissions/:id/receipt.pdf`
- `GET /payments/jam/:booking/receipt.pdf`

Order amounts come from database records. Successful verification is idempotency checked and committed in a transaction.

## Student

- `GET /student/dashboard|attendance|fees|fees/history|documents`
- `POST /student/fees/order|verify`

## Administration

- `GET /admin/dashboard|metadata|settings`
- `PATCH /admin/settings`
- `GET|POST /admin/:resource`
- `GET|PATCH|DELETE /admin/:resource/:id`
- `POST /admin/upload`
- `GET /admin/reports/:type`

Admin resource names and writable columns are allow-listed in `backend/src/admin/resources.ts`; clients cannot choose arbitrary table or column names.

## Response and error conventions

Success responses return JSON resources or `{ message }`. NestJS returns validation failures as HTTP 400, missing rows as 404, missing/expired sessions as 401 and role failures as 403. Rate limits apply globally and are stricter on login, password reset, contact and registration endpoints.
