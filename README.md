# next-13-lucia-auth-drizzle-turso-sqlite-magic-link

## Installation

1. Install Turso on your machine:

```bash
curl -sSfL https://get.tur.so/install.sh | bash
```

2. Verify the installation:

```bash
turso --version
```

## Generate Auth Token

1. Use the auth command to start the login process. The command launches your default browser and prompts you to log in with GitHub:

```bash
turso auth login
```

2. Create a new Turso database:

```bash
turso db create magic-link
```

3. Create an auth token to get access to your database using libSQL. Copy the auth token to Clipboard.

```bash
turso db tokens create magic-link
```

# Store Environment Variables

1. Change the `.env` file to use the Turso database

```bash
cp .env.example .env # duplicate .env.example & name it .env
```

2. Paste the generated auth token above in `.env` file next to `TURSO_AUTH_TOKEN`:

```bash
TURSO_AUTH_TOKEN=[paste-the-generated-auth-token-without-brackets]
```

3. Run this command to get the database URL:

```
turso db show magic-link --url
```

4. Paste the generated url above in `.env` file next to `TURSO_URL`:

```bash
TURSO_URL=libsql://[your-database]-[your-github].turso.io
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

### Flow

1. `/api/signup` -> if email already exists, return 400 error. if not, then send magic link via email & redirect to `/verify-email` page with further instructions

2. `/api/login` -> if email doesn't exist in the database, return 400 error. if not, then send magic link via email & redirect to `/verify-email` page with further instructions

3. `/api/verify-email` -> if magic link is clicked inside email, then verify email on `/api/verify-email`. finally, create lucia session & redirect to `/dashboard`

4. `/api/logout` -> if logout button is clicked, then invalidate all sessions & redirect to `/login`

5. redirect from `/`, `/login`, `/signup`, `/check-email` to `/dashboard` if session exists.

6. redirect from `/dashboard` to `/login` if session doesn't exist.

