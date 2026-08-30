# Architecture

This repository uses a TypeScript-first monorepo architecture with a NestJS backend, PostgreSQL persistence, GraphQL as the API boundary, and a React frontend.

The goal is to keep the system easy to understand, test, and evolve without introducing unnecessary infrastructure or distributed-system complexity.

## Technology Stack

Core technologies:

* TypeScript
* pnpm workspaces
* NestJS
* PostgreSQL
* TypeORM
* GraphQL
* React
* Apollo Client
* Vitest
* React Testing Library

The system is organized as a small monorepo with a single backend application and a single frontend application.

```text
apps/
├── api/
└── web/
```

Additional shared packages should be introduced only when there is a clear need.

## Architectural Style

The backend is organized by domain or feature rather than by global technical folders.

Prefer:

```text
src/
├── users/
├── teams/
├── matches/
└── billing/
```

over:

```text
src/
├── controllers/
├── services/
├── entities/
└── repositories/
```

Each feature owns the code necessary to implement that area of the system.

A typical backend module may look like:

```text
example/
├── api/
│   ├── example.dto.ts
│   ├── example.input.ts
│   └── example.resolver.ts
├── db/
│   ├── example.entity.ts
│   └── example.repository.ts
├── domain/
│   └── example.model.ts
├── service/
│   └── example.service.ts
└── example.module.ts
```

Not every feature needs every layer.

The architecture should remain proportional to the complexity of the feature.

## Backend Layers

The backend uses several simple layers with clear responsibilities.

### Domain

The domain layer contains plain TypeScript models and business rules.

It should avoid direct dependencies on:

* NestJS
* GraphQL
* TypeORM
* HTTP
* React

For example:

```ts
export interface Match {
    id: string;
    status: MatchStatus;
}

export function canStartMatch(match: Match): boolean {
    return match.status === MatchStatus.Scheduled;
}
```

The exact implementation style can vary. Business logic may use functions or classes depending on what makes the code easiest to understand.

The important rule is that core business behavior should not require a database or framework to execute.

### Database

The database layer contains TypeORM-specific code.

Typical responsibilities include:

* entities
* repositories
* queries
* persistence mapping

For example:

```ts
@Entity({ name: 'match' })
export class MatchEntity {
    @PrimaryGeneratedColumn('uuid')
    id!: string;

    @Column()
    status!: string;
}
```

Database entities are persistence representations.

They do not need to be the same TypeScript types used throughout the domain or GraphQL API.

For simple features, mapping may be trivial. More complex features may use explicit conversion between entity and domain types.

### Repository

Repositories encapsulate persistence operations.

For example:

```ts
@Injectable()
export class MatchRepository {
    constructor(
        @InjectRepository(MatchEntity)
        private readonly repository: Repository<MatchEntity>,
    ) {}

    findById(id: string) {
        return this.repository.findOneBy({ id });
    }

    save(match: MatchEntity) {
        return this.repository.save(match);
    }
}
```

Repositories should contain database behavior, not business decisions.

Avoid spreading TypeORM queries throughout services and resolvers when a repository provides a clearer boundary.

### Service

The service layer coordinates application behavior.

Typical responsibilities include:

* loading data
* invoking business logic
* modifying state
* persisting changes
* defining transaction boundaries
* coordinating with other modules

For example:

```ts
@Injectable()
export class MatchService {
    constructor(
        private readonly matchRepository: MatchRepository,
    ) {}

    async startMatch(id: string) {
        const match = await this.matchRepository.findById(id);

        if (!match) {
            throw new NotFoundException();
        }

        if (match.status !== 'SCHEDULED') {
            throw new BadRequestException('Match cannot be started');
        }

        match.status = 'ACTIVE';

        return this.matchRepository.save(match);
    }
}
```

As logic becomes more complicated, business rules should move out of the service and into plain TypeScript domain code.

Services should primarily coordinate work.

### API

The API layer exposes functionality through GraphQL.

Resolvers should remain thin.

A resolver should generally:

1. accept GraphQL arguments
2. identify or validate the current user
3. perform API-level authorization where necessary
4. call a service
5. return a GraphQL DTO

