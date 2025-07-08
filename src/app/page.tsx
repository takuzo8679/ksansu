'use client'

import {
  Box,
  Button,
  Heading,
  Stack,
  Text,
  VStack,
} from '@chakra-ui/react'
import NextLink from 'next/link'
import { useGame } from './context/GameContext'
import { useEffect } from 'react'

export default function Home() {
  const { dispatch } = useGame()

  useEffect(() => {
    dispatch({ type: 'RESET' })
  }, [dispatch])

  const startGame = () => {
    const questions = []
    for (let i = 0; i < 10; i++) {
      const n1 = Math.floor(Math.random() * 10)
      const n2 = Math.floor(Math.random() * 10)
      questions.push({ q: `${n1} + ${n2} =`, a: n1 + n2 })
    }
    dispatch({ type: 'SET_QUESTIONS', payload: { questions } })
  }

  return (
    <Box as="main" p={8}>
      <VStack spacing="8">
        <Heading as="h1" size="2xl">
          けいさんすう
        </Heading>
        <Box>
          <Heading as="h2" size="lg" mb={4}>
            レベルせんたく
          </Heading>
          <Stack spacing={4}>
            <Text>けいさんのしゅるい：たしざん</Text>
            <Text>かずのけた：1けた</Text>
          </Stack>
        </Box>
        <Button
          as={NextLink}
          href="/practice"
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
