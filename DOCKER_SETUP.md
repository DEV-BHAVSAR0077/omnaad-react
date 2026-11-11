# Docker setup

## Services

- `mysql`: MySQL 8.4 with a persistent named volume and health check.
- `backend`: non-root NestJS runtime with persistent uploads.
- `frontend`: multi-stage React build served by a small Nginx image.
- `nginx`: public reverse proxy for the SPA, `/api` and `/uploads`.

## Commands

```bash
docker compose up -d --build
docker compose ps
docker compose logs -f backend
docker compose restart backend
docker compose down
docker compose down --remove-orphans
```

Do not use `docker compose down -v` in an environment containing real data; it deletes named volumes.

## Database migrations

```bash
docker compose exec backend npx typeorm migration:run -d dist/database/data-source.js
```

The initial migration creates missing tables only. Its down operation deliberately fails to prevent accidental production data deletion.

## Backup and restore

```bash
docker compose exec -T mysql mysqldump -u root -p"$DB_ROOT_PASSWORD" --single-transaction --routines --triggers "$DB_DATABASE" > backup.sql
docker compose exec -T mysql mysql -u root -p"$DB_ROOT_PASSWORD" "$DB_DATABASE" < backup.sql
```

Back up the uploads volume independently. Test restores on a separate staging stack.

## Production overlay

```bash
docker compose -f docker-compose.yml -f docker-compose.prod.yml up -d --build
```

The production overlay binds the project Nginx to loopback port 8080 so the VPS host Nginx/Certbot can terminate TLS.
