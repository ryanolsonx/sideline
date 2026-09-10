import { useState } from 'react';

export interface EditableTeam {
  id: string;
  name: string;
  players: { name: string }[];
  formation: { defender: number; forward: number };
}

export function TeamDetailScreen({
  team,
  onBack,
  onSave,
}: {
  team: EditableTeam;
  onBack: () => void;
  onSave: (players: string[], formation: EditableTeam['formation']) => Promise<void>;
}) {
  const [players, setPlayers] = useState(team.players.map((player) => player.name));
  const [playerName, setPlayerName] = useState('');
  const [formation, setFormation] = useState(team.formation);
  const [saving, setSaving] = useState(false);

  async function save() {
    setSaving(true);
    try { await onSave(players, formation); onBack(); } finally { setSaving(false); }
  }

  return <main className="onboarding-shell"><section className="onboarding-content" aria-labelledby="team-heading">
    <button type="button" onClick={onBack}>Back to teams</button>
    <h1 id="team-heading">{team.name}</h1>
    <h2>Roster</h2>
    <ul aria-label="Roster">{players.map((player, index) => <li key={`${player}-${index}`}>{player}<button type="button" aria-label={`Remove ${player}`} onClick={() => setPlayers((current) => current.filter((_, itemIndex) => itemIndex !== index))}>×</button></li>)}</ul>
    <label htmlFor="edit-player-name">Player name</label>
    <input id="edit-player-name" value={playerName} onChange={(event) => setPlayerName(event.target.value)} />
    <button type="button" disabled={!playerName.trim() || players.length === 9} onClick={() => { setPlayers((current) => [...current, playerName.trim()]); setPlayerName(''); }}>Add player</button>
    <fieldset><legend>Formation</legend>
      <label><input type="radio" name="edit-formation" checked={formation.defender === 2 && formation.forward === 2} onChange={() => setFormation({ defender: 2, forward: 2 })} />5v5: 2 defenders, 2 forwards</label>
      <label><input type="radio" name="edit-formation" checked={formation.defender === 1 && formation.forward === 3} onChange={() => setFormation({ defender: 1, forward: 3 })} />5v5: 1 defender, 3 forwards</label>
      <label><input type="radio" name="edit-formation" checked={formation.defender === 2 && formation.forward === 3} onChange={() => setFormation({ defender: 2, forward: 3 })} />6v6: 2 defenders, 3 forwards</label>
    </fieldset>
    <button type="button" disabled={players.length === 0 || saving} onClick={save}>{saving ? 'Saving…' : 'Save team'}</button>
  </section></main>;
}
