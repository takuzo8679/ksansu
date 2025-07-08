export const generateQuestion = (type: string, digits: number, carry: boolean, borrow: boolean) => {
  let n1, n2, q, a
  let attempts = 0
  const maxAttempts = 1000 // 無限ループ防止のための最大試行回数

  switch (type) {
    case 'add':
      do {
        n1 = Math.floor(Math.random() * Math.pow(10, digits))
        n2 = Math.floor(Math.random() * Math.pow(10, digits))
        a = n1 + n2
        attempts++
        if (attempts > maxAttempts) {
          console.warn('Addition: Max attempts reached, could not generate question with specified criteria.')
          // デフォルトの問題を返すか、エラーをスローするか、適切なハンドリングを行う
          return { q: '0 + 0 =', a: 0, calcType: type, maxDigits: digits, carryUp: carry, borrowDown: borrow }
        }
      } while ((carry && (n1 % 10) + (n2 % 10) < 10) || (!carry && (n1 % 10) + (n2 % 10) >= 10))
      q = `${n1} + ${n2} =`
      break
    case 'sub':
      do {
        n1 = Math.floor(Math.random() * Math.pow(10, digits))
        n2 = Math.floor(Math.random() * Math.pow(10, digits))
        a = n1 - n2
        attempts++
        if (attempts > maxAttempts) {
          console.warn('Subtraction: Max attempts reached, could not generate question with specified criteria.')
          return { q: '0 - 0 =', a: 0, calcType: type, maxDigits: digits, carryUp: carry, borrowDown: borrow }
        }
      } while (a < 0 || (borrow && (n1 % 10) >= (n2 % 10)) || (!borrow && (n1 % 10) < (n2 % 10)))
      q = `${n1} - ${n2} =`
      break
    case 'mul':
      n1 = Math.floor(Math.random() * Math.pow(10, digits))
      n2 = Math.floor(Math.random() * 10) // 掛け算は1桁の数をかける
      q = `${n1} × ${n2} =`
      a = n1 * n2
      break
    case 'div':
      do {
        n1 = Math.floor(Math.random() * Math.pow(10, digits))
        n2 = Math.floor(Math.random() * 9) + 1 // 0除算を避ける
        a = n1 / n2
        attempts++
        if (attempts > maxAttempts) {
          console.warn('Division: Max attempts reached, could not generate question with specified criteria.')
          return { q: '0 ÷ 1 =', a: 0, calcType: type, maxDigits: digits, carryUp: carry, borrowDown: borrow }
        }
      } while (n1 % n2 !== 0)
      q = `${n1} ÷ ${n2} =`
      break
    default:
      q = ''; a = 0
  }
  console.log(`Generated: ${q} Answer: ${a} Attempts: ${attempts}`)
  return { q, a, calcType: type, maxDigits: digits, carryUp: carry, borrowDown: borrow }
}
