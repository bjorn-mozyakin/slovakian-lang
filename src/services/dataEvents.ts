type Listener = () => void

const listeners = new Set<Listener>()

export function notifyDataChanged(): void {
  listeners.forEach((l) => l())
}

export function onDataChanged(listener: Listener): () => void {
  listeners.add(listener)
  return () => listeners.delete(listener)
}
