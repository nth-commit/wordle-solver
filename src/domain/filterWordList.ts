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

  const misplacedCharacters = zipTuple5(guess, check, (characterGuess, characterCheck): Character | null => {
    if (characterCheck === 'm') return characterGuess
    return null
  })

  const incorrectCharacters = new Set(
    zipTuple5(guess, check, (characterGuess, characterCheck): Character | null =>
      characterCheck === 'i' ? characterGuess : null
    ).filter(isNotNull)
  )

  const numberOfCorrectCharacters = correctCharacters.filter(isNotNull).length
  const numberOfMisplacedCharacters = misplacedCharacters.filter(isNotNull).length
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

  const minCharacterCounts: Record<Character, number> = Character.ALL_CHARACTERS.reduce((counts, character) => {
    const correctCharacterCount = correctCharacters.filter((c) => c === character).length
    const misplacedCharacterCount = misplacedCharacters.filter((c) => c === character).length

    counts[character] = correctCharacterCount + misplacedCharacterCount

    return counts
  }, {} as Record<Character, number>)

  return worldList.filter((candidateWord) => {
    if (hasAnyCharacterInMisplacedPosition(candidateWord, misplacedCharacters)) return false

    if (hasAllCorrectCharacters(candidateWord, correctCharacters) === false) return false

    if (satisfiesCharacterCounts(candidateWord, minCharacterCounts, maxCharacterCounts) === false) return false

    return true
  })
}

const hasAllCorrectCharacters = (candidateWord: Word, confirmedCharacters: Tuple5<Character | null>): boolean => {
  return zipTuple5(candidateWord, confirmedCharacters, (candidateCharacter, confirmedCharacter): boolean => {
    if (confirmedCharacter === null) return true
    return candidateCharacter === confirmedCharacter
  }).every((x) => x)
}

const hasAnyCharacterInMisplacedPosition = (
  candidateWord: Word,
  misplacedCharacters: Tuple5<Character | null>
): boolean => {
  return zipTuple5(candidateWord, misplacedCharacters, isCharacterMisplaced).some((x) => x)
}

const isCharacterMisplaced = (candidateCharacter: Character, misplacedCharacter: Character | null): boolean =>
  misplacedCharacter !== null && candidateCharacter === misplacedCharacter

const satisfiesCharacterCounts = (
  candidateWord: Word,
  minCharacterCounts: Record<Character, number>,
  maxCharacterCounts: Record<Character, number>
): boolean => {
  const candidateCharacterCounts = candidateWord.reduce((counts, currentCharacter) => {
    const currentCharacterCount = counts.get(currentCharacter) || 0
    counts.set(currentCharacter, currentCharacterCount + 1)
    return counts
  }, new Map<Character, number>())

  return Array.from(candidateCharacterCounts).every(([character, count]) => {
    const minCount = minCharacterCounts[character]
    const maxCount = maxCharacterCounts[character]
    return minCount <= count && count <= maxCount
  })
}
