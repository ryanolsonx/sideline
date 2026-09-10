import { FormEvent, useState } from 'react';
import { normalizeCoachUsername } from '../../coach-identity';

interface CoachUsernameScreenProps {
  onContinue: (username: string) => void;
}

export function CoachUsernameScreen({ onContinue }: CoachUsernameScreenProps) {
  const [username, setUsername] = useState('');
  const normalizedUsername = normalizeCoachUsername(username);

  function submit(event: FormEvent<HTMLFormElement>) {
    event.preventDefault();
    if (normalizedUsername) onContinue(normalizedUsername);
  }

  return (
    <main className="onboarding-shell">
      <header className="app-header">
        <span className="brand-mark" aria-hidden="true">S</span>
        <span className="brand-name">Sideline</span>
      </header>
      <section className="onboarding-content" aria-labelledby="coach-username-heading">
        <h1 id="coach-username-heading">Who is coaching today?</h1>
        <p className="onboarding-intro">
          Enter your coach username to see your teams. There is no password.
        </p>
        <form className="onboarding-form" onSubmit={submit}>
          <label htmlFor="coach-username">Coach username</label>
          <input
            id="coach-username"
            value={username}
            onChange={(event) => setUsername(event.target.value)}
            autoComplete="username"
            maxLength={80}
            required
          />
          <button type="submit" disabled={!normalizedUsername}>Continue</button>
        </form>
      </section>
    </main>
  );
}
