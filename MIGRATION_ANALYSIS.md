# Migration analysis

## Source application

The source is Laravel 13.8 on PHP 8.3 with Blade, Tailwind, Alpine, MySQL, Laravel Breeze, Razorpay, DomPDF and a custom role/permission implementation. It contains public marketing/CMS pages, admissions, event registration, contact inquiries, jam-room bookings, a student portal, an administration portal, payments, PDF receipts, email notifications and a five-minute jam-session reminder schedule.

The source was inspected across routes, controllers, requests, middleware, services, models, migrations, seeders, Blade views, assets, mail classes, scheduled commands and tests. The original project was not modified except for the temporary staging folder used to assemble this separate application.

## Target architecture

- React 19 + TypeScript + Vite for the browser application.
- NestJS 11 + TypeScript and TypeORM's `DataSource` for the REST API.
- MySQL 8.4 using the existing Laravel table and column names.
- HTTP-only, same-site JWT session cookie; Laravel bcrypt hashes remain valid.
- Docker Compose for MySQL, API, static React service and Nginx reverse proxy.
- Nginx serves one origin, so production cookies, CORS and payment callbacks remain simple.

## Important source findings

1. The checked-in `alter_blogs_table_for_cms` migration is empty, while the Blog model, controllers and views require CMS fields such as `category_id`, `excerpt`, `featured_image`, `status` and `published_at`. The fresh-install schema in this project includes those fields. Before pointing this application at an existing database, run the schema audit documented in `DATABASE_MIGRATION.md`.
2. The Laravel `attendances.status` migration omits `leave`, but student reporting explicitly handles `leave`. The new schema accepts it.
3. Two Laravel migrations attempt to add `tech_rider_path`; one checks for the column. The final target schema has one column.
4. The local MySQL service was unavailable during analysis (`127.0.0.1:3306` refused the connection), so live record counts could not be captured or changed.
5. Existing public assets were copied; stored uploads must be copied separately during deployment.

## Security and compatibility

All database identifiers used by generic administration endpoints are server-side allow-listed. Inputs for public trust boundaries use DTO validation. Payment amounts are read from server records, signatures are verified using HMAC, and critical payment/seat/slot operations run in database transactions. React never receives secrets. Cookies are HTTP-only and secure in production. Admin and student APIs enforce roles on the server.

Uploaded media is type/size constrained for admissions and tech riders. Production should additionally scan uploads with the VPS security tooling if untrusted public uploads grow beyond the current use.

## Migration scope

The migration reaches public navigation and pages, authentication, user/role management, students, instructors, courses, admissions/enrollments, attendance, payments, expenses, reports, settings, events and registrations, blogs, gallery, inquiries, testimonials, jam sessions, receipts, uploads, mail and scheduled reminders. Docker, Nginx, backup/restore and Hostinger VPS instructions are included.
