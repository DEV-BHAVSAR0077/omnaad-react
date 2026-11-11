# Migration test report

Date: 2026-11-11

## Automated results

| Check | Expected | Actual | Result |
|---|---|---|---|
| NestJS TypeScript build | No compile errors | `npm run build` completed | Pass |
| Backend unit test | Jam pricing preserves ₹1,100/hour + 18% GST | 1/1 passed | Pass |
| Backend production dependency audit | No known production vulnerability | 0 vulnerabilities | Pass |
| React TypeScript/Vite build | Production bundle emitted | 108 modules, 361.80 kB JS (115.56 kB gzip) | Pass |
| React smoke test | Admission and jam entry routes retained | 1/1 passed | Pass |
| Frontend production dependency audit | No known production vulnerability | 0 vulnerabilities | Pass |
| Docker Compose render | Valid merged service configuration | `docker compose config --quiet` completed | Pass |
| Docker image/container health | All services healthy | Docker Desktop engine is not running | Blocked by environment |
| Laravel source database connection | Read-only schema/count access | MySQL at `127.0.0.1:3306` refused connection | Blocked by environment |

## Workflow acceptance matrix

| Workflow | Implementation evidence | Live end-to-end result |
|---|---|---|
| Public pages/navigation/responsive layout | React routes and production build | Build verified; browser/data test pending |
| Public courses, gallery, events, blogs | Public API + React collection/detail pages | Database-dependent test pending |
| Contact inquiry | Validated API inserts `inquiries` | Database-dependent test pending |
| Event registration and seat decrement | Transaction + `FOR UPDATE` | Database-dependent test pending |
| Admission form/uploads/pricing | Validated multipart API and payment-plan multiplier | Database/Razorpay test pending |
| Jam slot overlap/pricing/booking | Transactional overlap query and tested pricing | Database/Razorpay test pending |
| Razorpay signature and webhook | HMAC verification, idempotency check, transactions | Live sandbox keys/webhook pending |
| Login/register/reset/verification/profile | Cookie session and Laravel bcrypt compatibility | SMTP/database test pending |
| Student dashboard/attendance/fees/history | Protected APIs and React portal | Role/data test pending |
| Admin dashboard and CRUD resources | Admin guard, server allow-list, React CRUD | Role/data test pending |
| CSV reports and PDF receipts | Protected CSV and streamed PDF endpoints | Data test pending |
| Five-minute reminders | Nest schedule + SMTP service | SMTP/time-window test pending |
| Existing data preservation | No destructive migration; count/orphan verifier supplied | Source/target databases unavailable |

## Required staging acceptance before cutover

1. Start MySQL and restore a production-like dump plus uploads.
2. Run backend migration and `npm run verify:data` with source/target connection variables.
3. Exercise login for Super Admin, Admin, permission-bearing custom role and Student; verify 401/403 cases.
4. Test create/edit/delete/search for every admin resource, including file replacement.
5. Complete one Razorpay test payment each for admission, jam room and student fee; replay each webhook to confirm idempotency.
6. Verify PDFs, CSVs, reset/verification email and a scheduled reminder.
7. Compare every Laravel workflow with the React result on desktop, tablet and phone.

No live deployment or live payment was claimed. The blocked cases require the user's database, Docker engine, credentials and domain infrastructure.
