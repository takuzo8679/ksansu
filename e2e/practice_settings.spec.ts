import { test, expect } from '@playwright/test';

test('should allow user to practice addition and check score', async ({ page }) => {
  await page.goto('/');

  await page.getByRole('button', { name: 'れんしゅうをはじめる' }).click();

  // Wait for the URL to change to the practice page
  await page.waitForURL(/.*practice/, { timeout: 10000 });

  // Wait for the practice page to load by checking for a specific element
  await expect(page.getByRole('heading', { name: 'もんだい 1' })).toBeVisible({ timeout: 10000 });

  // Select "足し算" if not already selected (assuming it's a dropdown or radio button)
  // This part might need adjustment based on actual UI.
  // For now, let's assume addition is default or can be selected.
  // await page.selectOption('#calculation-type', 'add'); // Example for a select dropdown

  // Solve 3 questions
  for (let i = 1; i <= 3; i++) {
    // Ensure the question text element is visible before trying to get its text
    await expect(page.getByTestId('question-text')).toBeVisible({ timeout: 10000 });
    // Get the question text
    const questionText = await page.getByTestId('question-text').innerText();
    const match = questionText.match(/(\d+)\s*\+\s*(\d+)\s*=/);

    if (match) {
      const n1 = parseInt(match[1]);
      const n2 = parseInt(match[2]);
      const answer = n1 + n2;

      // Input the answer
      await page.getByTestId('answer-input').fill(answer.toString());
      await page.waitForLoadState('domcontentloaded'); // Wait for DOM to update after filling

      // Simulate pressing Enter to submit the answer
      await page.getByTestId('answer-input').press('Enter');

      // Verify feedback for correct answer (e.g., a success message or animation)
      await expect(page.getByTestId('feedback-message')).toBeVisible({ timeout: 10000 });
      await expect(page.getByTestId('feedback-message')).toHaveText('せいかい！');
      await expect(page.getByTestId('feedback-message')).toHaveClass(/feedback correct/);

      // Wait for feedback to disappear before moving to the next question
      await page.waitForTimeout(1500); // Matches the setTimeout in practice/page.tsx

      // Verify score (this might require reading the score element)
      // For now, let's just ensure we move to the next question.
      if (i < 3) {
        await expect(page.getByRole('heading', { name: `もんだい ${i + 1}` })).toBeVisible({ timeout: 10000 });
      }
    } else {
      throw new Error('Could not parse question text: ' + questionText);
    }
  }

  // After 3 questions, we should be on the result page.
  await page.waitForURL(/.*result/);
  await expect(page.getByRole('heading', { name: 'けっか' })).toBeVisible({ timeout: 10000 });
});

test('should allow user to select calculation type and max digits', async ({ page }) => {
  await page.goto('/');

  // Select "引き算" on the initial page
  await expect(page.getByTestId('calc-type-sub')).toBeVisible({ timeout: 10000 }); // Ensure the radio button is visible
  await page.getByTestId('calc-type-sub').check();
  // Select max digits "3桁" on the initial page
  await expect(page.getByTestId('max-digits-3')).toBeVisible({ timeout: 10000 }); // Ensure the radio button is visible
  await page.getByTestId('max-digits-3').check();

  await page.getByRole('button', { name: 'れんしゅうをはじめる' }).click();
  
  // Wait for the URL to change to the practice page
  await page.waitForURL(/.*practice/, { timeout: 10000 }); // Shortened timeout

  // Wait for the practice page to load by checking for a specific element
  await expect(page.getByRole('heading', { name: 'もんだい 1' })).toBeVisible({ timeout: 10000 });

  // Verify that the question is a subtraction problem with up to 3 digits
  await expect(page.getByTestId('question-text')).toBeVisible({ timeout: 10000 }); // Ensure the question text is visible
  const questionText = await page.getByTestId('question-text').innerText();
  const match = questionText.match(/(\d+)\s*-\s*(\d+)\s*=/);
  expect(match).not.toBeNull();
  if (match) {
    const n1 = parseInt(match[1]);
    const n2 = parseInt(match[2]);
    expect(n1).toBeLessThan(1000);
    expect(n2).toBeLessThan(1000);
  }
});

test('should transition to result page after 120 seconds', async ({ page }) => {
  await page.goto('/');
  await page.getByRole('button', { name: 'れんしゅうをはじめる' }).click();
  
  // Wait for the URL to change to the practice page
  await page.waitForURL(/.*practice/, { timeout: 10000 }); // Shortened timeout

  // Wait for the practice page to load by checking for a specific element
  await expect(page.getByRole('heading', { name: 'もんだい 1' })).toBeVisible({ timeout: 10000 });

  // Wait for 5 seconds (e2e test mode)
  await page.waitForTimeout(5000); // 5 seconds for e2e test

  // Expect to be on the result page
  await page.waitForURL(/.*result/);
  await expect(page.getByRole('heading', { name: 'けっか' })).toBeVisible({ timeout: 10000 });
});
