import { Tuple5 } from '../utility'
import { WordCheck } from './checkWord'

export type StatefulWordGuesser = {
  readonly status: 'waitingForStart' | 'inProgress' | 'wordGuessed' | 'wordFalsified'
  readonly attempts: ReadonlyArray<[Word, WordCheck]>
  readonly currentGuess: Word | null

  begin(): Promise<void>
  next(currentCheck: WordCheck): Promise<void>
}

export type Character =
  | 'a'
  | 'b'
  | 'c'
  | 'd'
  | 'e'
  | 'f'
  | 'g'
  | 'h'
  | 'i'
  | 'j'
  | 'k'
  | 'l'
  | 'm'
  | 'n'
  | 'o'
  | 'p'
  | 'q'
  | 'r'
  | 's'
  | 't'
  | 'u'
  | 'v'
  | 'w'
  | 'x'
  | 'y'
  | 'z'

export namespace Character {
  export const ALL_CHARACTERS: ReadonlyArray<Character> = [
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
    'z',
  ]
}

export type Word = Tuple5<Character>
