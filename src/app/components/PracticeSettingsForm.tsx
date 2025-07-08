import { Box, Heading, Radio, RadioGroup, Stack, VStack } from '@chakra-ui/react';
import React from 'react';

interface PracticeSettingsFormProps {
  calcType: string;
  setCalcType: (value: string) => void;
  maxDigits: string;
  setMaxDigits: (value: string) => void;
  carryUp: string;
  setCarryUp: (value: string) => void;
  borrowDown: string;
  setBorrowDown: (value: string) => void;
}

const PracticeSettingsForm: React.FC<PracticeSettingsFormProps> = ({
  calcType,
  setCalcType,
  maxDigits,
  setMaxDigits,
  carryUp,
  setCarryUp,
  borrowDown,
  setBorrowDown,
}) => {
  return (
    <Box>
      <Heading as="h2" size="lg" mb={4}>
        レベルせんたく
      </Heading>
      <Stack spacing={4}>
        <RadioGroup onChange={setCalcType} value={calcType}>
          <Stack direction="row">
            <Radio value="add" data-testid="calc-type-add">たしざん</Radio>
            <Radio value="sub" data-testid="calc-type-sub">ひきざん</Radio>
            <Radio value="mul" data-testid="calc-type-mul">かけざん</Radio>
            <Radio value="div" data-testid="calc-type-div">わりざん</Radio>
          </Stack>
        </RadioGroup>
        <RadioGroup onChange={setMaxDigits} value={maxDigits}>
          <Stack direction="row">
            <Radio value="1" data-testid="max-digits-1">1けた</Radio>
            <Radio value="2" data-testid="max-digits-2">2けた</Radio>
            <Radio value="3" data-testid="max-digits-3">3けた</Radio>
            <Radio value="4" data-testid="max-digits-4">4けた</Radio>
          </Stack>
        </RadioGroup>
        {calcType === 'add' && (
          <RadioGroup onChange={setCarryUp} value={carryUp}>
            <Stack direction="row">
              <Radio value="true" data-testid="carry-up-true">くりあがりあり</Radio>
              <Radio value="false" data-testid="carry-up-false">くりあがりなし</Radio>
            </Stack>
          </RadioGroup>
        )}
        {calcType === 'sub' && (
          <RadioGroup onChange={setBorrowDown} value={borrowDown}>
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

export default PracticeSettingsForm;
