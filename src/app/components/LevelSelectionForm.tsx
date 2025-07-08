import { Box, Heading, Radio, RadioGroup, Stack } from '@chakra-ui/react';
import React from 'react';
import { useGame } from '../context/GameContext';

const LevelSelectionForm: React.FC = () => {
  const { state, dispatch } = useGame();
  const { calcType, maxDigits, carryUp, borrowDown } = state;
  return (
    <Box>
      <Heading as="h2" size="lg" mb={4}>
        レベルせんたく
      </Heading>
      <Stack spacing={4}>
        <RadioGroup onChange={(value) => dispatch({ type: 'SET_CALC_TYPE', payload: { calcType: value } })} value={calcType}>
          <Stack direction="row">
            <Radio value="add" data-testid="calc-type-add">たしざん</Radio>
            <Radio value="sub" data-testid="calc-type-sub">ひきざん</Radio>
            <Radio value="mul" data-testid="calc-type-mul">かけざん</Radio>
            <Radio value="div" data-testid="calc-type-div">わりざん</Radio>
          </Stack>
        </RadioGroup>
        <RadioGroup onChange={(value) => dispatch({ type: 'SET_MAX_DIGITS', payload: { maxDigits: parseInt(value) } })} value={maxDigits.toString()}>
          <Stack direction="row">
            <Radio value="1" data-testid="max-digits-1">1けた</Radio>
            <Radio value="2" data-testid="max-digits-2">2けた</Radio>
            <Radio value="3" data-testid="max-digits-3">3けた</Radio>
            <Radio value="4" data-testid="max-digits-4">4けた</Radio>
          </Stack>
        </RadioGroup>
        {calcType === 'add' && (
          <RadioGroup onChange={(value) => dispatch({ type: 'SET_CARRY_UP', payload: { carryUp: value === 'true' } })} value={carryUp.toString()}>
            <Stack direction="row">
              <Radio value="true" data-testid="carry-up-true">くりあがりあり</Radio>
              <Radio value="false" data-testid="carry-up-false">くりあがりなし</Radio>
            </Stack>
          </RadioGroup>
        )}
        {calcType === 'sub' && (
          <RadioGroup onChange={(value) => dispatch({ type: 'SET_BORROW_DOWN', payload: { borrowDown: value === 'true' } })} value={borrowDown.toString()}>
            <Stack direction="row">
              <Radio value="true" data-testid="borrow-down-true">くりさがりあり</Radio>
              <Radio value="false" data-testid="borrow-down-false">くりさがりなし</Radio>
            </Stack>
          </RadioGroup>
        )}
      </Stack>
    </Box>
  );
};

export default LevelSelectionForm;
