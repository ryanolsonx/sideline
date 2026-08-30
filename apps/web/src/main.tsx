import { StrictMode } from 'react';
import { createRoot } from 'react-dom/client';
import { ApolloClient, ApolloProvider, HttpLink, InMemoryCache } from '@apollo/client';
import { App } from './app';
import './styles.css';

const client = new ApolloClient({
  link: new HttpLink({ uri: import.meta.env.VITE_GRAPHQL_URL ?? 'http://localhost:3000/graphql' }),
  cache: new InMemoryCache(),
});

createRoot(document.getElementById('root')!).render(
  <StrictMode>
    <ApolloProvider client={client}>
      <App />
    </ApolloProvider>
  </StrictMode>,
);
