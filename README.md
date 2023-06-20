# next-13-lucia-auth-drizzle-turso-sqlite-magic-link

# Store Environment Variables

1. Copy `.env.example` file to `.env` file

```bash
cp .env.example .env # duplicate .env.example & name it .env
```

2. Change `SQLITE_URL` to the filename of your choice

```bash
SQLITE_URL=sqlite.db
```

## Install the dependencies

```bash
pnpm install
```

## Start the server

```bash
pnpm start
```

## Push schema changes to database

```bash
pnpm db:push
```

## Generate Migrations

```bash
pnpm db:generate
```
