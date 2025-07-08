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

export default function Home() {
  return (
    <Box as="main" p={8}>
      <VStack spacing={8}>
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
        >
          れんしゅうをはじめる
        </Button>
      </VStack>
    </Box>
  )
}