/**
 * Вставляет текст в позицию курсора (а не всегда в конец строки) — для кнопок
 * словацких спецсимволов над полем ввода. Чтение selectionStart/End — ещё до
 * обновления React-состояния, поэтому значения относятся к текущему (старому)
 * value поля.
 */
export function insertAtCursor(
  input: HTMLInputElement | null,
  current: string,
  insert: string,
): { value: string; cursor: number } {
  const start = input?.selectionStart ?? current.length
  const end = input?.selectionEnd ?? current.length
  return {
    value: current.slice(0, start) + insert + current.slice(end),
    cursor: start + insert.length,
  }
}