For example:

```ts
@Resolver(() => MatchDTO)
export class MatchResolver {
    constructor(
        private readonly matchService: MatchService,
    ) {}

    @Mutation(() => MatchDTO)
    startMatch(
        @Args('id') id: string,
    ) {
        return this.matchService.startMatch(id);
    }
}
```

Resolvers should not contain substantial business logic or database queries.

## Code-First GraphQL

The backend uses NestJS GraphQL in code-first mode.

TypeScript classes define the GraphQL schema.

For example:

```ts
@ObjectType()
export class MatchDTO {
    @Field(() => ID)
    id!: string;

    @Field()
    status!: string;
}
```

Inputs are also defined in TypeScript:

```ts
@InputType()
export class CreateMatchInput {
    @Field()
    name!: string;
}
```

The GraphQL SDL is generated from the TypeScript source.

The generated schema may be committed to the repository so API changes are visible directly in code review.

```text
apps/api/schema.gql
```

The generated file should not be edited manually.

This gives the system a TypeScript source of truth while still providing reviewers with a readable API-contract diff.

## GraphQL Types and Database Types

A backend concept may have separate representations for different purposes.

For example:

```text
Domain model
Database entity
GraphQL DTO
```

These types should not be combined automatically simply because they contain similar fields.

Each represents a different boundary:

* the domain model represents application behavior
* the entity represents persistence
* the DTO represents the API contract

For very simple objects, duplication should remain lightweight.

The separation becomes valuable when one representation changes without requiring the others to change.

## Validation

GraphQL inputs should use standard validation decorators where appropriate.

For example:

```ts
@InputType()
export class UpdateMatchInput {
    @Field(() => ID)
    @IsUUID()
    id!: string;

    @Field({ nullable: true })
    @IsOptional()
    @IsString()
    name?: string;
}
```

NestJS should configure a global `ValidationPipe`.

Input validation handles structural questions such as:

* is the value present?
* is it a valid UUID?
* is the string within the expected shape?

Business rules should remain in the service or domain layer.

## Transactions

Use database transactions when an operation contains multiple writes that must succeed or fail together.

The transaction boundary should be easy to see in service code.

For example:

```ts
await this.dataSource.transaction(async manager => {
    await manager.save(firstEntity);
    await manager.save(secondEntity);
});
```

Do not introduce event sourcing or an event log simply to model ordinary application updates.

PostgreSQL remains the source of truth for current application state.

Normal relational tables, transactions, and migrations are sufficient unless a future feature creates a concrete reason for something more complex.

## Migrations

Database changes should use TypeORM migrations.

Schema changes should be represented explicitly and reviewed alongside the entity changes that require them.

Migrations should be deterministic and should avoid importing application logic that may change later.

A normal persistence change therefore looks roughly like:

```text
entity change
migration
repository change
repository/integration tests
```

## Cross-Module Communication

Modules should interact through public service or API boundaries rather than directly accessing another module's repository.

For example:

```ts
@Injectable()
export class MatchService {
    constructor(
        private readonly teamService: TeamService,
    ) {}
}
```

Avoid:

```ts
constructor(
    private readonly teamRepository: TeamRepository,
) {}
```

when the repository belongs to another feature module.

This keeps persistence details private to the module that owns them.

For a small application, avoid introducing elaborate client abstractions unless they solve a real dependency problem.

## Frontend Architecture

The frontend is a React application organized around screens or features.

For example:

```text
src/
├── screens/
│   ├── teams/
│   ├── matches/
│   └── settings/
└── components/
```

Feature-specific components, hooks, state, tests, and GraphQL operations should remain close to the feature that uses them.

Example:

```text
screens/matches/
├── MatchList.graphql.tsx
├── MatchDetails.graphql.tsx
├── components/
│   ├── MatchCard.tsx
│   └── MatchStatus.tsx
└── __tests__/
```

## Inline and Colocated GraphQL

GraphQL operations are defined inline with or next to the React code that consumes them.

For example:

