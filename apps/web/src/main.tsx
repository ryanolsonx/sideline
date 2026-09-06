import { StrictMode } from 'react';
import { createRoot } from 'react-dom/client';
import { ApolloClient, ApolloProvider, HttpLink, InMemoryCache } from '@apollo/client';
import { App } from './app';
import { LiveGamePrototype } from './prototypes/live-game';
import './styles.css';

const client = new ApolloClient({
  link: new HttpLink({ uri: import.meta.env.VITE_GRAPHQL_URL ?? 'http://localhost:3000/graphql' }),
  cache: new InMemoryCache(),
});

/** PROTOTYPE hatch: `?prototype=live-game` renders throwaway variants with no API behind them. */
const prototype = import.meta.env.DEV
  ? new URLSearchParams(window.location.search).get('prototype')
  : null;

createRoot(document.getElementById('root')!).render(
  <StrictMode>
    {prototype === 'live-game' ? (
      <LiveGamePrototype />
    ) : (
      <ApolloProvider client={client}>
        <App />
      </ApolloProvider>
    )}
  </StrictMode>,
);
