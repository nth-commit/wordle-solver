import { useCallback, useEffect, useState } from 'react'
import AutoSolverSetup from './AutoSolverSetup'
import SupervisedSolverSetup from './SupervisedSolverSetup'
import Dictionary from '../dictionary.json'

type AppState =
  | {
      kind: 'initial'
      draftAutoSolverWord: string
    }
  | {
      kind: 'autoSolver'
    }
  | {
      kind: 'supervisedSolver'
    }

const INITIAL_STATE: AppState = {
  kind: 'initial',
  draftAutoSolverWord: '',
}

export default function App() {
  const [shuffleInProgress, setShuffleInProgress] = useState<boolean>(false)
  const [appState, setAppState] = useState<AppState>(INITIAL_STATE)

  const onReset = useCallback(() => setAppState(INITIAL_STATE), [])

  const onDraftWordChange = useCallback(
    (value: string) => {
      if (appState.kind === 'initial') {
        setAppState({
          ...appState,
          draftAutoSolverWord: value,
        })
      }
    },
    [appState]
  )

  const onDraftWordShuffle = useCallback(() => {
    if (appState.kind === 'initial') {
      setShuffleInProgress(true)
    }
  }, [appState])

  const onAutoSolverStart = useCallback(() => {
    setAppState({ kind: 'autoSolver' })
  }, [])

  useEffect(() => {
    if (shuffleInProgress && appState.kind === 'initial') {
      const randomDictionaryIndex = Math.floor(Math.random() * Dictionary.length)
      setAppState({
        ...appState,
        draftAutoSolverWord: Dictionary[randomDictionaryIndex],
      })
      setShuffleInProgress(false)
    }
  }, [shuffleInProgress, appState])

  return (
    <div>
      <AppBody
        state={appState}
        onAutoSolverDraftWordChange={onDraftWordChange}
        onAutoSolverDraftWordShuffle={onDraftWordShuffle}
        onAutoSolverStart={onAutoSolverStart}
      ></AppBody>
      <div style={{ marginTop: '30px' }}>
        <ResetButton onClick={onReset}></ResetButton>
      </div>
    </div>
  )
}

type ResetButtonProps = {
  onClick: () => void
}

const ResetButton = ({ onClick }: ResetButtonProps) => {
  return <button onClick={onClick}>Reset</button>
}

type AppBodyProps = {
  state: AppState
  onAutoSolverDraftWordChange(value: string): void
  onAutoSolverDraftWordShuffle(): void
  onAutoSolverStart(): void
}

const AppBody = ({
  state,
  onAutoSolverDraftWordChange,
  onAutoSolverDraftWordShuffle,
  onAutoSolverStart,
}: AppBodyProps): JSX.Element => {
  switch (state.kind) {
    case 'initial':
      return (
        <div>
          <AutoSolverSetup
            draftWord={state.draftAutoSolverWord}
            onDraftWordChange={onAutoSolverDraftWordChange}
            onShuffle={onAutoSolverDraftWordShuffle}
            onStart={onAutoSolverStart}
          />
          <hr></hr>
          <SupervisedSolverSetup />
          <hr></hr>
        </div>
      )
    case 'autoSolver':
      return <div>autoSolver</div>
    case 'supervisedSolver':
      return <div>supervisedSolver</div>
  }
}
