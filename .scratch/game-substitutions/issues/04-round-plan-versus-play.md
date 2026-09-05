# What a round is: plan versus play

Type: grilling
Status: open

## Question

The keystone. A round has two phases: the app proposes a lineup, the coach shuffles it
freely while it is still a proposal, then taps Play round and it becomes what actually
happened. A swap after that tap is a different kind of event: this player started the
round and came off, that one came on.

Settled after reading the prior art: **a substitution must not overwrite the lineup in
place.** The existing tool's `swapBenchPlayerIntoLineup` rewrites the slot and records
nothing about the round having started differently, and the coach has ruled that a flaw.
A round must retain what it began as, plus what changed. Do not reopen this.

- What are the round's states, and what is the exact meaning of the Play round tap?
- What does an in-round substitution record? A pair of players and a position? A
  moment in time? There is no clock, so what marks "when"?
- Can a round be un-played, or is the tap one-way?
- Does a round end when the next one is planned, or is there a separate gesture?
- What does the model look like: a lineup plus a substitution log, or a sequence of
  stints per player?
- How much of this does the coach see? A round that has been played and then edited
  three times must still read clearly on a phone.

Most of the rest of this map hangs off the answer.
