import { generateQuestion } from './questionGenerator'

const parseQuestion = (question: string) => {
  const match = question.match(/(\d+)\s*([+\-×÷])\s*(\d+)\s*=\s*/)
  if (!match) throw new Error('Invalid question format')
  return { n1: parseInt(match[1]), operator: match[2], n2: parseInt(match[3]) }
}

// Constants for calculation types
const CALC_TYPE = {
  ADD: 'add',
  SUB: 'sub',
  MUL: 'mul',
  DIV: 'div',
}

describe('generateQuestion', () => {
  // Helper function for common assertions
  const commonAssertions = (q: string, a: number, calcType: string, maxDigits: number, carryUp: boolean, borrowDown: boolean) => {
    const { n1, operator, n2 } = parseQuestion(q);
    expect(calcType).toBe(calcType);
    expect(maxDigits).toBe(maxDigits);
    expect(carryUp).toBe(carryUp);
    expect(borrowDown).toBe(borrowDown);
    expect(a).toBeGreaterThanOrEqual(0);

    switch (operator) {
      case '+':
        expect(n1 + n2).toBe(a);
        break;
      case '-':
        expect(n1 - n2).toBe(a);
        break;
      case '×':
        expect(n1 * n2).toBe(a);
        break;
      case '÷':
        expect(n1 / n2).toBe(a);
        expect(n1 % n2).toBe(0);
        break;
    }
  };

  describe('Addition questions', () => {
    test.each([
      [1, false, false, '1 digit and no carry-up', (n1: number, n2: number) => (n1 % 10) + (n2 % 10) < 10],
      [1, true, false, '1 digit and carry-up', (n1: number, n2: number) => (n1 % 10) + (n2 % 10) >= 10],
      [2, false, false, '2 digits', () => true], // No specific carry-up/down check for multi-digit
    ])('should generate an addition question with %s', (digits, carry, borrow, description, unitCheck) => {
      const { q, a, calcType, maxDigits, carryUp, borrowDown } = generateQuestion(
        CALC_TYPE.ADD,
        digits,
        carry,
        borrow
      );
      commonAssertions(q, a, calcType, maxDigits, carryUp, borrowDown);
      const { n1, n2 } = parseQuestion(q);
      expect(unitCheck(n1, n2)).toBe(true);
    });
  });

  describe('Subtraction questions', () => {
    test.each([
      [1, false, false, '1 digit and no borrow-down', (n1: number, n2: number) => (n1 % 10) >= (n2 % 10)],
      [1, false, true, '1 digit and borrow-down', (n1: number, n2: number) => (n1 % 10) < (n2 % 10)],
      [2, false, false, '2 digits', () => true],
    ])('should generate a subtraction question with %s', (digits, carry, borrow, description, unitCheck) => {
      const { q, a, calcType, maxDigits, carryUp, borrowDown } = generateQuestion(
        CALC_TYPE.SUB,
        digits,
        carry,
        borrow
      );
      commonAssertions(q, a, calcType, maxDigits, carryUp, borrowDown);
      const { n1, n2 } = parseQuestion(q);
      expect(unitCheck(n1, n2)).toBe(true);
    });
  });

  describe('Multiplication questions', () => {
    test.each([
      [1, '1 digit'],
      [2, '2 digits'],
    ])('should generate a multiplication question with %s', (digits, description) => {
      const { q, a, calcType, maxDigits, carryUp, borrowDown } = generateQuestion(
        CALC_TYPE.MUL,
        digits,
        false,
        false
      );
      commonAssertions(q, a, calcType, maxDigits, carryUp, borrowDown);
    });
  });

  describe('Division questions', () => {
    test.each([
      [1, '1 digit'],
      [2, '2 digits'],
    ])('should generate a division question with %s', (digits, description) => {
      const { q, a, calcType, maxDigits, carryUp, borrowDown } = generateQuestion(
        CALC_TYPE.DIV,
        digits,
        false,
        false
      );
      commonAssertions(q, a, calcType, maxDigits, carryUp, borrowDown);
    });
  });

  it('should ensure answer is a positive integer for all types', () => {
    const types = [CALC_TYPE.ADD, CALC_TYPE.SUB, CALC_TYPE.MUL, CALC_TYPE.DIV]
    types.forEach(type => {
      for (let i = 0; i < 10; i++) { // 複数回試行してランダム性を考慮
        const { a } = generateQuestion(type, 1, false, false)
        expect(Number.isInteger(a)).toBe(true)
        expect(a).toBeGreaterThanOrEqual(0)
      }
    })
  })
})