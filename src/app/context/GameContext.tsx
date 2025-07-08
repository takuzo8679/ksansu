'use client'

import { createContext, useContext, useReducer } from 'react'

// 状態の型定義
interface GameState {
  questions: { q: string; a: number; calcType: string; maxDigits: number; carryUp: boolean; borrowDown: boolean }[]
  currentQuestionIndex: number
  score: number
  correctAnswersCount: number // 正答数を追加
}

// アクションの型定義
type GameAction =
  | { type: 'SET_QUESTIONS'; payload: { questions: { q: string; a: number; calcType: string; maxDigits: number; carryUp: boolean; borrowDown: boolean }[] } }
  | { type: 'ANSWER'; payload: { answer: number } }
  | { type: 'RESET' }

// 初期状態
const initialState: GameState = {
  questions: [],
  currentQuestionIndex: 0,
  score: 0,
  correctAnswersCount: 0, // 初期化
}

// Reducer
const gameReducer = (state: GameState, action: GameAction): GameState => {
  switch (action.type) {
    case 'SET_QUESTIONS':
      return { ...state, questions: action.payload.questions }
    case 'ANSWER': {
      const currentQuestion = state.questions[state.currentQuestionIndex]
      const isCorrect = currentQuestion.a === action.payload.answer
      let scoreToAdd = 0
      let correctAnswersCountIncrement = 0

      if (isCorrect) {
        // 基礎点
        if (currentQuestion.calcType === 'add' || currentQuestion.calcType === 'sub') {
          scoreToAdd += 1
        } else if (currentQuestion.calcType === 'mul' || currentQuestion.calcType === 'div') {
          scoreToAdd += 2
        }

        // 桁数に応じた点数
        scoreToAdd += currentQuestion.maxDigits

        // 繰り上がり・繰り下がりによる点数
        if (currentQuestion.carryUp || currentQuestion.borrowDown) {
          scoreToAdd += 1
        }
        correctAnswersCountIncrement = 1 // 正解の場合のみインクリメント
      }

      return {
        ...state,
        score: state.score + scoreToAdd,
        currentQuestionIndex: state.currentQuestionIndex + 1,
        correctAnswersCount: state.correctAnswersCount + correctAnswersCountIncrement, // 正答数を更新
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