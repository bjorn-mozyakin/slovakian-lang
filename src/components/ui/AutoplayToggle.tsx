import './AutoplayToggle.scss'

interface AutoplayToggleProps {
  checked: boolean
  onChange: (value: boolean) => void
}

/** Один и тот же переключатель озвучки слова — во всех играх в одном и том же месте. */
export function AutoplayToggle({ checked, onChange }: AutoplayToggleProps) {
  return (
    <label className="autoplay-toggle">
      <input type="checkbox" checked={checked} onChange={(e) => onChange(e.target.checked)} />
      Проигрывать слово автоматически
    </label>
  )
}
