'use client'

import { Box, Button, Heading, Text, VStack } from '@chakra-ui/react'
import NextLink from 'next/link'
import { useGame } from '../context/GameContext'

export default function ResultPage() {
  const { state } = useGame()
  const { questions, score } = state

  return (
    <Box as="main" p={8}>
      <VStack spacing={8}>
        <Heading as="h1" size="xl">
          けっか
        </Heading>
        <Text>
          {questions.length}もんちゅう {score}もんせいかい！
        </Text>
        <Button as={NextLink} href="/" colorScheme="teal">
          もういっかい
        </Button>
      </VStack>
    </Box>
  )
}
