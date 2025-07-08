'use client'

import {
  Box,
  Button,
  Heading,
  Radio,
  RadioGroup,
  Stack,
  Text,
  VStack,
} from '@chakra-ui/react'
import NextLink from 'next/link'
import { useGame } from './context/GameContext'
import { useEffect, useState } from 'react'
import { generateQuestion } from '../utils/questionGenerator'
import { useRouter } from 'next/navigation'

export default function Home() {
  const { dispatch } = useGame()
  const router = useRouter()
  const [calcType, setCalcType] = useState('add')
  const [maxDigits, setMaxDigits] = useState('1')
  const [carryUp, setCarryUp] = useState('false')
  const [borrowDown, setBorrowDown] = useState('false')

  useEffect(() => {
    dispatch({ type: 'RESET' })

    // クライアントサイドでのみlocalStorageから値を読み込む
    if (typeof window !== 'undefined') {
      setCalcType(localStorage.getItem('calcType') || 'add')
      setMaxDigits(localStorage.getItem('maxDigits') || '1')
      setCarryUp(localStorage.getItem('carryUp') || 'false')
      setBorrowDown(localStorage.getItem('borrowDown') || 'false')
    }
  }, [dispatch])

  useEffect(() => {
    if (typeof window !== 'undefined') {
      localStorage.setItem('calcType', calcType)
    }
  }, [calcType])

  useEffect(() => {
    if (typeof window !== 'undefined') {
      localStorage.setItem('maxDigits', maxDigits)
    }
  }, [maxDigits])

  useEffect(() => {
    if (typeof window !== 'undefined') {
      localStorage.setItem('carryUp', carryUp)
    }
  }, [carryUp])

  useEffect(() => {
    if (typeof window !== 'undefined') {
      localStorage.setItem('borrowDown', borrowDown)
    }
  }, [borrowDown])

  const startGame = () => {
    dispatch({ type: 'SET_QUESTIONS', payload: { questions } })
    router.push('/practice')
  }

  return (
    <Box as="main" p={8}>
      <VStack gap="8">
        <Heading as="h1" size="2xl">
          けいさんすう
        </Heading>
        <Box>
          <Heading as="h2" size="lg" mb={4}>
            レベルせんたく
          </Heading>
          <Stack spacing={4}>
            <RadioGroup onChange={setCalcType} value={calcType}>
              <Stack direction="row">
                <Radio value="add">たしざん</Radio>
                <Radio value="sub">ひきざん</Radio>
                <Radio value="mul">かけざん</Radio>
                <Radio value="div">わりざん</Radio>
              </Stack>
            </RadioGroup>
            <RadioGroup onChange={setMaxDigits} value={maxDigits}>
              <Stack direction="row">
                <Radio value="1">1けた</Radio>
                <Radio value="2">2けた</Radio>
                <Radio value="3">3けた</Radio>
                <Radio value="4">4けた</Radio>
              </Stack>
            </RadioGroup>
            {calcType === 'add' && (
              <RadioGroup onChange={setCarryUp} value={carryUp}>
                <Stack direction="row">
                  <Radio value="true">くりあがりあり</Radio>
                  <Radio value="false">くりあがりなし</Radio>
                </Stack>
              </RadioGroup>
            )}
            {calcType === 'sub' && (
              <RadioGroup onChange={setBorrowDown} value={borrowDown}>
                <Stack direction="row">
                  <Radio value="true">くりさがりあり</Radio>
                  <Radio value="false">くりさがりなし</Radio>
                </Stack>
              </RadioGroup>
            )}
          </Stack>
        </Box>
        <Button
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