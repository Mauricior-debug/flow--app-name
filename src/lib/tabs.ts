type Listener = () => void;

const listeners = new Map<string, Set<Listener>>();
const focused = new Set<string>();

export function setTabFocused(name: string, value: boolean) {
  if (value) focused.add(name);
  else focused.delete(name);
}

export function isTabFocused(name: string) {
  return focused.has(name);
}

export function onTabReselect(name: string, listener: Listener) {
  const set = listeners.get(name) ?? new Set<Listener>();
  set.add(listener);
  listeners.set(name, set);
  return () => {
    set.delete(listener);
  };
}

export function emitTabReselect(name: string) {
  listeners.get(name)?.forEach((listener) => listener());
}
