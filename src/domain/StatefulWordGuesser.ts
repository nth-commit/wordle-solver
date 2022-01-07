import { WordCheck } from './checkWord'

export type StatefulWordGuesser = {
  readonly status: 'waitingForStart' | 'inProgress' | 'wordGuessed' | 'wordFalsified' | 'exhausted'
  readonly attempts: ReadonlyArray<[Word, WordCheck]>
  readonly currentGuess: Word | null

  begin(): Promise<void>
  next(currentCheck: WordCheck): Promise<void>
}

type Tuple5<T> = [T, T, T, T, T]

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

export type Word = Tuple5<Character>

export type WordleResult = Tuple5<WordleCharacterResult>

export type WordleCharacterResult = 'c' | 'i' | 'm'
