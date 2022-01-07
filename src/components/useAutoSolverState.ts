import { Word } from '../domain'
import { checkWord, WordCheck } from '../domain/checkWord'
import { RandomStatefulWordGuesser } from '../domain/RandomStatefulWordGuesser'

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

export const useAutoSolverState = async (solution: Word): Promise<AutoSolverState> => {
  const guesser = new RandomStatefulWordGuesser(6)

  await guesser.begin()

  let currentCheck = checkWord(solution, guesser.currentGuess!)

  const createState = (): NonTerminatedAutoSolverState => ({
    kind: 'nonTerminated',
    attempts: guesser.attempts,
    next: async (): Promise<AutoSolverState> => {
      await guesser.next(currentCheck)

      switch (guesser.status) {
        case 'wordGuessed':
        case 'wordFalsified':
        case 'exhausted':
          return Promise.resolve<TerminatedAutoSolverState>({
            kind: 'terminated',
            status: guesser.status,
            attempts: guesser.attempts,
          })
        default:
          return Promise.resolve<NonTerminatedAutoSolverState>(createState())
      }
    },
  })

  return Promise.resolve(createState())
}
