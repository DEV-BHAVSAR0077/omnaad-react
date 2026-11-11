# Migration roadmap

1. **Inventory and mapping** — completed from the checked-in Laravel source. Live database inspection remains gated by MySQL availability.
2. **Parallel application** — React and NestJS application implemented in this separate directory; Laravel remains the rollback system.
3. **Schema audit** — run the documented information-schema checks against a restored staging copy.
4. **Data rehearsal** — dump the Laravel database, restore it into staging, copy uploads, then run `npm run verify:data`.
5. **Integration configuration** — add staging Razorpay webhook, SMTP and real domain settings.
6. **Acceptance rehearsal** — execute every row in `MIGRATION_TEST_REPORT.md` with representative production-like data.
7. **Cutover** — take a final backup, briefly stop writes to Laravel, restore the final dump, verify counts, start Docker and change DNS/reverse proxy.
8. **Observation** — monitor API, Nginx, payment webhook and reminder logs; retain the Laravel server and backups until sign-off.

## Rollback

Do not run destructive down migrations. If cutover fails, route traffic back to Laravel and restore the pre-cutover database/upload snapshots only if the new application accepted writes. Document any payments received during the cutover window before rollback.
