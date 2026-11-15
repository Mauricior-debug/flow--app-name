type Handler = (value: string) => void;

let handler: Handler | null = null;
let pending: string | null = null;

export function listenForPick(next: Handler) {
  handler = next;
  return () => {
    if (handler === next) handler = null;
  };
}

export function commitPick(value: string) {
  pending = value;
  handler?.(value);
}

export function consumePick() {
  const value = pending;
  pending = null;
  return value;
}

export function peekPick() {
  return pending;
}
