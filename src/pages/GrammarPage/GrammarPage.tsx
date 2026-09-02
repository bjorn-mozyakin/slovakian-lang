import { useState } from 'react'
import { useNavigate } from 'react-router-dom'
import type { Tense } from '../../entities/verbs'
import { TENSES, TENSE_LABELS } from '../../entities/verbs'
import { PageHeader } from '../../components/ui/PageHeader'
import './GrammarPage.scss'

type Direction = 'ru-sk' | 'sk-ru'

export function GrammarPage() {
  const navigate = useNavigate()
  const [selectedTenses, setSelectedTenses] = useState<Set<Tense>>(new Set(TENSES))

  function toggleTense(tense: Tense) {
    setSelectedTenses((prev) => {
      const next = new Set(prev)
      if (next.has(tense)) next.delete(tense)
      else next.add(tense)
      return next
    })
  }

  function handleStart(direction: Direction) {
    navigate('/grammar/play', { state: { tenses: [...selectedTenses], direction } })
  }

  return (
    <div className="grammar-page">
      <PageHeader title="Грамматика" />

      <section className="grammar-page__games">
        <h2 className="grammar-page__games-title">Игры</h2>

        <div className="grammar-page__group">
          <h3 className="grammar-page__group-title">Глагол + Время</h3>

          <div className="grammar-page__tenses">
            {TENSES.map((tense) => (
              <button
                key={tense}
                type="button"
                className={`grammar-page__tense-chip${selectedTenses.has(tense) ? ' grammar-page__tense-chip--active' : ''}`}
                onClick={() => toggleTense(tense)}
              >
                {TENSE_LABELS[tense]}
              </button>
            ))}
          </div>

          <div className="grammar-page__game-list">
            <button
              className="grammar-page__game-card"
              disabled={selectedTenses.size === 0}
              onClick={() => handleStart('ru-sk')}
            >
              <span className="grammar-page__game-title">Глаголы: на словацкий</span>
              <span className="grammar-page__game-description">
                Переведи фразу на словацкий: местоимение + глагол в нужном времени
              </span>
            </button>
            <button
              className="grammar-page__game-card"
              disabled={selectedTenses.size === 0}
              onClick={() => handleStart('sk-ru')}
            >
              <span className="grammar-page__game-title">Глаголы: на русский</span>
              <span className="grammar-page__game-description">
                Переведи словацкую фразу на русский: местоимение + глагол в нужном времени
              </span>
            </button>
          </div>
          {selectedTenses.size === 0 && (
            <p className="grammar-page__hint">Выберите хотя бы одно время, чтобы начать игру</p>
          )}
        </div>
      </section>
    </div>
  )
}
