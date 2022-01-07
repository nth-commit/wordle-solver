import { mapTuple5, Tuple5 } from '../utility'
import { Character, Word } from './StatefulWordGuesser'

export type WordCheck = Tuple5<CharacterCheck>

export namespace WordCheck {
  export const isCorrect = (check: WordCheck): boolean =>
    check[0] === 'c' && check[1] === 'c' && check[2] === 'c' && check[3] === 'c' && check[4] === 'c'
}

export type CharacterCheck = 'c' | 'i' | 'm'

export const checkWord = (solution: Word, guess: Word): WordCheck => {
  const characterConsumption: Array<Character | null> = [...solution]

  const firstPass = mapTuple5(guess, (character, index): 'c' | null => {
    if (solution[index] === character) {
      characterConsumption[index] = null
      return 'c'
    }

    return null
  })

  const secondPass = mapTuple5(guess, (character, index): CharacterCheck => {
    if (firstPass[index] === 'c') {
      return 'c'
    }

    if (characterConsumption.includes(character)) {
      characterConsumption[characterConsumption.indexOf(character)] = null
      return 'm'
    }

    return 'i'
  })

  return secondPass
}
