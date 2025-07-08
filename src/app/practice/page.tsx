'use client'

import { Box, Button, Heading, Input, VStack } from '@chakra-ui/react'
import { useGame } from '../context/GameContext'
import { useRouter } from 'next/navigation'
import { useState } from 'react'

export default function PracticePage() {
  const { state, dispatch } = useGame()
  const router = useRouter()
  const [answer, setAnswer] = useState('')

  const { questions, currentQuestionIndex } = state

  const handleAnswer = () => {
    dispatch({ type: 'ANSWER', payload: { answer: parseInt(answer, 10) } })
    setAnswer('')
    if (currentQuestionIndex === questions.length - 1) {
      router.push('/result')
    }
  }

  if (questions.length === 0) {
    return <p>...loading</p>
  }

  return (
    <Box as="main" p={8}>
      <VStack spacing={8}>
        <Heading as="h1" size="xl">
          もんだい {currentQuestionIndex + 1}
        </Heading>
        <Box>{questions[currentQuestionIndex].q}</Box>
        <Input
          placeholder="こたえ"
          value={answer}
          onChange={(e) => setAnswer(e.target.value)}
          onKeyDown={(e) => e.key === 'Enter' && handleAnswer()}
        />
        <Button onClick={handleAnswer} colorScheme="teal">
          こたえあわせ
        </Button>
      </VStack>
    </Box>
  )
}
