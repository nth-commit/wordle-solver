import {} from 'react'

export type AutoSolverSetupProps = {
  draftWord: string
  onDraftWordChange(value: string): void
  onShuffle(): void
  onStart(): void
}

export default function AutoSolverSetup({ draftWord, onDraftWordChange, onShuffle, onStart }: AutoSolverSetupProps) {
  return (
    <div>
      <h1>Auto-Solver</h1>
      <p>Input a word, and let the solver have a go at guessing it unassisted.</p>
      <p>
        <input
          value={draftWord}
          onChange={(ev) => onDraftWordChange(ev.target.value)}
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
        <button onClick={onStart}>Go!</button>
      </p>
    </div>
  )
}
