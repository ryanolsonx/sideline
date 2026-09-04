import { useMutation } from '@apollo/client';
import { useState } from 'react';
import { getFragmentData } from '../../gql';
import { GameFragment, StartGameMutation } from './GameFlow.graphql';

export interface GameTeam { id: string; name: string; players: { id: string; name: string }[]; }
type Assignment = { id: string; status: 'PLAYING' | 'OUT'; position: string | null; player: { id: string; name: string } };
export interface Game { id: string; fieldSize: number; status: 'ACTIVE' | 'COMPLETE'; currentRound: number; rounds: { id: string; number: number; assignments: Assignment[] }[]; }

export function GameFlow({ team, onBack }: { team: GameTeam; onBack: () => void }) {
  const [startedGame, setStartedGame] = useState<Game | null>(null);
  const [startGame, { loading: isStarting }] = useMutation(StartGameMutation);

  async function start(fieldSize: 5 | 6, presentPlayerIds: string[]) {
    const result = await startGame({ variables: { input: { teamId: team.id, fieldSize, presentPlayerIds } } });
    if (result.data) setStartedGame(getFragmentData(GameFragment, result.data.startGame) as Game);
  }
  return startedGame
    ? <GameRoundScreen game={startedGame} teamName={team.name} onBack={onBack} />
    : <StartGameScreen team={team} onStart={start} isStarting={isStarting} onBack={onBack} />;
}

export function StartGameScreen({ team, onStart, isStarting, onBack }: {
  team: GameTeam; onStart: (fieldSize: 5 | 6, playerIds: string[]) => Promise<void>; isStarting: boolean; onBack: () => void;
}) {
  const [fieldSize, setFieldSize] = useState<5 | 6>(6);
  const [presentIds, setPresentIds] = useState<string[]>([]);
  const [error, setError] = useState<string>();
  function toggle(playerId: string) { setPresentIds((ids) => ids.includes(playerId) ? ids.filter((id) => id !== playerId) : [...ids, playerId]); }
  async function submit() {
    if (presentIds.length < 3) return setError('Mark at least 3 players as present to start.');
    setError(undefined); await onStart(fieldSize, presentIds);
  }
  return <main className="game-shell"><header className="game-header"><button type="button" onClick={onBack}>Back</button><p>{team.name}</p></header><section className="game-content" aria-labelledby="start-game-heading">
    <p className="eyebrow">Start game</p><h1 id="start-game-heading">Who’s here today?</h1>
    <fieldset className="format-picker"><legend>Match format</legend>{([5, 6] as const).map((size) => <button key={size} type="button" className={fieldSize === size ? 'selected' : ''} onClick={() => setFieldSize(size)} aria-pressed={fieldSize === size}>{size} on {size}<small>{size === 5 ? '1 goalie · 1 defender · 3 forwards' : '1 goalie · 2 defenders · 3 forwards'}</small></button>)}</fieldset>
    <p className="onboarding-intro">Mark the players who are ready to play.</p><ul className="attendance-list" aria-label="Roster attendance">{team.players.map((player) => <li key={player.id}><label><input type="checkbox" checked={presentIds.includes(player.id)} onChange={() => toggle(player.id)} /> <span>{player.name}</span></label></li>)}</ul>
    {error && <p role="alert" className="save-error">{error}</p>}<button className="primary-action" type="button" disabled={isStarting} onClick={submit}>{isStarting ? 'Starting…' : 'Start game'}</button>
  </section></main>;
}

export function GameRoundScreen({ game, teamName, onBack }: { game: Game; teamName: string; onBack: () => void; }) {
  const round = game.rounds.find((entry) => entry.number === game.currentRound);
  const playing = round?.assignments.filter((assignment) => assignment.status === 'PLAYING') ?? [];
  const out = round?.assignments.filter((assignment) => assignment.status === 'OUT') ?? [];
  return <main className="game-shell"><header className="game-header"><button type="button" onClick={onBack}>Back</button><p>{teamName}</p></header><section className="game-content" aria-labelledby="round-heading">
    <p className="eyebrow">{game.fieldSize} on {game.fieldSize}</p><h1 id="round-heading">Round {game.currentRound} of 8</h1>
    <section aria-label="Playing" aria-labelledby="playing-heading"><h2 id="playing-heading">Playing</h2><ul className="lineup-list">{playing.map((assignment) => <li key={assignment.id}><span>{assignment.player.name}</span><strong>{assignment.position?.toLowerCase()}</strong></li>)}</ul></section>
    <section aria-label="Out this round" aria-labelledby="out-heading"><h2 id="out-heading">Out this round</h2>{out.length ? <ul className="out-list">{out.map((assignment) => <li key={assignment.id}>{assignment.player.name}</li>)}</ul> : <p>Everyone is playing this round.</p>}</section>
  </section></main>;
}
