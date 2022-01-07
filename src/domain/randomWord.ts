import { default as DICTIONARY } from './data/dictionary.json'
import { Word } from './StatefulWordGuesser'

export const randomWord = (): Word => {
  const randomDictionaryIndex = Math.floor(Math.random() * DICTIONARY.length)
  return Array.from(DICTIONARY[randomDictionaryIndex]) as Word
}
