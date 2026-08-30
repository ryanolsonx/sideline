# Sideline

Sideline is a TypeScript monorepo. Its planned application architecture is documented in [ARCHITECTURE.md](ARCHITECTURE.md).

## Local database

Docker Compose provides PostgreSQL 16 at `localhost:5432` using the credentials in `.env.example`.

```sh
pnpm db:up
pnpm db:down
```

## API application

The NestJS application lives in `apps/api` and runs on port 3000.

```sh
pnpm dev:api
```

## Database migrations

The API owns TypeORM migrations. Apply them against the local PostgreSQL service with:

```sh
pnpm db:migrate
```
