import { useEffect, useState } from 'react'
import { Word, WordCheck } from '../domain'
import AutoSolverHeader from './AutoSolverHeader'
import Guess from './Guess'
import useAutoSolverState, { TerminationStatus } from './useAutoSolverState'

export type AutoSolverProps = {
  solution: string
  hadObservedFailedSolve: boolean
  hadAssertedAfterWordFalsified: boolean
  onObservedFailedSolve(): void
  onAssertedAfterExhaustion(): void
}

const GUESS_TIMEOUT = 100

export default function AutoSolver({
  solution: solutionRaw,
  hadObservedFailedSolve,
  hadAssertedAfterWordFalsified,
  onObservedFailedSolve,
  onAssertedAfterExhaustion,
}: AutoSolverProps) {
  const solution = solutionRaw.split('') as unknown as Word
  const [autoSolverStatePromise, setAutoSolverState] = useState(useAutoSolverState(solution))
  const [finalAutoSolverState, setFinalAutoSolverState] = useState<TerminationStatus | null>(null)
  const [guesses, setGuesses] = useState<ReadonlyArray<[Word, WordCheck]>>([])

  useEffect(() => {
    let nextGuessTimeout: NodeJS.Timeout | null = null

    autoSolverStatePromise.then((autoSolverState) => {
      if (autoSolverState.kind === 'terminated') {
        setFinalAutoSolverState(autoSolverState.status)
        setGuesses(autoSolverState.attempts)
      } else {
        setGuesses(autoSolverState.attempts)
        nextGuessTimeout = setTimeout(() => {
          nextGuessTimeout = null
          setAutoSolverState(autoSolverState.next())
        }, GUESS_TIMEOUT)
      }
    })

    return () => {
      if (nextGuessTimeout) clearTimeout(nextGuessTimeout)
    }
  }, [autoSolverStatePromise])

  useEffect(() => {
    if (finalAutoSolverState === 'exhausted') {
      onObservedFailedSolve()
    }
  }, [finalAutoSolverState])

  return (
    <div>
      <AutoSolverHeader />
      <p>
        <strong>Solution: </strong>
        {solutionRaw}
      </p>
      <div>
        {guesses.map((attempt, i) => (
          <div key={i} style={{ marginTop: '1px' }}>
            <Guess guess={attempt[0]} check={attempt[1]} readonly={true} />
          </div>
        ))}
      </div>
      {finalAutoSolverState !== null && (
        <AutoSolverResult
          terminationStatus={finalAutoSolverState}
          hadObservedFailedSolve={hadObservedFailedSolve}
          hadAssertedAfterWordFalsified={hadAssertedAfterWordFalsified}
          onAssertedAfterExhaustion={onAssertedAfterExhaustion}
        />
      )}
    </div>
  )
}

type AutoSolverResultProps = {
  terminationStatus: TerminationStatus
  hadObservedFailedSolve: boolean
  hadAssertedAfterWordFalsified: boolean
  onAssertedAfterExhaustion(): void
}

function AutoSolverResult({
  terminationStatus,
  hadAssertedAfterWordFalsified,
  onAssertedAfterExhaustion,
}: AutoSolverResultProps) {
  const [wordAsserted, setWordAsserted] = useState<boolean>(false)

  useEffect(() => {
    if (wordAsserted) {
      onAssertedAfterExhaustion()
    }
  }, [wordAsserted])

  switch (terminationStatus) {
    case 'exhausted': {
      return <p>Wow! You beat it. You must be really smart - perhaps a robot?</p>
    }
    case 'wordFalsified': {
      if (hadAssertedAfterWordFalsified) {
        return <p>Another new word, sir?</p>
      } else {
        if (wordAsserted) {
          return <p>Ok, Shakespeare</p>
        } else {
          return (
            <p>
              Are you sure that's a word? <button onClick={() => setWordAsserted(true)}>It's a word!</button>
            </p>
          )
        }
      }
    }
    case 'wordGuessed':
      return <p></p>
  }
}
