import fc from 'fast-check'
import { checkWord, Word } from '../src/checkWord'

test.skip('correct guess is correct', () => {
  const charArb = fc.constantFrom(
    'a',
    'b',
    'c',
    'd',
    'e',
    'f',
    'g',
    'h',
    'i',
    'j',
    'k',
    'l',
    'm',
    'n',
    'o',
    'p',
    'q',
    'r',
    's',
    't',
    'u',
    'v',
    'w',
    'x',
    'y',
    'z'
  )
  const wordArb = fc.tuple(charArb, charArb, charArb, charArb, charArb).map((cs) => cs as Word)

  fc.assert(
    fc.property(wordArb, (word) => {
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
    const solution = Array.from(solutionShorthand) as Word
    const guess = Array.from(guessShorthand) as Word
    const actual = checkWord(solution, guess)

    const expected = Array.from(expectedShorthand)
    expect(actual).toEqual(expected)
  }
)
