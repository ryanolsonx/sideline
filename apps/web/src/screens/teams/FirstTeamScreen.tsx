export function FirstTeamScreen() {
  return (
    <main className="onboarding-shell">
      <header className="app-header">
        <span className="brand-mark" aria-hidden="true">S</span>
        <span className="brand-name">Sideline</span>
      </header>

      <section className="onboarding-content" aria-labelledby="first-team-heading">
        <p className="step-label">Your teams</p>
        <h1 id="first-team-heading">Welcome to Sideline. Let's add your team.</h1>
        <p className="onboarding-intro">
          Start with the team you coach today. You can add and switch between more teams anytime.
        </p>
      </section>
    </main>
  );
}
