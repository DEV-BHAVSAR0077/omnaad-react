# Database migration

## Safety rules

Never run against the only production copy. Never truncate or reset the Laravel database. Keep database and upload backups from the same timestamp.

## 1. Back up Laravel

```bash
mysqldump --single-transaction --routines --triggers --hex-blob -h SOURCE_HOST -u SOURCE_USER -p omnaad > omnaad-pre-migration.sql
tar -czf omnaad-uploads.tar.gz /path/to/laravel/storage/app/public
```

Record SHA-256 hashes for both files and perform a test restore.

## 2. Restore into staging

Start this stack with an empty MySQL volume, run the migration, then restore the Laravel dump into a separate staging database. If reusing the restored Laravel database directly, do not run broad schema alteration automatically: first compare it with `backend/database/schema.sql`.

Check required columns:

```sql
SELECT table_name, column_name, column_type, is_nullable
FROM information_schema.columns
WHERE table_schema = DATABASE()
  AND table_name IN ('blogs','payments','student_admissions','jam_sessions')
ORDER BY table_name, ordinal_position;
```

Resolve the known Blog CMS migration gap with an explicit, reviewed forward migration if the live table lacks the fields listed in `DATABASE_MAPPING.md`.

## 3. Preserve passwords and relations

No password conversion is required. The API accepts Laravel `$2y$` bcrypt hashes. Preserve IDs, timestamps, polymorphic `payable_type` values, Razorpay IDs, receipt numbers and upload paths.

## 4. Copy uploads

Copy `storage/app/public/*` into the persistent backend upload mount, retaining relative paths. New uploads are served under `/uploads/`.

## 5. Verify

Set `SOURCE_DB_*` and `TARGET_DB_*` environment variables, then:

```bash
cd backend
npm run verify:data
```

The command compares table counts and checks core orphan relationships. Also sample admissions, payments, receipts, event galleries and jam participants manually.

## 6. Cutover

1. Put Laravel into maintenance/read-only mode.
2. Take final database/upload backups.
3. Restore final data and uploads.
4. Run the verification command.
5. Start the production Compose stack and execute smoke tests.
6. Route HTTPS traffic to the new stack.

Keep the original Laravel app and final backups until business acceptance.
