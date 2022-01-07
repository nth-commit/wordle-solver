import { checkWord, Word, WordCheck, StatefulWordGuesserV1 } from '../domain'

export type TerminationStatus = 'wordGuessed' | 'wordFalsified' | 'exhausted'

export type TerminatedAutoSolverState = Readonly<{
  kind: 'terminated'
  attempts: ReadonlyArray<[Word, WordCheck]>
  status: TerminationStatus
}>

export type NonTerminatedAutoSolverState = Readonly<{
  kind: 'nonTerminated'
  attempts: ReadonlyArray<[Word, WordCheck]>
  next(): Promise<NonTerminatedAutoSolverState | TerminatedAutoSolverState>
}>

export type AutoSolverState = TerminatedAutoSolverState | NonTerminatedAutoSolverState

const MAX_NUMBER_OF_GUESSES = 6

export default async function useAutoSolverState(solution: Word): Promise<AutoSolverState> {
  const guesser = new StatefulWordGuesserV1()

  await guesser.begin()

  const createState = (): NonTerminatedAutoSolverState => ({
    kind: 'nonTerminated',
    attempts: guesser.attempts,
    next: async (): Promise<AutoSolverState> => {
      const currentCheck = checkWord(solution, guesser.currentGuess!)
      await guesser.next(currentCheck)

      switch (guesser.status) {
        case 'wordGuessed':
        case 'wordFalsified':
          return {
            kind: 'terminated',
            status: guesser.status,
            attempts: guesser.attempts,
          }
        default: {
          if (guesser.attempts.length >= MAX_NUMBER_OF_GUESSES) {
            return {
              kind: 'terminated',
              status: 'exhausted',
              attempts: guesser.attempts,
            }
          } else {
            return createState()
          }
        }
      }
    },
  })

  return Promise.resolve(createState())
}
