import { buildWordList, checkWord, StatefulWordGuesserV1, Word } from '../src/domain'

let sample: boolean = false

const worldList = buildWordList()

const runTestForSolution = async (solution: Word): Promise<{ attempts: Word[]; success: boolean }> => {
  const guesser = new StatefulWordGuesserV1(false)

  await guesser.begin()

  while (guesser.status === 'inProgress') {
    const check = checkWord(solution, guesser.currentGuess!)
    await guesser.next(check)
  }

  return { attempts: guesser.attempts.map((x) => x[0]), success: guesser.status === 'wordGuessed' }
}

const runTestsForSolution = async (solution: Word): Promise<{ meanGuesses: number; success: boolean }> => {
  const result: Array<{ attempts: Word[]; success: boolean }> = []

  for (let i = 0; i < 20; i++) {
    result.push(await runTestForSolution(solution))
  }

  return {
    meanGuesses: result.reduce((acc, curr) => acc + curr.attempts.length, 0) / result.length,
    success: result.every((x) => x.success),
  }
}

const runTests = async () => {
  const result: Array<{ solution: string; meanGuesses: number; success: boolean }> = []

  const solutions = worldList.filter((_, i) => sample === false || i % 100 === 0)

  for (const solution of solutions) {
    const { meanGuesses, success } = await runTestsForSolution(solution)
    result.push({ solution: solution.join(''), meanGuesses, success })
  }

  const meanGuesses = result.reduce((acc, curr) => acc + curr.meanGuesses, 0) / result.length
  const hardestSolutions = result.sort((a, b) => {
    if (a.success === true && b.success === false) return 1
    if (a.success === false && b.success === true) return -1

    return a.meanGuesses > b.meanGuesses ? -1 : 1
  })

  console.log('Mean number of guesses: ' + meanGuesses)
  console.log('Top 10 challenging words:')
  console.table(hardestSolutions.slice(0, 10))
}

runTests()
