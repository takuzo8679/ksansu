'use client'

import {
  Box,
  Button,
  Heading,
  VStack,
  Text,
} from '@chakra-ui/react'
import { useGame } from './context/GameContext'
import { generateQuestion } from '../utils/questionGenerator'
import { useRouter } from 'next/navigation'

import LevelSelectionForm from './components/LevelSelectionForm'
import UserManagement from './components/UserManagement'

export default function Home() {
  const { state, dispatch } = useGame()
  const router = useRouter()
  

  const startGame = () => {
    dispatch({ type: 'RESET' });
    dispatch({
      type: 'SET_SETTINGS',
      payload: {
        calcType: state.calcType,
        maxDigits: state.maxDigits,
        carryUp: state.carryUp,
        borrowDown: state.borrowDown,
      },
    });
    router.push('/practice');
  }

  return (
    <Box as="main" p={8}>
      <VStack gap="8">
        <Heading as="h1" size="2xl">
          けいさんすう
        </Heading>
        {state.currentUser && (
          <Text fontSize="xl">こんにちは、{state.currentUser.name}さん！</Text>
        )}
        <UserManagement />
        <LevelSelectionForm />
        <Button
          colorScheme="teal"
          size="lg"
          onClick={startGame}
          isDisabled={!state.currentUser}
          data-testid="start-button"
        >
          れんしゅうをはじめる
        </Button>
      </VStack>
    </Box>
  )
}
