import { FormEvent, useState } from 'react';
import { useMutation, useQuery } from '@apollo/client';
import { MatchCard } from './components/MatchCard';
import { CreateMatchMutation, MatchesQuery } from './MatchesScreen.graphql';

export function MatchesScreen() {
  const [name, setName] = useState('Friday night match');
  const { data, loading, error } = useQuery(MatchesQuery);
  const [createMatch, { loading: isSaving, error: saveError }] = useMutation(CreateMatchMutation, {
    refetchQueries: [MatchesQuery],
  });

  async function handleSubmit(event: FormEvent<HTMLFormElement>) {
    event.preventDefault();
    await createMatch({ variables: { input: { name } } });
  }

  return (
    <main className="page-shell">
      <section className="hero">
        <p className="eyebrow">Sideline</p>
        <h1>Matches, end to end.</h1>
        <p className="intro">
          This screen writes a match through a GraphQL mutation, persists it in PostgreSQL, then reloads
          the list through a GraphQL query.
        </p>
      </section>

      <section className="panel" aria-labelledby="create-match-heading">
        <h2 id="create-match-heading">Create a match</h2>
        <form onSubmit={handleSubmit} className="match-form">
          <label htmlFor="match-name">Match name</label>
          <div className="form-row">
            <input
              id="match-name"
              value={name}
              onChange={(event) => setName(event.target.value)}
              maxLength={120}
              required
            />
            <button type="submit" disabled={isSaving}>
              {isSaving ? 'Saving…' : 'Save match'}
            </button>
          </div>
          {saveError && <p role="alert">Could not save: {saveError.message}</p>}
        </form>
      </section>

      <section className="panel" aria-labelledby="saved-matches-heading">
        <div className="section-heading">
          <h2 id="saved-matches-heading">Saved matches</h2>
          {loading && <span>Loading…</span>}
        </div>
        {error && <p role="alert">Could not load matches: {error.message}</p>}
        {!loading && !error && data?.matches.length === 0 && <p>No matches yet. Save one above.</p>}
        <ul className="match-list">
          {data?.matches.map((match) => (
            <MatchCard key={match.id} name={match.name} createdAt={match.createdAt} />
          ))}
        </ul>
      </section>
    </main>
  );
}
