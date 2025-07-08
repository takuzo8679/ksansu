'use client'



import { createContext, useContext, useReducer, useEffect, useState } from 'react'
import useLocalStorage from '../../hooks/useLocalStorage'
import { generateQuestion } from '../../utils/questionGenerator'

// 型定義
interface User {
  id: string;
  name: string;
}

interface Question {
  q: string;
  a: number;
  calcType: string;
  maxDigits: number;
  carryUp: boolean;
  borrowDown: boolean;
}

interface GameState {
  users: User[];
  currentUser: User | null;
  currentQuestion: Question | null; // 単一の現在の問題
  score: number;
  correctAnswersCount: number;
  calcType: string;
  maxDigits: number;
  carryUp: boolean;
  borrowDown: boolean;
  soundEnabled: boolean;
}

// アクションの型定義
type GameAction =
  | { type: 'SET_SETTINGS'; payload: { calcType: string; maxDigits: number; carryUp: boolean; borrowDown: boolean } }
  | { type: 'SET_CURRENT_QUESTION'; payload: { question: Question } }
  | { type: 'ANSWER'; payload: { answer: number } }
  | { type: 'RESET' }
  | { type: 'ADD_USER'; payload: { name: string } }
  | { type: 'SWITCH_USER'; payload: { userId: string } }
  | { type: 'SET_SAVED_STATE'; payload: GameState }
  | { type: 'SET_CALC_TYPE'; payload: { calcType: string } }
  | { type: 'SET_MAX_DIGITS'; payload: { maxDigits: number } }
  | { type: 'SET_CARRY_UP'; payload: { carryUp: boolean } }
  | { type: 'SET_BORROW_DOWN'; payload: { borrowDown: boolean } }
  | { type: 'SET_SOUND_ENABLED'; payload: { soundEnabled: boolean } };

// 初期状態
const initialState: GameState = {
  users: [],
  currentUser: null,
  currentQuestion: null,
  score: 0,
  correctAnswersCount: 0,
  calcType: 'add',
  maxDigits: 1,
  carryUp: false,
  borrowDown: false,
  soundEnabled: true,
}

// Reducer
const gameReducer = (state: GameState, action: GameAction): GameState => {
  switch (action.type) {
    case 'SET_SETTINGS':
      return { ...state, ...action.payload };
    case 'SET_CURRENT_QUESTION':
      return { ...state, currentQuestion: action.payload.question, score: 0, correctAnswersCount: 0 };
    case 'ANSWER': {
      if (!state.currentQuestion) return state;

      const isCorrect = state.currentQuestion.a === action.payload.answer;
      let scoreToAdd = 0;
      let correctAnswersCountIncrement = 0;

      if (isCorrect) {
        if (state.currentQuestion.calcType === 'add' || state.currentQuestion.calcType === 'sub') scoreToAdd += 1;
        else if (state.currentQuestion.calcType === 'mul' || state.currentQuestion.calcType === 'div') scoreToAdd += 2;
        scoreToAdd += state.currentQuestion.maxDigits;
        if (state.currentQuestion.carryUp || state.currentQuestion.borrowDown) scoreToAdd += 1;
        correctAnswersCountIncrement = 1;

        // 正解の場合、新しい問題を生成
        const newQuestion = generateQuestion(
          state.calcType as 'add' | 'sub' | 'mul' | 'div',
          state.maxDigits,
          state.carryUp,
          state.borrowDown
        );

        return {
          ...state,
          score: state.score + scoreToAdd,
          correctAnswersCount: state.correctAnswersCount + correctAnswersCountIncrement,
          currentQuestion: newQuestion,
        };
      }

      // 不正解の場合、問題はそのまま
      return {
        ...state,
        score: state.score + scoreToAdd, // 不正解でもスコアは加算されないが、念のため
        correctAnswersCount: state.correctAnswersCount + correctAnswersCountIncrement,
      };
    }
    case 'RESET':
      return { ...initialState, users: state.users, currentUser: state.currentUser, soundEnabled: state.soundEnabled };
    case 'ADD_USER': {
      const newUser: User = { id: crypto.randomUUID(), name: action.payload.name };
      return { ...state, users: [...state.users, newUser], currentUser: newUser };
    }
    case 'SWITCH_USER': {
      const user = state.users.find(u => u.id === action.payload.userId) || null;
      return { ...state, currentUser: user };
    }
    case 'SET_SAVED_STATE':
      return { ...action.payload };
    case 'SET_CALC_TYPE':
      return { ...state, calcType: action.payload.calcType };
    case 'SET_MAX_DIGITS':
      return { ...state, maxDigits: action.payload.maxDigits };
    case 'SET_CARRY_UP':
      return { ...state, carryUp: action.payload.carryUp };
    case 'SET_BORROW_DOWN':
      return { ...state, borrowDown: action.payload.borrowDown };
    case 'SET_SOUND_ENABLED':
      return { ...state, soundEnabled: action.payload.soundEnabled };
    default:
      return state;
  }
};

// Context
const GameContext = createContext<
  { state: GameState; dispatch: React.Dispatch<GameAction>; isLoaded: boolean } | undefined
>(undefined);

// Provider
export const GameProvider = ({ children }: { children: React.ReactNode }) => {
  const [state, dispatch] = useReducer(gameReducer, initialState);
  const [isLoaded, setIsLoaded] = useState(false);

  useEffect(() => {
    if (typeof window !== 'undefined') {
      try {
        const savedState = localStorage.getItem('gameState');
        if (savedState) {
          dispatch({ type: 'SET_SAVED_STATE', payload: JSON.parse(savedState) });
        }
      } catch (error) {
        console.error("Failed to load state from localStorage", error);
      } finally {
        setIsLoaded(true);
      }
    }
  }, []);

  useEffect(() => {
    if (isLoaded && typeof window !== 'undefined') {
      try {
        localStorage.setItem('gameState', JSON.stringify(state));
      } catch (error) {
        console.error("Failed to save state to localStorage", error);
      }
    }
  }, [state, isLoaded]);

  return (
    <GameContext.Provider value={{ state, dispatch, isLoaded }}>
      {children}
    </GameContext.Provider>
  );
};

// Custom Hook
export const useGame = () => {
  const context = useContext(GameContext);
  if (!context) {
    throw new Error('useGame must be used within a GameProvider');
  }
  return context;
}