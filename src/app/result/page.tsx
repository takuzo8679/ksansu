'use client'

import { Box, Button, Heading, Text, VStack } from '@chakra-ui/react'
import NextLink from 'next/link'

export default function ResultPage() {
  return (
    <Box as="main" p={8}>
      <VStack spacing={8}>
        <Heading as="h1" size="xl">
          けっか
        </Heading>
        <Text>10もんちゅう 8もんせいかい！</Text>
        <Button as={NextLink} href="/" colorScheme="teal">
          もういっかい
        </Button>
      </VStack>
    </Box>
  )
}
