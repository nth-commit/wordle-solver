import { StatefulWordGuesser, Word } from './StatefulWordGuesser'
import { WordCheck } from './checkWord'
import buildWordList from './buildWordList'
import { randomElement } from '../utility'

const allWords = buildWordList()

export class RandomStatefulWordGuesser implements StatefulWordGuesser {
  status: StatefulWordGuesser['status'] = 'waitingForStart'
  attempts: Array<[Word, WordCheck]> = []
  currentGuess: Word | null = null

  begin(): Promise<void> {
    if (this.status !== 'waitingForStart') throw new Error('invalid status')

    this.status = 'inProgress'
    this.makeGuess()

    return Promise.resolve()
  }

  next(currentCheck: WordCheck): Promise<void> {
    if (this.status === 'waitingForStart') throw new Error('invalid status')

    const currentGuess = this.currentGuess!

    this.attempts = [...this.attempts, [currentGuess, currentCheck]]

    if (currentCheck.every((x) => x === 'c')) {
      this.status = 'wordGuessed'
      this.currentGuess = null
    } else {
      this.makeGuess()
    }

    return Promise.resolve()
  }

  private makeGuess(): void {
    this.currentGuess = randomElement(allWords)
  }
}
