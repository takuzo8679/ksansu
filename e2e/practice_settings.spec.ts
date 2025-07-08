import { test, expect } from '@playwright/test';

// Constants for selectors and text
const START_PRACTICE_BUTTON = 'れんしゅうをはじめる';
const PRACTICE_PAGE_HEADING = 'もんだい 1';
const RESULT_PAGE_HEADING = 'けっか';
const ANSWER_BUTTON = 'こたえる';
const FEEDBACK_CORRECT_SELECTOR = '.feedback.correct';
const FEEDBACK_MESSAGE_TEST_ID = 'feedback-message';
const QUESTION_TEXT_TEST_ID = 'question-text';
const ANSWER_INPUT_TEST_ID = 'answer-input';

// Common setup for all tests
test.beforeEach(async ({ page }) => {
  await page.goto('/');
  await page.getByRole('button', { name: START_PRACTICE_BUTTON }).click();
  await page.waitForURL(/.*practice/, { timeout: 10000 });
  await expect(page.getByRole('heading', { name: PRACTICE_PAGE_HEADING })).toBeVisible({ timeout: 10000 });
});

test('should allow user to practice addition and check score', async ({ page }) => {
  // Solve 3 questions
  for (let i = 1; i <= 3; i++) {
    await expect(page.getByTestId(QUESTION_TEXT_TEST_ID)).toBeVisible({ timeout: 10000 });
    const questionText = await page.getByTestId(QUESTION_TEXT_TEST_ID).innerText();
    const match = questionText.match(/(\d+)\s*\+\s*(\d+)\s*=/);

    if (match) {
      const n1 = parseInt(match[1]);
      const n2 = parseInt(match[2]);
      const answer = n1 + n2;

      await page.getByTestId(ANSWER_INPUT_TEST_ID).fill(answer.toString());
      await page.waitForLoadState('domcontentloaded');

      await page.getByTestId(ANSWER_INPUT_TEST_ID).press('Enter');

      await expect(page.getByTestId(FEEDBACK_MESSAGE_TEST_ID)).toBeVisible({ timeout: 10000 });
      await expect(page.getByTestId(FEEDBACK_MESSAGE_TEST_ID)).toHaveText('せいかい！');
      await expect(page.getByTestId(FEEDBACK_MESSAGE_TEST_ID)).toHaveClass(/feedback correct/);

      await page.waitForTimeout(1500);

      if (i < 3) {
        await expect(page.getByRole('heading', { name: `もんだい ${i + 1}` })).toBeVisible({ timeout: 10000 });
      }
    } else {
      throw new Error('Could not parse question text: ' + questionText);
    }
  }

  await page.waitForURL(/.*result/);
  await expect(page.getByRole('heading', { name: RESULT_PAGE_HEADING })).toBeVisible({ timeout: 10000 });
});

test('should allow user to select subtraction and 3 digits', async ({ page }) => {
  // Navigate back to the home page to select options
  await page.goto('/');

  await expect(page.getByTestId('calc-type-sub')).toBeVisible({ timeout: 10000 });
  await page.getByTestId('calc-type-sub').check();

  await expect(page.getByTestId('max-digits-3')).toBeVisible({ timeout: 10000 });
  await page.getByTestId('max-digits-3').check();

  await page.getByRole('button', { name: START_PRACTICE_BUTTON }).click();
  
  await page.waitForURL(/.*practice/, { timeout: 10000 });
  await expect(page.getByRole('heading', { name: PRACTICE_PAGE_HEADING })).toBeVisible({ timeout: 10000 });

  await expect(page.getByTestId(QUESTION_TEXT_TEST_ID)).toBeVisible({ timeout: 10000 });
  const questionText = await page.getByTestId(QUESTION_TEXT_TEST_ID).innerText();
  const match = questionText.match(/(\d+)\s*-\s*(\d+)\s*=/);
  expect(match).not.toBeNull();
  if (match) {
    const n1 = parseInt(match[1]);
    const n2 = parseInt(match[2]);
    expect(n1).toBeLessThan(1000);
    expect(n2).toBeLessThan(1000);
  }
});

test('should transition to result page after timer expires', async ({ page }) => {
  // No need to navigate or click start button here, as it's handled by beforeEach
  // The timer starts on the practice page

  await page.waitForTimeout(5000);

  await page.waitForURL(/.*result/);
  await expect(page.getByRole('heading', { name: RESULT_PAGE_HEADING })).toBeVisible({ timeout: 10000 });
});