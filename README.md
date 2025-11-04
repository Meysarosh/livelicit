# Auction App – Helyi futtatás (rövid)

## Előfeltételek

- **Node.js 20+** (ajánlott: nvm)
- **Docker Desktop** (Compose támogatással)
- **Git**

## Környezeti változók (env példa)

Másold az alábbi tartalmat `.env` fájlba (a valódi titkokat ne committold).

```dotenv
# .env (helyi fejlesztéshez)
DATABASE_URL="postgresql://postgres:postgres@localhost:5432/auctiondb?schema=public"

# Auth.js / NextAuth
NEXTAUTH_SECRET="change-me"
NEXTAUTH_URL="http://localhost:3000"
AUTH_TRUST_HOST=true
```

## Adatbázis indítása Dockerben

```bash
docker compose up -d db
```

> Az adatbázis ezután a `localhost:5432` címen érhető el, alapértelmezett felhasználó/jelszó: `postgres` / `postgres`.

## Függőségek, Prisma migrációk

A DB-nek futnia kell az alábbi parancsok előtt.

```bash
npm install
npx prisma migrate dev
```
