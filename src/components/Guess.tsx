import {} from 'react'
import { Character, Word } from '../domain'
import { CharacterCheck, WordCheck } from '../domain/checkWord'

export type GuessProps = {
  guess: Word
  check: WordCheck
  readonly: boolean
}

export default function Guess({ guess, check, readonly }: GuessProps) {
  return (
    <div style={{ display: 'flex' }}>
      {guess.map((characterGuess, index) => (
        <div key={index}>
          <CharacterGuess guess={characterGuess} check={check[index]} readonly={readonly} />
        </div>
      ))}
    </div>
  )
}

type CharacterGuessProps = {
  guess: Character
  check: CharacterCheck
  readonly: boolean
}

const CharacterGuess = ({ guess, check }: CharacterGuessProps) => {
  return (
    <div
      style={{
        width: '30px',
        height: '30px',
        margin: '1px',
        borderColor: 'black',
        borderWidth: '1px',
        borderStyle: 'solid',
        display: 'flex',
        alignItems: 'center',
        justifyContent: 'center',
        color: 'white',
        backgroundColor: check === 'c' ? 'green' : check === 'm' ? 'orange' : 'darkgray',
      }}
    >
      {guess.toUpperCase()}
    </div>
  )
}
