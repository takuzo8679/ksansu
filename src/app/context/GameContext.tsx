'use client'

import { createContext, useContext, useReducer } from 'react'

// 状態の型定義
interface GameState {
  questions: { q: string; a: number }[]
  currentQuestionIndex: number
  score: number
}

// アクションの型定義
type GameAction =
  | { type: 'SET_QUESTIONS'; payload: { questions: { q: string; a: number }[] } }
  | { type: 'ANSWER'; payload: { answer: number } }
  | { type: 'RESET' }

// 初期状態
const initialState: GameState = {
  questions: [],
  currentQuestionIndex: 0,
  score: 0,
}

// Reducer
const gameReducer = (state: GameState, action: GameAction): GameState => {
  switch (action.type) {
    case 'SET_QUESTIONS':
      return { ...state, questions: action.payload.questions }
    case 'ANSWER': {
      const isCorrect = state.questions[state.currentQuestionIndex].a === action.payload.answer
      const newScore = isCorrect ? state.score + 1 : state.score
      const newQuestionIndex = state.currentQuestionIndex + 1

      return {
        ...state,
        score: newScore,
        currentQuestionIndex: newQuestionIndex,
      }
    }
    case 'RESET':
      return initialState
    default:
      return state
  }
}

// Context
const GameContext = createContext<
  { state: GameState; dispatch: React.Dispatch<GameAction> } | undefined
>(undefined)

// Provider
export const GameProvider = ({ children }: { children: React.ReactNode }) => {
  const [state, dispatch] = useReducer(gameReducer, initialState)

  return (
    <GameContext.Provider value={{ state, dispatch }}>
      {children}
    </GameContext.Provider>
  )
}

// Custom Hook
export const useGame = () => {
  const context = useContext(GameContext)
  if (!context) {
    throw new Error('useGame must be used within a GameProvider')
  }
  return context
}
