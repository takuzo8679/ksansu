import { generateQuestion } from './questionGenerator'

const parseQuestion = (question: string) => {
  const match = question.match(/(\d+)\s*([+\-×÷])\s*(\d+)\s*=\s*/)
  if (!match) throw new Error('Invalid question format')
  return { n1: parseInt(match[1]), operator: match[2], n2: parseInt(match[3]) }
}

describe('generateQuestion', () => {
  it('should generate an addition question with 1 digit and no carry-up', () => {
    const { q, a, calcType, maxDigits, carryUp, borrowDown } = generateQuestion(
      'add',
      1,
      false,
      false
    )
    const { n1, n2 } = parseQuestion(q)
    expect(calcType).toBe('add')
    expect(maxDigits).toBe(1)
    expect(carryUp).toBe(false)
    expect(borrowDown).toBe(false)
    expect(n1 + n2).toBe(a)
    expect((n1 % 10) + (n2 % 10)).toBeLessThan(10)
    expect(a).toBeGreaterThanOrEqual(0)
  })

  it('should generate an addition question with 1 digit and carry-up', () => {
    const { q, a, calcType, maxDigits, carryUp, borrowDown } = generateQuestion(
      'add',
      1,
      true,
      false
    )
    const { n1, n2 } = parseQuestion(q)
    expect(calcType).toBe('add')
    expect(maxDigits).toBe(1)
    expect(carryUp).toBe(true)
    expect(borrowDown).toBe(false)
    expect(n1 + n2).toBe(a)
    expect((n1 % 10) + (n2 % 10)).toBeGreaterThanOrEqual(10)
    expect(a).toBeGreaterThanOrEqual(0)
  })

  it('should generate an addition question with 2 digits', () => {
    const { q, a, calcType, maxDigits, carryUp, borrowDown } = generateQuestion(
      'add',
      2,
      false,
      false
    )
    const { n1, n2 } = parseQuestion(q)
    expect(calcType).toBe('add')
    expect(maxDigits).toBe(2)
    expect(n1 + n2).toBe(a)
    expect(a).toBeGreaterThanOrEqual(0)
  })

  it('should generate a subtraction question with 1 digit and no borrow-down', () => {
    const { q, a, calcType, maxDigits, carryUp, borrowDown } = generateQuestion(
      'sub',
      1,
      false,
      false
    )
    const { n1, n2 } = parseQuestion(q)
    expect(calcType).toBe('sub')
    expect(maxDigits).toBe(1)
    expect(carryUp).toBe(false)
    expect(borrowDown).toBe(false)
    expect(n1 - n2).toBe(a)
    expect(a).toBeGreaterThanOrEqual(0)
    expect((n1 % 10)).toBeGreaterThanOrEqual((n2 % 10))
  })

  it('should generate a subtraction question with 1 digit and borrow-down', () => {
    const { q, a, calcType, maxDigits, carryUp, borrowDown } = generateQuestion(
      'sub',
      1,
      false,
      true
    )
    const { n1, n2 } = parseQuestion(q)
    expect(calcType).toBe('sub')
    expect(maxDigits).toBe(1)
    expect(carryUp).toBe(false)
    expect(borrowDown).toBe(true)
    expect(n1 - n2).toBe(a)
    expect(a).toBeGreaterThanOrEqual(0)
    expect((n1 % 10)).toBeLessThan((n2 % 10))
  })

  it('should generate a subtraction question with 2 digits', () => {
    const { q, a, calcType, maxDigits, carryUp, borrowDown } = generateQuestion(
      'sub',
      2,
      false,
      false
    )
    const { n1, n2 } = parseQuestion(q)
    expect(calcType).toBe('sub')
    expect(maxDigits).toBe(2)
    expect(n1 - n2).toBe(a)
    expect(a).toBeGreaterThanOrEqual(0)
  })

  it('should generate a multiplication question with 1 digit', () => {
    const { q, a, calcType, maxDigits, carryUp, borrowDown } = generateQuestion(
      'mul',
      1,
      false,
      false
    )
    const { n1, n2 } = parseQuestion(q)
    expect(calcType).toBe('mul')
    expect(maxDigits).toBe(1)
    expect(carryUp).toBe(false)
    expect(borrowDown).toBe(false)
    expect(n1 * n2).toBe(a)
    expect(a).toBeGreaterThanOrEqual(0)
  })

  it('should generate a multiplication question with 2 digits', () => {
    const { q, a, calcType, maxDigits, carryUp, borrowDown } = generateQuestion(
      'mul',
      2,
      false,
      false
    )
    const { n1, n2 } = parseQuestion(q)
    expect(calcType).toBe('mul')
    expect(maxDigits).toBe(2)
    expect(n1 * n2).toBe(a)
    expect(a).toBeGreaterThanOrEqual(0)
  })

  it('should generate a division question with 1 digit', () => {
    const { q, a, calcType, maxDigits, carryUp, borrowDown } = generateQuestion(
      'div',
      1,
      false,
      false
    )
    const { n1, n2 } = parseQuestion(q)
    expect(calcType).toBe('div')
    expect(maxDigits).toBe(1)
    expect(carryUp).toBe(false)
    expect(borrowDown).toBe(false)
    expect(n1 / n2).toBe(a)
    expect(n1 % n2).toBe(0)
    expect(a).toBeGreaterThanOrEqual(0)
  })

  it('should generate a division question with 2 digits', () => {
    const { q, a, calcType, maxDigits, carryUp, borrowDown } = generateQuestion(
      'div',
      2,
      false,
      false
    )
    const { n1, n2 } = parseQuestion(q)
    expect(calcType).toBe('div')
    expect(maxDigits).toBe(2)
    expect(n1 / n2).toBe(a)
    expect(n1 % n2).toBe(0)
    expect(a).toBeGreaterThanOrEqual(0)
  })

  it('should ensure answer is a positive integer for all types', () => {
    const types = ['add', 'sub', 'mul', 'div']
    types.forEach(type => {
      for (let i = 0; i < 10; i++) { // 複数回試行してランダム性を考慮
        const { a } = generateQuestion(type, 1, false, false)
        expect(Number.isInteger(a)).toBe(true)
        expect(a).toBeGreaterThanOrEqual(0)
      }
    })
  })
})
