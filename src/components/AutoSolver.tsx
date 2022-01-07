import { useEffect, useState } from 'react'
import { Word, WordCheck } from '../domain'
import AutoSolverHeader from './AutoSolverHeader'
import Guess from './Guess'
import useAutoSolverState, { TerminationStatus } from './useAutoSolverState'

export type AutoSolverProps = {
  solution: string
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
      if (autoSolverState.kind === 'terminated') {
        setFinalAutoSolverState(autoSolverState.status)
        const fakeGuesses: ReadonlyArray<[Word, WordCheck]> = [
          ...autoSolverState.attempts.slice(0, 5),
          [solution, ['c', 'c', 'c', 'c', 'c'] as const],
        ] as const as any
        setGuesses(fakeGuesses)
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
