/** Произношение словацких слов через встроенный в браузер Web Speech API. */
export function speakSlovak(text: string): void {
  if (typeof window === 'undefined' || !window.speechSynthesis) return
  window.speechSynthesis.cancel()
  const utterance = new SpeechSynthesisUtterance(text)
  utterance.lang = 'sk-SK'
  window.speechSynthesis.speak(utterance)
}
