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
          attempts++;
          if (attempts > maxAttempts) {
            console.warn('Subtraction: Max attempts reached, could not generate question with specified criteria.');
            return { q: '0 - 0 =', a: 0, calcType: type, maxDigits: digits, carryUp: carry, borrowDown: borrow };
          }

          let temp_n1, temp_n2;

          if (borrow) {
            // For borrow, we need n1_unit < n2_unit
            // Generate n2_unit first (1-9)
            let n2_unit = Math.floor(Math.random() * 9) + 1;
            // Generate n1_unit (0 to n2_unit - 1)
            let n1_unit = Math.floor(Math.random() * n2_unit);

            // Generate the rest of the digits for n1 and n2
            let max_val_prefix = Math.pow(10, digits - 1);
            let min_val_prefix = (digits > 1) ? Math.pow(10, digits - 2) : 0;

            temp_n1 = Math.floor(Math.random() * (max_val_prefix - min_val_prefix + 1)) + min_val_prefix;
            temp_n2 = Math.floor(Math.random() * (max_val_prefix - min_val_prefix + 1)) + min_val_prefix;

            n1 = temp_n1 * 10 + n1_unit;
            n2 = temp_n2 * 10 + n2_unit;

            // Ensure n1 >= n2 after constructing with unit digits
            if (n1 < n2) {
                [n1, n2] = [n2, n1];
            }

          } else {
            // For no borrow, we need n1_unit >= n2_unit
            // Generate n1_unit first (0-9)
            let n1_unit = Math.floor(Math.random() * 10);
            // Generate n2_unit (0 to n1_unit)
            let n2_unit = Math.floor(Math.random() * (n1_unit + 1));

            // Generate the rest of the digits for n1 and n2
            let max_val_prefix = Math.pow(10, digits - 1);
            let min_val_prefix = (digits > 1) ? Math.pow(10, digits - 2) : 0;

            temp_n1 = Math.floor(Math.random() * (max_val_prefix - min_val_prefix + 1)) + min_val_prefix;
            temp_n2 = Math.floor(Math.random() * (max_val_prefix - min_val_prefix + 1)) + min_val_prefix;

            n1 = temp_n1 * 10 + n1_unit;
            n2 = temp_n2 * 10 + n2_unit;

            // Ensure n1 >= n2 after constructing with unit digits
            if (n1 < n2) {
                [n1, n2] = [n2, n1];
            }
          }

          a = n1 - n2;
        } while (a < 0 || (borrow && (n1 % 10) >= (n2 % 10)) || (!borrow && (n1 % 10) < (n2 % 10)));
        q = `${n1} - ${n2} =`;
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
  
  return { q, a, calcType: type, maxDigits: digits, carryUp: carry, borrowDown: borrow }
}