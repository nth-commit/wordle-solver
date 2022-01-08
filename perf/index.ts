import { performance } from 'perf_hooks'
import { buildWordList, checkWord, StatefulWordGuesserV1 } from '../src/domain'
import { randomElement } from '../src/utility'

const worldList = buildWordList()

const runTest = async () => {
  const solution = randomElement(worldList)

  const startTime = performance.now()

  const guesser = new StatefulWordGuesserV1(false)

  await guesser.begin()

  while (guesser.status === 'inProgress') {
    const check = checkWord(solution, guesser.currentGuess!)
    await guesser.next(check)
  }

  const endTime = performance.now()

  return endTime - startTime
}

const runTests = async () => {
  // Warm up
  await runTest()

  const results: number[] = []
  for (let i = 0; i < 10_000; i++) {
    results.push(await runTest())
  }

  const mean = results.reduce((acc, curr) => acc + curr, 0) / results.length
  console.log('Mean time: ' + mean + 'ms')
}

runTests()
