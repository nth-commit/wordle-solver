import { buildWordList, checkWord, StatefulWordGuesserV1, Word } from '../src/domain'

const worldList = buildWordList()

const runTestForSolution = async (solution: Word): Promise<Word[]> => {
  const guesser = new StatefulWordGuesserV1(false)

  await guesser.begin()

  while (guesser.status === 'inProgress') {
    const check = checkWord(solution, guesser.currentGuess!)
    await guesser.next(check)
  }

  return guesser.attempts.map((x) => x[0])
}

const runTestsForSolution = async (solution: Word): Promise<{ meanGuesses: number }> => {
  const result: number[] = []

  for (let i = 0; i < 20; i++) {
    const words = await runTestForSolution(solution)

    result.push(words.length)
  }

  return { meanGuesses: result.reduce((acc, curr) => acc + curr, 0) / result.length }
}

const runTests = async () => {
  const result: Array<{ solution: string; meanGuesses: number }> = []

  for (const solution of worldList) {
    const { meanGuesses } = await runTestsForSolution(solution)
    result.push({ solution: solution.join(''), meanGuesses })
  }

  const meanGuesses = result.reduce((acc, curr) => acc + curr.meanGuesses, 0) / result.length
  const hardestSolutions = result.sort((a, b) => (a.meanGuesses > b.meanGuesses ? -1 : 1))

  console.log('Mean number of guesses: ' + meanGuesses)
  console.log('Top 10 challenging words:')
  console.table(hardestSolutions.slice(0, 10))
}

runTests()
