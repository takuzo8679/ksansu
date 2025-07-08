'use client'

import { Box, Button, Heading, Input, VStack, Text } from '@chakra-ui/react'
import { useGame } from '../context/GameContext'
import { useRouter } from 'next/navigation'
import { useEffect, useState } from 'react'
import FeedbackDisplay from '../components/FeedbackDisplay'

export default function PracticePage() {
  const { state, dispatch } = useGame()
  const router = useRouter()
  const [answer, setAnswer] = useState('')
  // e2eテストモードの場合は5秒、それ以外は120秒
  const initialTime = process.env.NEXT_PUBLIC_E2E_TEST_MODE === 'true' ? 5 : 120;
  const [timeLeft, setTimeLeft] = useState(initialTime);
  const [feedbackMessage, setFeedbackMessage] = useState<string | null>(null);
  const [feedbackClass, setFeedbackClass] = useState<string | undefined>(undefined);

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
    const currentQuestion = questions[currentQuestionIndex];
    const isCorrect = currentQuestion.a === parseInt(answer, 10);

    dispatch({ type: 'ANSWER', payload: { answer: parseInt(answer, 10) } });
    setAnswer('');

    if (isCorrect) {
      setFeedbackMessage('せいかい！');
      setFeedbackClass('feedback correct');
    } else {
      setFeedbackMessage('まちがい！');
      setFeedbackClass('feedback incorrect');
    }

    // Clear feedback after a short delay
    const feedbackTimer = setTimeout(() => {
      setFeedbackMessage(null);
      setFeedbackClass(undefined);
    }, 1500); // Display feedback for 1.5 seconds

    // Cleanup function for useEffect (though not strictly necessary here as it's a one-off)
    // return () => clearTimeout(feedbackTimer);
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
        <Box fontSize="2xl" fontWeight="bold" data-testid="question-text">
          {questions[currentQuestionIndex].q}
        </Box>
        <Box minH="30px"> {/* Adjust minH based on the height of your feedback message */}
          <FeedbackDisplay message={feedbackMessage} className={feedbackClass} />
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
