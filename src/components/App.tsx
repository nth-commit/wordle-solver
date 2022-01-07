import { useCallback, useEffect, useState } from 'react'
import AutoSolverSetup from './AutoSolverSetup'
import SupervisedSolverSetup from './SupervisedSolverSetup'
import AutoSolver from './AutoSolver'
import { buildWordList } from '../domain'
import { randomElement } from '../utility'

type AppState =
  | {
      kind: 'initial'
      draftAutoSolverWord: string
    }
  | {
      kind: 'autoSolver'
      solutionWord: string
    }
  | {
      kind: 'supervisedSolver'
    }

const INITIAL_STATE: AppState = {
  kind: 'initial',
  draftAutoSolverWord: '',
}

const allWords = buildWordList()

export default function App() {
  const [shuffleInProgress, setShuffleInProgress] = useState<boolean>(false)
  const [hadObservedFailedSolve, setHadObservedFailedSolve] = useState<boolean>(false)
  const [hasObservedFailedSolve, setHasObservedFailedSolve] = useState<boolean>(false)
  const [hadAssertedAfterExhaustion, setHadAssertedAfterExhaustion] = useState<boolean>(false)
  const [hasAssertedAfterExhaustion, setHasAssertedAfterExhaustion] = useState<boolean>(false)
  const [appState, setAppState] = useState<AppState>(INITIAL_STATE)

  const onReset = useCallback(() => {
    setAppState(INITIAL_STATE)
    setHadObservedFailedSolve(hasObservedFailedSolve || hadObservedFailedSolve)
    setHadAssertedAfterExhaustion(hasAssertedAfterExhaustion || hadAssertedAfterExhaustion)
  }, [hasObservedFailedSolve, hadObservedFailedSolve, hasAssertedAfterExhaustion, hadAssertedAfterExhaustion])

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
    if (appState.kind === 'initial') {
      setAppState({
        kind: 'autoSolver',
        solutionWord: appState.draftAutoSolverWord,
      })
    }
  }, [appState])

  const onObservedFailedSolve = useCallback(() => {
    if (appState.kind === 'autoSolver') {
      setHasObservedFailedSolve(true)
    }
  }, [appState])

  const onAssertedAfterExhaustion = useCallback(() => {
    if (appState.kind === 'autoSolver') {
      setHasAssertedAfterExhaustion(true)
    }
  }, [appState])

  useEffect(() => {
    if (shuffleInProgress && appState.kind === 'initial') {
      setAppState({
        ...appState,
        draftAutoSolverWord: randomElement(allWords).join(''),
      })
      setShuffleInProgress(false)
    }
  }, [shuffleInProgress, appState])

  return (
    <div>
      <AppBody
        state={appState}
        hasAssertedAfterExhaustion={hadAssertedAfterExhaustion}
        hadObservedFailedSolve={hadObservedFailedSolve}
        onAutoSolverDraftWordChange={onDraftWordChange}
        onAutoSolverDraftWordShuffle={onDraftWordShuffle}
        onAutoSolverStart={onAutoSolverStart}
        onObservedFailedSolve={onObservedFailedSolve}
        onAssertedAfterExhaustion={onAssertedAfterExhaustion}
      ></AppBody>
      <p>
        <ResetButton onClick={onReset}></ResetButton>
      </p>
      <p>
        <em property="italic" style={{ color: 'gray', fontSize: '0.9em' }}>
          <LoggedInStatus
            hadObservedFailedSolve={hadObservedFailedSolve}
            hadAssertedAfterExhaustion={hadAssertedAfterExhaustion}
          />
        </em>
      </p>
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
  hadObservedFailedSolve: boolean
  hasAssertedAfterExhaustion: boolean
  onAutoSolverDraftWordChange(value: string): void
  onAutoSolverDraftWordShuffle(): void
  onAutoSolverStart(): void
  onObservedFailedSolve(): void
  onAssertedAfterExhaustion(): void
}

const AppBody = ({
  state,
  hadObservedFailedSolve,
  hasAssertedAfterExhaustion,
  onAutoSolverDraftWordChange,
  onAutoSolverDraftWordShuffle,
  onAutoSolverStart,
  onObservedFailedSolve,
  onAssertedAfterExhaustion,
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
      return (
        <AutoSolver
          solution={state.solutionWord}
          hadObservedFailedSolve={hadObservedFailedSolve}
          hadAssertedAfterWordFalsified={hasAssertedAfterExhaustion}
          onObservedFailedSolve={onObservedFailedSolve}
          onAssertedAfterExhaustion={onAssertedAfterExhaustion}
        ></AutoSolver>
      )
    case 'supervisedSolver':
      return <div>supervisedSolver</div>
  }
}

type LoggedInStatusProps = {
  hadObservedFailedSolve: boolean
  hadAssertedAfterExhaustion: boolean
}

const LoggedInStatus = (props: LoggedInStatusProps) => {
  const name = deriveLoggedInName(props)
  return (
    <em property="italic" style={{ color: 'gray', fontSize: '0.8em' }}>
      {name === null ? '(Not logged in)' : `Logged in as ${name}`}
    </em>
  )
}

const deriveLoggedInName = ({
  hadAssertedAfterExhaustion,
  hadObservedFailedSolve,
}: LoggedInStatusProps): string | null => {
  if (hadAssertedAfterExhaustion && hadObservedFailedSolve) return 'Robo-Shakespear 5000'
  if (hadAssertedAfterExhaustion) return 'Shakespear'
  if (hadObservedFailedSolve) return 'bot'
  return null
}
