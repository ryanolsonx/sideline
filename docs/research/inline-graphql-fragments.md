# Component-owned GraphQL fragments

## Recommendation

Adopt **component-owned named fragments with GraphQL Code Generator client-preset fragment masking**. This is the pattern in question, not a new `Inline GraphQL React` package: the repository already installs `@graphql-codegen/client-preset` and configures `preset: 'client'` in `apps/web/codegen.ts`.

Each data-rendering component declares and exports the named fragment for the GraphQL object it receives. A screen (or other data boundary) owns the one network operation, spreads each rendered child component's fragment, and passes the selected object to that child. The code generator composes the referenced fragment definitions into the typed operation; no JavaScript template-literal interpolation or extra query-concatenation package is needed. [GraphQL Code Generator's React guide](https://the-guild.dev/graphql/codegen/docs/guides/react-vue) documents this exact arrangement, including a component-local fragment and a parent query that only references its name.

This is the same component-data model associated with Relay, but it works with the existing Apollo Client and does **not** require adopting Relay or its compiler. Relay remains a reasonable alternative only if we deliberately want its full client/runtime model. [Relay describes fragments as the data requirements of the components that render them](https://relay.dev/docs/guided-tour/rendering/fragments/).

## Convention

1. A screen, route, or explicit data container performs the network request with `useQuery`.
2. A presentational component that consumes GraphQL data exports one named fragment beside its implementation, named after the component (for example, `MatchCard_Match`). It must select every field it renders, including a stable `id` when the parent needs it for a React key or Apollo normalization.
3. The data boundary spreads (`...MatchCard_Match`) every child fragment it passes down. A parent must select its own fields directly or in its own fragment; it must not read a child's fragment fields.
4. The component prop is a masked fragment reference and the component unmasks it locally:

   ```tsx
   import { graphql } from '../../../gql';
   import { type FragmentType, getFragmentData } from '../../../gql/fragment-masking';

   export const MatchCardFragment = graphql(/* GraphQL */ `
     fragment MatchCard_Match on Match {
       id
       name
       createdAt
     }
   `);

   export function MatchCard({ match: matchRef }: { match: FragmentType<typeof MatchCardFragment> }) {
     const match = getFragmentData(MatchCardFragment, matchRef);
     return <li>{match.name}</li>;
   }
   ```

   ```tsx
   const MatchesQuery = graphql(/* GraphQL */ `
     query MatchesScreen_Matches {
       matches {
         ...MatchCard_Match
       }
     }
   `);

   // <MatchCard match={match} />
   ```

5. Run `pnpm codegen` after changing an operation or fragment; generated files under `apps/web/src/gql/` remain committed.

Fragment masking deliberately prevents a component from accessing fields belonging to its parent or sibling. `FragmentType<typeof MatchCardFragment>` is a **masked fragment reference**, not the unmasked result shape. For a pure helper that needs the actual selected fields, use `ResultOf<typeof MatchCardFragment>` (or the generated `MatchCard_MatchFragment` type); use `makeFragmentData` to create a fragment reference in tests. The local generated unmasking helper is configured as `getFragmentData` rather than `useFragment`, because it does not fetch, subscribe, or otherwise behave as a React hook. [The client-preset documentation explains the distinction and the generated helpers](https://the-guild.dev/graphql/codegen/plugins/presets/preset-client#fragment-masking).

## What “automatic trimming” means

Changing a child fragment changes every generated operation that spreads it, so removing a field from a component's fragment removes that field from the network operation after code generation. Removing a child altogether still requires removing its JSX and its fragment spread from the parent query; static GraphQL cannot infer UI reachability from React's component tree. That explicit deletion is small, reviewable, and prevents a stale fragment from silently continuing to fetch data.

## Keep Codegen masking separate from Apollo runtime masking

The generated `getFragmentData` helper in `apps/web/src/gql/fragment-masking.ts` is a TypeScript unmasking helper; it is not a React hook and does not read or subscribe to Apollo's cache.

Apollo Client also offers `dataMasking: true` and an Apollo `useFragment` cache API. That is a separate runtime feature with cache-key requirements and should not be enabled alongside this established Codegen-masking convention without a deliberate migration. Apollo's documentation specifically advises against its fragment registry when using the Codegen client preset. [Apollo's fragments and data-masking documentation](https://www.apollographql.com/docs/react/data/fragments) covers both the runtime behavior and that interoperability guidance.

## Adoption scope

No dependency or code-generation configuration change is necessary for the initial rollout. Adopt the convention in the next screen that has a non-trivial data-rendering child (the current `MatchCard` is a suitable first example), then preserve the rule for new feature work. Avoid fragments for tiny leaf components that only receive ordinary display props or for UI that has no GraphQL data requirement.

## Sources

- [GraphQL Code Generator: React/Vue guide](https://the-guild.dev/graphql/codegen/docs/guides/react-vue)
- [GraphQL Code Generator: client preset and fragment masking](https://the-guild.dev/graphql/codegen/plugins/presets/preset-client#fragment-masking)
- [Apollo Client: fragments and data masking](https://www.apollographql.com/docs/react/data/fragments)
- [Relay: rendering with fragments](https://relay.dev/docs/guided-tour/rendering/fragments/)
