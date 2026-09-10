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
  onSave: (name: string, players: string[], formation: EditableTeam['formation']) => Promise<void>;
}) {
  const [name, setName] = useState(team.name);
  const [players, setPlayers] = useState(team.players.map((player) => player.name));
  const [playerName, setPlayerName] = useState('');
  const [formation, setFormation] = useState(team.formation);
  const [saving, setSaving] = useState(false);

  async function save() {
    setSaving(true);
    try { await onSave(name, players, formation); onBack(); } finally { setSaving(false); }
  }

  return <main className="onboarding-shell"><section className="onboarding-content team-editor" aria-labelledby="team-heading">
    <button className="back-link" type="button" onClick={onBack}>‹ Back to teams</button>
    <p className="editor-eyebrow">Team settings</p>
    <h1 id="team-heading">Team settings</h1>
    <div className="editor-team-name"><label htmlFor="team-name">Team name</label><input id="team-name" value={name} onChange={(event) => setName(event.target.value)} /></div>
    <section className="editor-section" aria-labelledby="roster-heading">
      <div className="editor-section-heading"><div><h2 id="roster-heading">Roster</h2><p>Up to 9 players</p></div><span>{players.length} players</span></div>
      <ul className="roster-list editor-roster" aria-label="Roster">{players.map((player, index) => <li key={`${player}-${index}`}><span className="player-name">{player}</span><button type="button" aria-label={`Remove ${player}`} onClick={() => setPlayers((current) => current.filter((_, itemIndex) => itemIndex !== index))}>×</button></li>)}</ul>
      <div className="editor-add-player"><label htmlFor="edit-player-name">Add a player</label><div><input id="edit-player-name" placeholder="Player name" value={playerName} onChange={(event) => setPlayerName(event.target.value)} /><button type="button" disabled={!playerName.trim() || players.length === 9} onClick={() => { setPlayers((current) => [...current, playerName.trim()]); setPlayerName(''); }}>Add</button></div></div>
    </section>
    <fieldset className="editor-formation"><legend>Formation</legend><p>Choose the shape for future games.</p>
      <label className={formation.defender === 2 && formation.forward === 2 ? 'editor-option selected' : 'editor-option'}><input type="radio" name="edit-formation" checked={formation.defender === 2 && formation.forward === 2} onChange={() => setFormation({ defender: 2, forward: 2 })} /><span><b>5v5</b><small>2 defenders · 2 forwards</small></span></label>
      <label className={formation.defender === 1 && formation.forward === 3 ? 'editor-option selected' : 'editor-option'}><input type="radio" name="edit-formation" checked={formation.defender === 1 && formation.forward === 3} onChange={() => setFormation({ defender: 1, forward: 3 })} /><span><b>5v5</b><small>1 defender · 3 forwards</small></span></label>
      <label className={formation.defender === 2 && formation.forward === 3 ? 'editor-option selected' : 'editor-option'}><input type="radio" name="edit-formation" checked={formation.defender === 2 && formation.forward === 3} onChange={() => setFormation({ defender: 2, forward: 3 })} /><span><b>6v6</b><small>2 defenders · 3 forwards</small></span></label>
    </fieldset>
    <button className="finish-button" type="button" disabled={players.length === 0 || !name.trim() || saving} onClick={save}>{saving ? 'Saving…' : 'Save changes'}</button>
  </section></main>;
}