```tsx
const Match_Query = graphql(`
    query Match_Query($id: ID!) {
        match(id: $id) {
            id
            status
        }
    }
`);
```

Prefer feature-local GraphQL operations over global directories such as:

```text
graphql/
├── queries/
├── mutations/
└── fragments/
```

A shared GraphQL operation should move to a common location only when multiple unrelated features genuinely consume it.

Colocation makes a component's data requirements visible in the same area of the codebase as the component itself.

### Fragment-Colocated Screen Queries

For React components that render GraphQL-backed data, use **Relay-style fragment colocation** with GraphQL Code Generator's client-preset fragment masking. This is the default frontend GraphQL pattern in this repository. GraphQL data flows down through component props; only a screen, route, or explicit data container may use Apollo query or mutation hooks.

This is a pattern supported by the existing `@graphql-codegen/client-preset`, not a separate "Inline GraphQL React" package and not a requirement to adopt Relay. The preset is already configured in `apps/web/codegen.ts` and generates the helpers in `src/gql/fragment-masking.ts`.

Each data-rendering component exports one or more named fragments that describe only the fields it reads. A screen or route owns the top-level operation, composes the child fragments with spreads, and passes the resulting fragment references down. A component must not reach into an ancestor's operation result for fields that are not in its own fragment.

```tsx
// components/MatchCard.tsx
import { FragmentType, getFragmentData, graphql } from '../../../gql';

export const MatchCard_MatchFragment = graphql(/* GraphQL */ `
  fragment MatchCard_Match on Match {
    id
    name
    createdAt
  }
`);

export function MatchCard({ match }: {
  match: FragmentType<typeof MatchCard_MatchFragment>;
}) {
  const data = getFragmentData(MatchCard_MatchFragment, match);

  return <li>{data.name}</li>;
}
```

```tsx
// MatchesScreen.graphql.ts
import { graphql } from '../../gql';

export const MatchesScreen_MatchesQuery = graphql(/* GraphQL */ `
  query MatchesScreen_Matches {
    matches {
      ...MatchCard_Match
    }
  }
`);
```

```tsx
// MatchesScreen.tsx
const { data } = useQuery(MatchesScreen_MatchesQuery);

return data?.matches.map((match) => (
  <MatchCard key={match.id} match={match} />
));
```

`FragmentType<typeof Fragment>` is deliberately an opaque fragment reference, not the fragment's field-data type. `getFragmentData(Fragment, reference)` is a generated type-level unmasking helper; it does not issue another network request, read Apollo's cache, or subscribe to anything. It prevents the component from reading fields it did not declare. It is intentionally named as a regular function rather than `useFragmentData` or `useFragment`, because it is not a hook and must not suggest that it manages data fetching.

Removing a field from a fragment trims it from every operation that spreads that fragment the next time `pnpm codegen` runs. Removing a component is a deliberate paired edit: remove its JSX, fragment, and its parent fragment spread. If a spread remains after its fragment is deleted, code generation fails validation rather than guessing whether the component is reachable. Conversely, adding a field to a component's fragment adds it to every operation that intentionally spreads that fragment. This keeps query shape aligned with the rendered component tree while retaining one screen-level Apollo query.

Keep generic, reusable visual primitives (for example, a `Button` or a layout-only card) GraphQL-free and pass ordinary props. Use fragment props for components whose purpose is to render a GraphQL object or a meaningful part of one. A component may define nested fragments and compose them in its own fragment; the screen should normally spread only its immediate children's fragments. Child components must not call `useQuery`, `useLazyQuery`, `useSuspenseQuery`, or Apollo's runtime `useFragment`; their data dependency is the typed prop.

Fragment definitions must have stable, globally unique names based on their component and GraphQL type, such as `MatchCard_Match`. Do not define broad catch-all fragments or export generated operation-result types as component props. After adding, changing, or removing any operation or fragment, run `pnpm codegen` and commit the generated `apps/web/src/gql/` artifacts.

## GraphQL Code Generation

Frontend GraphQL documents should be statically analyzed and code-generated into strongly typed TypeScript artifacts.

