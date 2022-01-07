import { CharacterCheck } from '.'
import { isNotNull, Tuple5, zipTuple5 } from '../utility'
import { WordCheck } from './checkWord'
import { Character, Word } from './StatefulWordGuesser'

export default function filterWorldList(
  worldList: ReadonlyArray<Word>,
  guess: Word,
  check: WordCheck
): ReadonlyArray<Word> {
  const correctCharacters = zipTuple5(guess, check, (characterGuess, characterCheck): Character | null => {
    if (characterCheck === 'c') return characterGuess
    return null
  })

  const misplacedCharacters: Array<Character> = zipTuple5(
    guess,
    check,
    (characterGuess, characterCheck): Character | null => {
      if (characterCheck === 'm') return characterGuess
      return null
    }
  ).filter(isNotNull)

  const confirmedCharacters = new Set([...correctCharacters.filter(isNotNull), ...misplacedCharacters])
  const eliminatedCharacters: Set<Character> = new Set(
    zipTuple5(guess, check, (characterGuess, characterCheck): Character | null =>
      canEliminateCharacter(characterGuess, characterCheck, confirmedCharacters) ? characterGuess : null
    ).filter(isNotNull)
  )

  const incorrectCharacters = new Set(
    zipTuple5(guess, check, (characterGuess, characterCheck): Character | null =>
      characterCheck === 'i' ? characterGuess : null
    ).filter(isNotNull)
  )

  const numberOfCorrectCharacters = correctCharacters.filter(isNotNull).length
  const numberOfMisplacedCharacters = misplacedCharacters.length
  const maxCharacterCounts: Record<Character, number> = Character.ALL_CHARACTERS.reduce((counts, character) => {
    const correctCharacterCount = correctCharacters.filter((c) => c === character).length
    const misplacedCharacterCount = misplacedCharacters.filter((c) => c === character).length

    if (incorrectCharacters.has(character)) {
      counts[character] = correctCharacterCount + misplacedCharacterCount
    } else {
      counts[character] =
        guess.length -
        numberOfCorrectCharacters -
        numberOfMisplacedCharacters +
        correctCharacterCount +
        misplacedCharacterCount
    }

    return counts
  }, {} as Record<Character, number>)

  return worldList.filter((candidateWord) => {
    if (hasAnyEliminatedCharacters(candidateWord, eliminatedCharacters)) return false

    if (hasAllMisplacedCharacters(candidateWord, misplacedCharacters) === false) return false

    if (hasAllCorrectCharacters(candidateWord, correctCharacters) === false) return false

    if (exceedsAnyMaxCharacterCount(candidateWord, maxCharacterCounts)) return false

    return true
  })
}

const canEliminateCharacter = (
  guess: Character,
  check: CharacterCheck,
  confirmedCharacters: Set<Character>
): boolean => {
  if (check === 'i') {
    const wasAlreadyConfirmed = confirmedCharacters.has(guess)
    return !wasAlreadyConfirmed
  }
  return false
}

const hasAnyEliminatedCharacters = (candidateWord: Word, eliminatedCharacters: Set<Character>): boolean =>
  candidateWord.some((c) => eliminatedCharacters.has(c))

const hasAllCorrectCharacters = (candidateWord: Word, confirmedCharacters: Tuple5<Character | null>): boolean => {
  return zipTuple5(candidateWord, confirmedCharacters, (candidateCharacter, confirmedCharacter): boolean => {
    if (confirmedCharacter === null) return true
    return candidateCharacter === confirmedCharacter
  }).every((x) => x)
}

const hasAllMisplacedCharacters = (candidateWord: Word, misplacedCharacters: Character[]): boolean => {
  const characters = new Set(candidateWord)
  return misplacedCharacters.every((c) => characters.has(c))
}

const exceedsAnyMaxCharacterCount = (candidateWord: Word, maxCharacterCounts: Record<Character, number>): boolean => {
  const candidateCharacterCounts = candidateWord.reduce((counts, currentCharacter) => {
    const currentCharacterCount = counts.get(currentCharacter) || 0
    counts.set(currentCharacter, currentCharacterCount + 1)
    return counts
  }, new Map<Character, number>())

  return Array.from(candidateCharacterCounts).some(([character, count]) => {
    const maxCount = maxCharacterCounts[character]
    if (maxCount === null) return false
    return count > maxCount
  })
}
