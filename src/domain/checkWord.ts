import { Character, Word } from './StatefulWordGuesser'

type Tuple5<T> = [T, T, T, T, T]

export type WordCheck = Tuple5<CharacterCheck>

export type CharacterCheck = 'c' | 'i' | 'm'

export const checkWord = (solution: Word, guess: Word): WordCheck => {
  const characterConsumption: Array<Character | null> = [...solution]

  const firstPass: Array<'c' | null> = guess.map((character, index) => {
    if (solution[index] === character) {
      characterConsumption[index] = null
      return 'c'
    }
    return null
  })

  const secondPass: Array<CharacterCheck> = guess.map((character, index) => {
    if (firstPass[index] === 'c') {
      return 'c'
    }

    if (characterConsumption.includes(character)) {
      characterConsumption[characterConsumption.indexOf(character)] = null
      return 'm'
    }

    return 'i'
  })

  return secondPass as WordCheck
}
