/** Произношение словацких слов через встроенный в браузер Web Speech API. */
export function speakSlovak(text: string): void {
  if (typeof window === 'undefined' || !window.speechSynthesis) return
  window.speechSynthesis.cancel()
  const utterance = new SpeechSynthesisUtterance(text)
  utterance.lang = 'sk-SK'
  window.speechSynthesis.speak(utterance)
}

/**
 * "Прогревает" Web Speech API беззвучной фразой — вызывать синхронно прямо
 * внутри обработчика клика/тапа. Многие мобильные браузеры разрешают
 * произношение только как прямое следствие жеста пользователя; переход по
 * SPA-маршруту на страницу игры этому условию уже не удовлетворяет, из-за
 * чего самое первое слово в раунде не озвучивалось. Один такой вызов внутри
 * настоящего клика "снимает блокировку" для звука до конца перезагрузки
 * страницы (не заходит — навигация в SPA не перезагружает страницу).
 */
export function primeSpeech(): void {
  if (typeof window === 'undefined' || !window.speechSynthesis) return
  const utterance = new SpeechSynthesisUtterance(' ')
  utterance.volume = 0
  window.speechSynthesis.speak(utterance)
}
