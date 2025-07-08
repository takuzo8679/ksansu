'use client'

import { createContext, useContext, useReducer, useEffect } from 'react'
import useLocalStorage from '../../hooks/useLocalStorage'

// 型定義
interface User {
  id: string;
  name: string;
}

interface GameState {
  users: User[];
  currentUser: User | null;
  questions: { q: string; a: number; calcType: string; maxDigits: number; carryUp: boolean; borrowDown: boolean }[]
  currentQuestionIndex: number
  score: number
  correctAnswersCount: number
}

// アクションの型定義
type GameAction =
  | { type: 'SET_QUESTIONS'; payload: { questions: { q: string; a: number; calcType: string; maxDigits: number; carryUp: boolean; borrowDown: boolean }[] } }
  | { type: 'ANSWER'; payload: { answer: number } }
  | { type: 'RESET' }
  | { type: 'ADD_USER'; payload: { name: string } }
  | { type: 'SWITCH_USER'; payload: { userId: string } };

// 初期状態
const initialState: GameState = {
  users: [],
  currentUser: null,
  questions: [],
  currentQuestionIndex: 0,
  score: 0,
  correctAnswersCount: 0,
}

// Reducer
const gameReducer = (state: GameState, action: GameAction): GameState => {
  switch (action.type) {
    case 'SET_QUESTIONS':
      return { ...state, questions: action.payload.questions, score: 0, correctAnswersCount: 0, currentQuestionIndex: 0 }
    case 'ANSWER': {
      const currentQuestion = state.questions[state.currentQuestionIndex]
      const isCorrect = currentQuestion.a === action.payload.answer
      let scoreToAdd = 0
      let correctAnswersCountIncrement = 0

      if (isCorrect) {
        if (currentQuestion.calcType === 'add' || currentQuestion.calcType === 'sub') scoreToAdd += 1
        else if (currentQuestion.calcType === 'mul' || currentQuestion.calcType === 'div') scoreToAdd += 2
        scoreToAdd += currentQuestion.maxDigits
        if (currentQuestion.carryUp || currentQuestion.borrowDown) scoreToAdd += 1
        correctAnswersCountIncrement = 1
      }

      return {
        ...state,
        score: state.score + scoreToAdd,
        currentQuestionIndex: state.currentQuestionIndex + 1,
        correctAnswersCount: state.correctAnswersCount + correctAnswersCountIncrement,
      }
    }
    case 'RESET':
      return { ...state, questions: [], currentQuestionIndex: 0, score: 0, correctAnswersCount: 0 }
    case 'ADD_USER': {
      const newUser: User = { id: crypto.randomUUID(), name: action.payload.name };
      return { ...state, users: [...state.users, newUser], currentUser: newUser };
    }
    case 'SWITCH_USER': {
      const user = state.users.find(u => u.id === action.payload.userId) || null;
      return { ...state, currentUser: user };
    }
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
  const [savedState, setSavedState] = useLocalStorage('gameState', initialState);
  const [state, dispatch] = useReducer(gameReducer, savedState || initialState)

  useEffect(() => {
    setSavedState(state);
  }, [state, setSavedState]);

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