The generated backend schema serves as the API input to client code generation.

Conceptually:

```text
NestJS TypeScript
        ↓
generated schema.gql
        ↓
inline frontend GraphQL documents
        ↓
generated TypeScript operation types
```

The client preset also generates typed document nodes and fragment-masking helpers. It statically analyzes fragments as well as operations, so fragment colocation remains type-safe without hand-written data interfaces.

The React application should depend on the GraphQL contract, not on backend domain or entity types.

Do not import backend TypeScript models directly into the frontend.

## Apollo Client

Apollo Client manages GraphQL server state.

Use Apollo directly unless the application develops a concrete need for a wrapper abstraction.

Prefer straightforward patterns:

* `useQuery`
* `useMutation`
* fragments
* refetching affected queries after mutations

Avoid adding complexity prematurely through:

* GraphQL subscriptions
* optimistic updates
* extensive manual cache manipulation
* custom Apollo abstraction packages

Those patterns can be introduced later if a real product requirement justifies them.

## Client State

Separate server state from local UI state.

Apollo owns data received from the backend.

React state or a small state-management library may own local interaction state such as:

* selected items
* open dialogs
* filters
* drag state
* temporary form state

Avoid introducing global state management unless the state is genuinely global.

## Presentational Components

Purely presentational and generic UI components should remain independent of GraphQL when practical. Components that represent a GraphQL object and declare their own fields instead receive a masked fragment reference, as described in [Fragment-Colocated Screen Queries](#fragment-colocated-screen-queries).

For example:

```tsx
<MatchCard
    match={match}
    onStart={handleStart}
/>
```

The screen-level GraphQL-connected component owns the top-level operation and mutations. It can pass either ordinary props to generic components or masked fragment references to data-rendering components.

The presentational component receives ordinary props.

This keeps network behavior and interaction design separately understandable and testable.

## Testing

Tests should align with architectural boundaries.

### Domain

Use fast unit tests for pure business rules.

### Repository

Use integration tests against PostgreSQL for important persistence behavior.

Testcontainers is appropriate for this.

### Service

Test orchestration by mocking repository or module boundaries where useful.

### Resolver

Test GraphQL argument handling, authorization behavior, and service invocation.

### React

Use React Testing Library to test behavior visible to the user.

Avoid testing implementation details unnecessarily.

## Monorepo

Use pnpm workspaces as the default monorepo tooling.

For example:

```text
/
├── apps/
│   ├── api/
│   └── web/
├── packages/
├── package.json
└── pnpm-workspace.yaml
```

Do not add Nx, Lerna, Turborepo, or custom build orchestration unless repository scale creates a concrete need for them.

A small monorepo should remain operationally simple.

## Shared Packages

Shared packages should be uncommon.

Good candidates include:

* generated GraphQL client artifacts
* truly shared configuration
* a mature shared UI library if one eventually emerges

Poor candidates include:

* backend domain models
* TypeORM entities
* feature-specific utilities
* types shared only to avoid writing a GraphQL DTO

The GraphQL schema is the contract between backend and frontend.

That boundary should remain explicit.

## What This Architecture Does Not Use

Unless requirements change, this architecture intentionally avoids:

* event sourcing
* CQRS infrastructure
* Temporal
* distributed workflows
* microservices
* GraphQL federation
* message brokers
* event buses
* GraphQL subscriptions
* unnecessary shared packages
* complex monorepo orchestration
* generic repository frameworks
* deep abstraction layers

The default is a conventional TypeScript application backed by PostgreSQL.

Add infrastructure only when a concrete problem requires it.

## Dependency Summary

At a high level:

```text
React
  ↓
Inline GraphQL operations
  ↓
GraphQL API
  ↓
NestJS resolver
  ↓
Service
  ↓
Domain logic
  ↓
Repository
  ↓
TypeORM
  ↓
PostgreSQL
```

The system should remain understandable by following this path from the UI to the database and back.

The architecture favors explicit boundaries, plain TypeScript business logic, code-first GraphQL, straightforward relational persistence, and feature-local frontend code over framework-heavy abstractions.
