import { buildWordList } from '.'
import { randomElement } from '../utility'
import { WordCheck } from './checkWord'
import filterWorldList from './filterWordList'
import { StatefulWordGuesser, Word } from './StatefulWordGuesser'

export class StatefulWordGuesserV1 implements StatefulWordGuesser {
  status: StatefulWordGuesser['status'] = 'waitingForStart'
  attempts: readonly [Word, WordCheck][] = []
  currentGuess: Word | null = null

  private possibleWords = buildWordList()

  begin(): Promise<void> {
    if (this.status !== 'waitingForStart') throw new Error('invalid status')

    this.status = 'inProgress'
    this.makeGuess()

    return Promise.resolve()
  }

  next(currentCheck: WordCheck): Promise<void> {
    if (this.status !== 'inProgress') throw new Error('invalid status')

    console.log(this.possibleWords)

    const currentGuess = this.currentGuess!
    this.attempts = [...this.attempts, [currentGuess, currentCheck]]

    if (WordCheck.isCorrect(currentCheck)) {
      this.status = 'wordGuessed'
    } else {
      this.possibleWords = filterWorldList(this.possibleWords, currentGuess, currentCheck)

      if (this.possibleWords.length > 0) {
        this.makeGuess()
      } else {
        this.status = 'wordFalsified'
      }
    }

    return Promise.resolve()
  }

  private makeGuess() {
    this.currentGuess = randomElement(this.possibleWords)
  }
}
