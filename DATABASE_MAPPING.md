# Database mapping

The target keeps Laravel's table names so an existing database can be reused without a destructive rewrite.

| Area | Tables | Main relationships / constraints |
|---|---|---|
| Identity | `users`, `roles`, `permissions`, `permission_role`, `password_reset_tokens` | user → role; role ↔ permissions; unique user email |
| People | `students`, `teachers` | each belongs to a user and cascades on user deletion |
| Courses | `courses`, `student_admissions`, `attendances` | admission optionally links to user; attendance links user/course |
| Money | `payment_categories`, `payments`, `receipts` | payments can link admission/user and polymorphic Laravel payable; receipts link admission/payment |
| CMS | `settings`, `testimonials`, `inquiries`, `blog_categories`, `blogs` | blog belongs to category/author; slugs are unique |
| Gallery | `gallery_categories`, `gallery_items` | item belongs to category and cascades |
| Events | `events`, `event_gallery`, `event_registrations` | gallery and registrations cascade with event |
| Jam room | `jam_sessions`, `participants`, `jam_session_payments` | participants/payments cascade with booking; booking number unique |
| Expenses | `expense_categories`, `expenses` | expense belongs to category |

## Indexes

Unique indexes cover emails, role/permission/category names, application/booking/receipt numbers and public slugs. Operational indexes cover payment polymorphic keys, event date/status/featured state, and jam session date/time/status. Foreign-key columns receive indexes from their constraints.

## Type compatibility

- Money remains `DECIMAL`, never floating-point storage.
- Existing Laravel timestamps remain nullable where Laravel created them nullable.
- JSON is retained for gateway responses and jam instruments.
- Existing `$2y$` bcrypt password hashes are accepted by normalizing the prefix only during comparison; hashes are never rewritten until the user changes a password.
- `payable_type` keeps Laravel class strings, preserving existing polymorphic records.

## Known schema reconciliation

Run the audit before migration. In particular, verify CMS columns on `blogs`, `user_id` on `student_admissions`, `payment_category_id` on `payments`, and `tech_rider_path` / payment columns on `jam_sessions`. The supplied fresh schema is authoritative for new installations, but it does not automatically alter an existing production table.
