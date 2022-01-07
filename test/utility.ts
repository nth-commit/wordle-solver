import fc from 'fast-check'
import { Character, Word } from '../src/domain'

export const arbitrary = {
  character: (): fc.Arbitrary<Character> =>
    fc.constantFrom(
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
    ),

  word: (): fc.Arbitrary<Word> =>
    fc.tuple(
      arbitrary.character(),
      arbitrary.character(),
      arbitrary.character(),
      arbitrary.character(),
      arbitrary.character()
    ),
}
