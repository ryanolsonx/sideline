# An ordered game log has one-step undo

This amends ADR 0009. A Game is one append-only, ordered log; it does not store an
action tree, parent pointers, branches, or redo state. An action made against an
earlier round carries its target round and screen, so the canonical projection can
replay the corrected state and omit the later gameplay data that no longer follows
from it. The original rows remain readable in the log but do not contribute to the
fold.

**Undo** is deliberately just one recovery: it neutralizes the immediately preceding
coach action, then disappears. It has no payload, follows the action it neutralizes,
and has no Redo companion or history-navigation stack. This preserves a coach's quick
escape from a mistaken tap without turning the sideline screen into version control.

## Consequences

- The projection, rather than storage topology, determines which ordered actions are
  in effect after a correction to a past round.
- The API exposes the folded Game state and a single `undo` command; the raw action
  log stays an internal, permanent record.
- Attendance remains a fact about the afternoon under ADR 0008, even where a
  correction makes later lineup data disappear from the effective state.
