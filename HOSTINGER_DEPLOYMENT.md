# Hostinger VPS deployment

Docker requires a Hostinger VPS; standard shared hosting is not sufficient.

## Information required

- VPS public IP and sudo SSH user.
- Domain/subdomain and DNS control.
- Production database, root and JWT secrets.
- Razorpay live key, secret and webhook secret.
- SMTP host/account and verified From address.

## Server preparation (Ubuntu)

Install Docker Engine and the Compose plugin from Docker's official Ubuntu repository. Enable only SSH and web traffic:

```bash
sudo ufw allow OpenSSH
sudo ufw allow 'Nginx Full'
sudo ufw enable
```

Create `/opt/omnaad`, copy this project there, create `.env` with permissions `600`, and do not expose MySQL publicly.

## DNS and TLS

Point the domain A/AAAA record to the VPS. Install host Nginx and Certbot. Proxy HTTPS to the Compose service on `127.0.0.1:8080`:

```nginx
server {
  server_name example.com www.example.com;
  location / {
    proxy_pass http://127.0.0.1:8080;
    proxy_set_header Host $host;
    proxy_set_header X-Real-IP $remote_addr;
    proxy_set_header X-Forwarded-For $proxy_add_x_forwarded_for;
    proxy_set_header X-Forwarded-Proto $scheme;
  }
}
```

```bash
sudo certbot --nginx -d example.com -d www.example.com
```

Set `APP_URL` and `FRONTEND_URL` to the final HTTPS origin, then start:

```bash
docker compose -f docker-compose.yml -f docker-compose.prod.yml up -d --build
docker compose ps
curl -f https://example.com/api/health
```

## Razorpay

Configure the production webhook URL as `https://example.com/api/payments/webhook` after adding the same secret to `.env`. Make a low-value live payment and verify the payment, booking/admission, receipt and Razorpay dashboard before launch.

## Backups

Run a nightly `mysqldump --single-transaction`, archive the upload volume, encrypt backups, and copy them off the VPS. Retain daily, weekly and monthly generations. Test a restore at least quarterly.

## Updates and rollback

```bash
cd /opt/omnaad
git pull --ff-only
docker compose -f docker-compose.yml -f docker-compose.prod.yml build
docker compose -f docker-compose.yml -f docker-compose.prod.yml up -d
docker compose logs --tail=200 backend nginx
```

Keep the prior image tags and the pre-deploy database/upload backup. Application rollback is image-based; database rollback is backup-based and must account for payments/writes received after deployment.
