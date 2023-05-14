<div align="center" width="100%">
    <img src="https://status.schneile.tv/upload/logo1.png?t=1681677870891" width="128"/>
</div>

<div align="center" width="100%">
    <h2>SchneileTV VOD Archiv</h2>
</div>

## 🐳 Deploy

Copy [.env.example](.env.example) to `.env` and change the values as needed.
#### example `docker-compose.yml`
```yml
version: '3'
services:
    frontend:
        container_name: archiv-frontend
        build: .
        ports:
            - 8030:3000
        restart: always
```

## Building
Install dependencies with `pnpm install`, start a development server with `pnpm run dev`:

To create a production version of your app:

```bash
pnpm run build
```

You can preview the production build with `pnpm run preview`.

## 🚪 Reverse Proxy

My preferred way is to use NGINX Proxy Manager with a `Advanced Configuration`.

```
location / {
    proxy_pass http://192.168.10.36:8187;
    add_header X-Content-Type-Options "nosniff";
    add_header X-Frame-Options "SAMEORIGIN";
    add_header X-XSS-Protection "1; mode=block";
    add_header Referrer-Policy "same-origin";
    add_header Cache-Control "no-store, no-cache, must-revalidate, proxy-revalidate";
    gzip on;
}
```
