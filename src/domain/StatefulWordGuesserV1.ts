import buildWordList from './buildWordList'
import { randomElement } from '../utility'
import { WordCheck } from './checkWord'
import filterWorldList from './filterWordList'
import { StatefulWordGuesser, Word } from './StatefulWordGuesser'

const calculateDiversities = (words: ReadonlyArray<Word>): Map<number, Word[]> => {
  const diversityByWord: Map<Word, number> = new Map(allWords.map((word) => [word, new Set(word).size]))

  const wordsByDiversity = new Map<number, Word[]>()
  for (const word of words) {
    const diversity = diversityByWord.get(word)!
    const wordsForDiversity = wordsByDiversity.get(diversity) || []
    wordsForDiversity.push(word)
    wordsByDiversity.set(diversity, wordsForDiversity)
  }

  return wordsByDiversity
}

const allWords = buildWordList()

const allWordsByDiversity = calculateDiversities(allWords)

export class StatefulWordGuesserV1 implements StatefulWordGuesser {
  status: StatefulWordGuesser['status'] = 'waitingForStart'
  attempts: readonly [Word, WordCheck][] = []
  currentGuess: Word | null = null

  private possibleWords: ReadonlyArray<Word> = allWords

  constructor(private readonly logPossibleWords = true) {}

  begin(): Promise<void> {
    if (this.status !== 'waitingForStart') throw new Error('invalid status')

    this.status = 'inProgress'
    this.makeGuess(allWordsByDiversity)

    return Promise.resolve()
  }

  next(currentCheck: WordCheck): Promise<void> {
    if (this.status !== 'inProgress') throw new Error('invalid status')

    if (this.logPossibleWords) console.log(this.possibleWords)

    const currentGuess = this.currentGuess!
    this.attempts = [...this.attempts, [currentGuess, currentCheck]]

    if (WordCheck.isCorrect(currentCheck)) {
      this.status = 'wordGuessed'
    } else {
      this.possibleWords = filterWorldList(this.possibleWords, currentGuess, currentCheck)

      if (this.possibleWords.length > 0) {
        const wordsByDiversity = calculateDiversities(this.possibleWords)
        this.makeGuess(wordsByDiversity)
      } else {
        this.status = 'wordFalsified'
      }
    }

    return Promise.resolve()
  }

  private makeGuess(wordsByDiversity: Map<number, Word[]>) {
    const highestPossibleDiversity = Array.from(wordsByDiversity.keys()).reduce((acc, curr) => Math.max(acc, curr), 0)
    const mostDiversePossibleWords = wordsByDiversity.get(highestPossibleDiversity)!

    this.currentGuess = randomElement(mostDiversePossibleWords)
  }
}
