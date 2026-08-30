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

## GraphQL API

The NestJS API exposes its code-first GraphQL endpoint at `http://localhost:3000/graphql`.
The committed `apps/api/schema.gql` is generated from the API TypeScript source:

```sh
pnpm schema:generate
```

## Web application

The React/Vite application lives in `apps/web` and runs on port 5173.

```sh
pnpm dev:web
```

## Typed GraphQL client

Frontend operations are colocated with their screens. Generate the typed artifacts from the API schema after changing an operation or API DTO:

```sh
pnpm schema:generate
pnpm codegen
```

## Run the full vertical slice

Prerequisites: Node.js 22.13 or later, pnpm 11.9 or later, Docker, and Docker Compose v2 (`docker compose`). The project CI uses Node.js 22.13.0; use `nvm use` to select that version when using nvm.

For a first-time setup (or to refresh dependencies, migrations, and generated GraphQL artifacts), run:

```sh
pnpm serve
```

This installs dependencies, starts PostgreSQL, applies migrations, generates GraphQL artifacts, and starts the API and web development servers. Stop it with `Ctrl+C`; the database keeps running until `pnpm db:down`.

The equivalent individual commands are:

```sh
pnpm install
pnpm db:up
pnpm db:migrate
pnpm schema:generate
pnpm codegen
pnpm dev
```

Open http://localhost:5173. Clicking **Save match** calls the GraphQL mutation, persists a row in PostgreSQL, refetches `matches`, and displays the saved record.
