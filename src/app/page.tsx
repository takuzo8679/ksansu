'use client'

import {
  Box,
  Button,
  Heading,
  VStack,
} from '@chakra-ui/react'
import { useGame } from './context/GameContext'
import { useEffect } from 'react'
import { generateQuestion } from '../utils/questionGenerator'
import { useRouter } from 'next/navigation'
import useLocalStorage from '../hooks/useLocalStorage'
import PracticeSettingsForm from './components/PracticeSettingsForm'

export default function Home() {
  const { dispatch } = useGame()
  const router = useRouter()
  const [calcType, setCalcType] = useLocalStorage('calcType', 'add')
  const [maxDigits, setMaxDigits] = useLocalStorage('maxDigits', '1')
  const [carryUp, setCarryUp] = useLocalStorage('carryUp', 'false')
  const [borrowDown, setBorrowDown] = useLocalStorage('borrowDown', 'false')

  useEffect(() => {
    dispatch({ type: 'RESET' })
  }, [dispatch])

  const startGame = () => {
    const questions = Array.from({ length: 10 }, () =>
      generateQuestion(
        calcType as 'add' | 'sub' | 'mul' | 'div',
        parseInt(maxDigits),
        carryUp === 'true',
        borrowDown === 'true',
      ),
    )
    dispatch({ type: 'SET_QUESTIONS', payload: { questions } })
    router.push('/practice')
  }

  return (
    <Box as="main" p={8}>
      <VStack gap="8">
        <Heading as="h1" size="2xl">
          けいさんすう
        </Heading>
        <PracticeSettingsForm
          calcType={calcType}
          setCalcType={setCalcType}
          maxDigits={maxDigits}
          setMaxDigits={setMaxDigits}
          carryUp={carryUp}
          setCarryUp={setCarryUp}
          borrowDown={borrowDown}
          setBorrowDown={setBorrowDown}
        />
        <Button
          colorScheme="teal"
          size="lg"
          onClick={startGame}
        >
          れんしゅうをはじめる
        </Button>
      </VStack>
    </Box>
  )
}