type Handler = (value: string) => void;

let handler: Handler | null = null;

export function listenForPick(next: Handler) {
  handler = next;
  return () => {
    if (handler === next) handler = null;
  };
}

export function commitPick(value: string) {
  const current = handler;
  handler = null;
  current?.(value);
}
