'use client'

import { Box, Button, Heading, Input, VStack, Text } from '@chakra-ui/react'
import { useGame } from '../context/GameContext'
import { useRouter } from 'next/navigation'
import { useEffect, useState } from 'react'
import FeedbackDisplay from '../components/FeedbackDisplay'
import { generateQuestion } from '../../utils/questionGenerator'

export default function PracticePage() {
  const { state, dispatch } = useGame()
  const router = useRouter()
  const [answer, setAnswer] = useState('')
  const initialTime = process.env.NEXT_PUBLIC_E2E_TEST_MODE === 'true' ? 5 : 30;
  const [timeLeft, setTimeLeft] = useState(initialTime);
  const [showFeedback, setShowFeedback] = useState(false);
  const [isCorrect, setIsCorrect] = useState<boolean | null>(null);

  const { currentQuestion, calcType, maxDigits, carryUp, borrowDown } = state;

  // 初回レンダリング時に問題がなければ生成
  useEffect(() => {
    if (!currentQuestion) {
      const newQuestion = generateQuestion(
        calcType as 'add' | 'sub' | 'mul' | 'div',
        maxDigits,
        carryUp,
        borrowDown
      );
      dispatch({ type: 'SET_CURRENT_QUESTION', payload: { question: newQuestion } });
    }
  }, [currentQuestion, calcType, maxDigits, carryUp, borrowDown, dispatch]);

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
    if (!currentQuestion) return; // 問題がなければ何もしない

    const correct = currentQuestion.a === parseInt(answer, 10);

    setIsCorrect(correct);
    setShowFeedback(true);

    dispatch({ type: 'ANSWER', payload: { answer: parseInt(answer, 10) } });
    setAnswer('');

    setTimeout(() => {
      setShowFeedback(false);
    }, 1500); // Display feedback for 1.5 seconds
  }

  if (!currentQuestion) {
    return <p>...loading</p>
  }

  return (
    <Box as="main" p={8}>
      <VStack spacing={8}>
        <Heading as="h1" size="xl">
          もんだい
        </Heading>
        <Text fontSize="lg">のこりじかん: {timeLeft}びょう</Text>
        <Box fontSize="2xl" fontWeight="bold" data-testid="question-text">
          {currentQuestion.q}
        </Box>
        <Box minH="60px"> {/* Adjust minH for feedback animation */}
          <FeedbackDisplay show={showFeedback} isCorrect={isCorrect} />
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
            data-testid="answer-input"
          />
          <Button onClick={handleAnswer} colorScheme="teal" w="100%" size="lg">
            こたえあわせ
          </Button>
        </VStack>
      </VStack>
    </Box>
  )
}
