'use client'

import { Box, Button, Heading, Input, VStack, Text } from '@chakra-ui/react'
import { useGame } from '../context/GameContext'
import { useRouter } from 'next/navigation'
import { useEffect, useState } from 'react'

export default function PracticePage() {
  const { state, dispatch } = useGame()
  const router = useRouter()
  const [answer, setAnswer] = useState('')
  const [timeLeft, setTimeLeft] = useState(120) // 120秒

  const { questions, currentQuestionIndex } = state

  useEffect(() => {
    if (questions.length > 0 && currentQuestionIndex >= questions.length) {
      router.push('/result')
    }
  }, [currentQuestionIndex, questions.length, router])

  useEffect(() => {
    if (timeLeft === 0) {
      router.push('/result')
      return
    }

    const timer = setInterval(() => {
      setTimeLeft((prevTime) => prevTime - 1)
    }, 1000)

    return () => clearInterval(timer)
  }, [timeLeft, router])

  const handleAnswer = () => {
    dispatch({ type: 'ANSWER', payload: { answer: parseInt(answer, 10) } })
    setAnswer('')
  }

  if (questions.length === 0 || currentQuestionIndex >= questions.length) {
    return <p>...loading</p>
  }

  return (
    <Box as="main" p={8}>
      <VStack spacing={8}>
        <Heading as="h1" size="xl">
          もんだい {currentQuestionIndex + 1}
        </Heading>
        <Text fontSize="lg">のこりじかん: {timeLeft}びょう</Text>
        <Box fontSize="2xl" fontWeight="bold">
          {questions[currentQuestionIndex].q}
        </Box>
        <VStack spacing={4} w="100%" maxW="xs">
          <Input
            type="number"
            placeholder="こたえ"
            value={answer}
            onChange={(e) => setAnswer(e.target.value)}
            onKeyDown={(e) => e.key === 'Enter' && handleAnswer()}
            textAlign="center"
            size="lg"
          />
          <Button onClick={handleAnswer} colorScheme="teal" w="100%" size="lg">
            こたえあわせ
          </Button>
        </VStack>
      </VStack>
    </Box>
  )
}
