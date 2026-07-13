/*
 * The cursor's resurrection wire (rung-e-pristine.md "the cursor pill
 * wakes last"). The E.0 entrance timeline is the writer: it scrubs this
 * value 0 -> 1 as the LIFE act's final beat (reversing cleanly when the
 * visitor scrubs back toward rung D). Under prefers-reduced-motion the
 * dress driver writes 0/1 from the journey's activeRung instead - no
 * tweens, same contract. The salvaged Cursor subscribes and treats
 * >= 0.5 as "awake in rung E"; rungs A-D keep the native cursor.
 */

let value = 0;
const listeners = new Set<(next: number) => void>();

export function readCursorWake(): number {
  return value;
}

export function setCursorWake(next: number): void {
  if (next === value) return;
  value = next;
  for (const listener of listeners) listener(value);
}

export function subscribeCursorWake(
  listener: (next: number) => void,
): () => void {
  listeners.add(listener);
  return () => {
    listeners.delete(listener);
  };
}
