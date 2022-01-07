import fc from 'fast-check'
import { checkWord } from '../src/domain/checkWord'
import { Word } from '../src/domain/StatefulWordGuesser'
import { arbitrary } from './utility'

test('correct guess is correct', () => {
  fc.assert(
    fc.property(arbitrary.word(), (word) => {
      const result = checkWord(word, word)

      expect(result).toEqual(['c', 'c', 'c', 'c', 'c'])
    })
  )
})

test.each`
  guessShorthand | solutionShorthand | expectedShorthand
  ${'bbbbb'}     | ${'aaaaa'}        | ${'iiiii'}
  ${'bcccc'}     | ${'baaaa'}        | ${'ciiii'}
  ${'cbccc'}     | ${'abaaa'}        | ${'iciii'}
  ${'cbccc'}     | ${'baaaa'}        | ${'imiii'}
  ${'bbccc'}     | ${'baaaa'}        | ${'ciiii'}
  ${'bbccc'}     | ${'baaaa'}        | ${'ciiii'}
`(
  'g: $guessShorthand, s: $solutionShorthand',
  ({
    solutionShorthand,
    guessShorthand,
    expectedShorthand,
  }: {
    solutionShorthand: string
    guessShorthand: string
    expectedShorthand: string
  }) => {
    const solution = Array.from(solutionShorthand) as unknown as Word
    const guess = Array.from(guessShorthand) as unknown as Word
    const actual = checkWord(solution, guess)

    const expected = Array.from(expectedShorthand)
    expect(actual).toEqual(expected)
  }
)
