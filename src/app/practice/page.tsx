'use client'

import { Box, Button, Heading, Input, VStack, Text, Grid, GridItem } from '@chakra-ui/react'
import { useGame } from '../context/GameContext'
import { useRouter } from 'next/navigation'
import { useEffect, useState } from 'react'
import FeedbackDisplay from '../components/FeedbackDisplay'
import { generateQuestion } from '../../utils/questionGenerator'
import { FaBackspace, FaCheck } from 'react-icons/fa'; // Import icons

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

  const handleNumberClick = (num: number) => {
    setAnswer((prevAnswer) => prevAnswer + num.toString());
  };

  const handleDeleteClick = () => {
    setAnswer((prevAnswer) => prevAnswer.slice(0, -1));
  };

  const handleSubmit = () => {
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
        <Box minH="60px"> {/* Adjust minH for feedback animation */}
          <FeedbackDisplay show={showFeedback} isCorrect={isCorrect} />
        </Box>
        <Box fontSize="2xl" fontWeight="bold" data-testid="question-text">
          {currentQuestion.q}
        </Box>
        <Input
          value={answer}
          placeholder="こたえ"
          readOnly // Prevent keyboard input
          textAlign="center"
          size="lg"
          fontSize="2xl"
          height="60px"
          data-testid="answer-input"
          mb={4}
        />
        <Grid
          templateColumns="repeat(3, 1fr)"
          gap={2}
          width="100%"
          maxWidth="300px"
        >
          {[1, 2, 3, 4, 5, 6, 7, 8, 9].map((num) => (
            <GridItem key={num}>
              <Button
                onClick={() => handleNumberClick(num)}
                height="50px"
                fontSize="2xl"
                width="100%"
                data-testid={`keypad-${num}`}
              >
                {num}
              </Button>
            </GridItem>
          ))}
          <GridItem>
            <Button
              onClick={handleDeleteClick}
              height="50px"
              fontSize="2xl"
              colorScheme="red"
              width="100%"
              data-testid="keypad-delete"
            >
              <FaBackspace />
            </Button>
          </GridItem>
          <GridItem>
            <Button
              onClick={() => handleNumberClick(0)}
              height="50px"
              fontSize="2xl"
              width="100%"
              data-testid="keypad-0"
            >
              0
            </Button>
          </GridItem>
          <GridItem>
            <Button
              onClick={handleSubmit}
              height="50px"
              fontSize="2xl"
              colorScheme="teal"
              width="100%"
              data-testid="keypad-submit"
            >
              <FaCheck />
            </Button>
          </GridItem>
        </Grid>
      </VStack>
    </Box>
  )
}
