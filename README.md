# next-13-lucia-auth-drizzle-turso-sqlite-magic-link

# Store Environment Variables

1. Copy `.env.example` file to `.env` file

```bash
cp .env.example .env # duplicate .env.example & name it .env
```

2. Change `DATABASE_PATH` to the filename of your choice

```bash
DATABASE_PATH=sqlite.db
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

1. signup -> create account with `email_verified=0` -> send verification email & log otp to console -> verify otp -> dashboard
2. login -> if user exists (send verification email & log otp to console) else (throw invalid email error) -> verify otp (`email_verified=1`) -> dashboard
