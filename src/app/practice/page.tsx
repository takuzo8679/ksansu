'use client'

import { Box, Button, Heading, Input, VStack } from '@chakra-ui/react'
import NextLink from 'next/link'

export default function PracticePage() {
  return (
    <Box as="main" p={8}>
      <VStack spacing={8}>
        <Heading as="h1" size="xl">
          もんだい
        </Heading>
        <Box>1 + 1 =</Box>
        <Input placeholder="こたえ" />
        <Button as={NextLink} href="/result" colorScheme="teal">
          こたえあわせ
        </Button>
      </VStack>
    </Box>
  )
}
