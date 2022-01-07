import { useEffect, useState } from 'react'
import { WordCheck } from '../domain/checkWord'
import { StatefulWordGuesser, Word } from '../domain/StatefulWordGuesser'
import AutoSolverHeader from './AutoSolverHeader'
import Guess from './Guess'
import { TerminationStatus, useAutoSolverState } from './useAutoSolverState'

export type AutoSolverProps = {
  solution: string
  guesser: StatefulWordGuesser
}

const GUESS_TIMEOUT = 100

export default function AutoSolver({ solution: solutionRaw }: AutoSolverProps) {
  const solution = solutionRaw.split('') as Word
  const [autoSolverStatePromise, setAutoSolverState] = useState(useAutoSolverState(solution))
  const [finalAutoSolverState, setFinalAutoSolverState] = useState<TerminationStatus | null>(null)
  const [guesses, setGuesses] = useState<ReadonlyArray<[Word, WordCheck]>>([])

  useEffect(() => {
    let nextGuessTimeout: NodeJS.Timeout | null = null

    autoSolverStatePromise.then((autoSolverState) => {
      setGuesses(autoSolverState.attempts)

      if (autoSolverState.kind === 'terminated') {
        setFinalAutoSolverState(autoSolverState.status)
      } else {
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

  return (
    <div>
      <AutoSolverHeader />
      <p>
        <strong>Solution: </strong>
        {solutionRaw}
      </p>
      {guesses.map((attempt, i) => (
        <div key={i} style={{ marginTop: '1px' }}>
          <Guess guess={attempt[0]} check={attempt[1]} readonly={true} />
        </div>
      ))}
      {finalAutoSolverState !== null && <p>Result: {finalAutoSolverState}</p>}
    </div>
  )
}
