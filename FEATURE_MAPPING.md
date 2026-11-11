# Feature mapping

| Laravel feature | Source implementation | React / NestJS replacement |
|---|---|---|
| Home, About, Classes, Studio | `FrontendController`, Blade frontend views | React public pages, `/api/public/*` |
| Gallery | Gallery models/controllers, media streaming | React gallery, paginated public API, `/uploads` |
| Events and registration | Event controllers/models | Event list/detail API and transaction-safe seat registration |
| Blog CMS | Blog controllers/models/views | Public blog routes and admin CRUD |
| Contact | `submitContact`, `inquiries` | Validated contact API and admin inquiries |
| Admission | `AdmissionController`, `StoreAdmissionRequest` | Multipart React form and Admissions module |
| Admission payment | Razorpay/Payment/Receipt services | Server-priced Razorpay order, HMAC verify, transactional payment and PDF receipt |
| Jam booking | Jam controllers/services | Availability API and row-locked overlap check |
| Jam payment | Jam payment/webhook services | Razorpay order/verify and confirmed booking receipt |
| Authentication | Laravel Breeze | Cookie JWT login/register/logout/reset/profile, compatible with Laravel bcrypt |
| Roles and permissions | `RoleMiddleware`, role/permission tables | Server guards and allow-listed admin APIs |
| Student dashboard | Student controllers/views | Protected React portal and `/api/student/*` |
| Student fees/history | `Student\FeeController` | Partial fee orders, payment verification, history and receipts |
| Attendance | Admin/student attendance controllers | Admin CRUD and student summary/list |
| Users/students/instructors | Admin resource controllers | Dynamic admin screens with protected CRUD APIs |
| Payments/expenses/categories | Admin controllers | Dynamic admin CRUD and CSV reports |
| Settings | Settings controller and shared views | Admin settings API; public settings endpoint |
| Jam email reminders | Artisan command every five minutes | Nest Schedule cron every five minutes |
| PDF receipts | DomPDF services | PDFKit streamed downloads |
| Reports | Laravel streamed CSV | Authenticated CSV endpoints |

## Role behavior

- `Super Admin`: all administration routes.
- `Admin`: administration routes.
- Any role with attached permissions: administration access, matching the Laravel middleware behavior.
- `Student`: student portal only; admin routes return 403.
- Guest: public content, admissions, jam booking, event registration and contact.

## External dependencies

- Razorpay: admissions, student fees and jam-session payment.
- SMTP: reset links and scheduled reminders.
- MySQL: all persistent application data.
- Persistent upload volume: photos, documents, CMS media and tech riders.
