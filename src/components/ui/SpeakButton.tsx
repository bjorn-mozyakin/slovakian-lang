import { speakSlovak } from '../../services/speech'
import './SpeakButton.scss'

interface SpeakButtonProps {
  text: string
  className?: string
}

export function SpeakButton({ text, className }: SpeakButtonProps) {
  return (
    <button
      type="button"
      className={`speak-button${className ? ` ${className}` : ''}`}
      onClick={(e) => {
        e.stopPropagation()
        speakSlovak(text)
      }}
      aria-label={`Произнести «${text}»`}
    >
      🔊
    </button>
  )
}
