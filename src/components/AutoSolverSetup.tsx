import {} from 'react'
import AutoSolverHeader from './AutoSolverHeader'

export type AutoSolverSetupProps = {
  draftWord: string
  onDraftWordChange(value: string): void
  onShuffle(): void
  onStart(): void
}

const alphaChars = new Set('abcdefghijklmnopqrstuvwxyz'.split(''))

export default function AutoSolverSetup({ draftWord, onDraftWordChange, onShuffle, onStart }: AutoSolverSetupProps) {
  return (
    <div>
      <AutoSolverHeader />
      <p>Input a 5-letter word, and let the solver have a go at guessing it unassisted.</p>
      <p>
        <input
          value={draftWord}
          onChange={(ev) =>
            onDraftWordChange(
              Array.from(ev.target.value.toLowerCase())
                .filter((c) => alphaChars.has(c))
                .join('')
            )
          }
          onKeyDown={(ev) => ev.key === 'Enter' && onStart()}
          type="text"
          minLength={5}
          maxLength={5}
          pattern="^[a-z]{5}$"
          required
          title="5 lowercase letters"
        />
        <button onClick={onShuffle} style={{ marginLeft: '10px' }}>
          Shuffle
        </button>
      </p>
      <p>
        <button disabled={draftWord.length !== 5} onClick={onStart}>
          Go!
        </button>
      </p>
    </div>
  )
}
