import fc from 'fast-check'
import { checkWord, filterWordList, Word } from '../src/domain'
import { arbitrary } from './utility'

test.skip('correct word is not filtered', () => {
  fc.assert(
    fc.property(arbitrary.word(), arbitrary.word(), (solution, guess) => {
      const wordList0 = [solution, guess]
      const check = checkWord(solution, guess)

      const worldList1 = filterWordList(wordList0, guess, check)

      expect(worldList1.map((w) => w.join(''))).toContainEqual(solution.join(''))
    })
  )
})

test.each`
  guessShorthand | solutionShorthand | eliminatedShorthand
  ${'curry'}     | ${'furzy'}        | ${'furry'}
`(
  'guess: $guessShorthand, solution: $solutionShorthand => eliminated: $eliminatedShorthand',
  ({
    solutionShorthand,
    guessShorthand,
    eliminatedShorthand,
  }: {
    solutionShorthand: string
    guessShorthand: string
    eliminatedShorthand: string
  }) => {
    const solution = Array.from(solutionShorthand) as unknown as Word
    const guess = Array.from(guessShorthand) as unknown as Word
    const eliminated = Array.from(eliminatedShorthand) as unknown as Word

    const wordList0 = [solution, guess, eliminated]
    const check = checkWord(solution, guess)

    const worldList1 = filterWordList(wordList0, guess, check)

    expect(worldList1.map((w) => w.join(''))).not.toContainEqual(eliminated.join(''))
  }
)
