import { default as DICTIONARY } from './data/dictionary.json'
import { Character, Word } from './StatefulWordGuesser'

export default function buildWordList(): ReadonlyArray<Word> {
  return DICTIONARY.map(stringToWord)
}

const stringToWord = (s: string): Word | never => {
  if (s.length !== 5) throw new Error('unexpected value')

  const [a, b, c, d, e] = s
  return [stringToCharacter(a), stringToCharacter(b), stringToCharacter(c), stringToCharacter(d), stringToCharacter(e)]
}

const stringToCharacter = (c: string): Character | never => {
  if (/[a-z]/.test(c)) {
    return c as Character
  }

  throw new Error('unexpected value')
}
