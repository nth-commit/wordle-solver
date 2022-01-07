import {} from 'react'
import { Character, Word } from '../domain'

export type GuessProps = {
  word: Word
  readonly: boolean
}

export default function Guess({ word, readonly }: GuessProps) {
  return (
    <div style={{ display: 'flex' }}>
      {word.map((character, index) => (
        <div key={index}>
          <CharacterGuess character={character} readonly={readonly} />
        </div>
      ))}
    </div>
  )
}

type CharacterGuessProps = {
  character: Character
  readonly: boolean
}

const CharacterGuess = ({ character }: CharacterGuessProps) => {
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
      }}
    >
      {character.toUpperCase()}
    </div>
  )
}
