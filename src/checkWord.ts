type Tuple5<T> = [T, T, T, T, T]

export type WordleResult = Tuple5<WordleCharacterResult>

export type WordleCharacterResult = 'c' | 'i' | 'm'

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

export const checkWord = (solution: Word, guess: Word): WordleResult => {
  const characterConsumption: Array<Character | null> = [...solution]

  const firstPass: Array<'c' | null> = guess.map((character, index) => {
    if (solution[index] === character) {
      characterConsumption[index] = null
      return 'c'
    }
    return null
  })

  const secondPass: Array<WordleCharacterResult> = guess.map((character, index) => {
    if (firstPass[index] === 'c') {
      return 'c'
    }

    if (characterConsumption.includes(character)) {
      characterConsumption[characterConsumption.indexOf(character)] = null
      return 'm'
    }

    return 'i'
  })

  return secondPass as WordleResult
}
