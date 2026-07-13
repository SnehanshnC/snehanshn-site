import type { RungId } from "./types";

/*
 * The journey's client-side progress store. The driver is the only writer
 * (it derives both fields from native scroll - the single source of truth,
 * ADR 0002); the rail and any future consumer subscribe here instead of
 * re-deriving scroll math.
 */

export type JourneyProgress = {
  /** 0..1 across the whole document - the rail's marker position. */
  progress: number;
  /** The rung whose dress currently owns the viewport (see track.rungAtVh). */
  activeRung: RungId;
};

let state: JourneyProgress = { progress: 0, activeRung: "a" };
const listeners = new Set<(next: JourneyProgress) => void>();

export function readJourneyProgress(): JourneyProgress {
  return state;
}

export function publishJourneyProgress(next: JourneyProgress): void {
  if (
    next.progress === state.progress &&
    next.activeRung === state.activeRung
  ) {
    return;
  }
  state = next;
  for (const listener of listeners) listener(state);
}

export function subscribeJourneyProgress(
  listener: (next: JourneyProgress) => void,
): () => void {
  listeners.add(listener);
  return () => {
    listeners.delete(listener);
  };
}
