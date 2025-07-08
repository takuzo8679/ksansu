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
const ANOTHER_TRY_BUTTON = 'もういっかい';
const USER_SELECT_TEST_ID = 'user-select';
const NEW_USER_INPUT_TEST_ID = 'new-user-input';
const ADD_USER_BUTTON_TEST_ID = 'add-user-button';
const START_BUTTON_TEST_ID = 'start-button';

// Common setup for all tests
test.beforeEach(async ({ page }) => {
  await page.goto('/');
});

test.describe('User Management', () => {
  test('should allow creating a new user and starting practice', async ({ page }) => {
    await page.getByTestId(NEW_USER_INPUT_TEST_ID).fill('Test User');
    await page.getByTestId(ADD_USER_BUTTON_TEST_ID).click();

    await expect(page.getByText('こんにちは、Test Userさん！')).toBeVisible();
    await expect(page.getByTestId(START_BUTTON_TEST_ID)).toBeEnabled();

    await page.getByTestId(START_BUTTON_TEST_ID).click();
    await page.waitForURL(/.*practice/);
    await expect(page.getByRole('heading', { name: PRACTICE_PAGE_HEADING })).toBeVisible();
  });

  test('should allow switching between users', async ({ page }) => {
    // Add two users
    await page.getByTestId(NEW_USER_INPUT_TEST_ID).fill('User One');
    await page.getByTestId(ADD_USER_BUTTON_TEST_ID).click();
    await page.getByTestId(NEW_USER_INPUT_TEST_ID).fill('User Two');
    await page.getByTestId(ADD_USER_BUTTON_TEST_ID).click();

    // Select the first user
    await page.getByTestId(USER_SELECT_TEST_ID).selectOption({ label: 'User One' });
    await expect(page.getByText('こんにちは、User Oneさん！')).toBeVisible();

    // Select the second user
    await page.getByTestId(USER_SELECT_TEST_ID).selectOption({ label: 'User Two' });
    await expect(page.getByText('こんにちは、User Twoさん！')).toBeVisible();
  });

  test('should disable start button if no user is selected', async ({ page }) => {
    await expect(page.getByTestId(START_BUTTON_TEST_ID)).toBeDisabled();
  });
});

test.describe('Practice Flow', () => {
  test.beforeEach(async ({ page }) => {
    // Create a user before each test in this block
    await page.getByTestId(NEW_USER_INPUT_TEST_ID).fill('Test User');
    await page.getByTestId(ADD_USER_BUTTON_TEST_ID).click();
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
    // The timer starts on the practice page
    await page.waitForTimeout(5000);

    await page.waitForURL(/.*result/);
    await page.waitForLoadState('domcontentloaded');
    await expect(page.getByRole('heading', { name: RESULT_PAGE_HEADING })).toBeVisible({ timeout: 10000 });
  });

  test('should preserve selected practice settings after returning from result page', async ({ page }) => {
    // Navigate to home page
    await page.goto('/');

    // Select non-default options
    await expect(page.getByTestId('calc-type-sub')).toBeVisible({ timeout: 10000 });
    await page.getByTestId('calc-type-sub').check();

    await expect(page.getByTestId('max-digits-3')).toBeVisible({ timeout: 10000 });
    await page.getByTestId('max-digits-3').check();

    // Start practice
    await page.getByRole('button', { name: START_PRACTICE_BUTTON }).click();
    await page.waitForURL(/.*practice/, { timeout: 10000 });
    await expect(page.getByRole('heading', { name: PRACTICE_PAGE_HEADING })).toBeVisible({ timeout: 10000 });

    // Simulate completing practice by waiting for timer to expire
    await page.waitForTimeout(5000); // Use the shortened e2e timer
    await page.waitForURL(/.*result/);
    await page.waitForLoadState('domcontentloaded');
    await expect(page.getByRole('heading', { name: RESULT_PAGE_HEADING })).toBeVisible({ timeout: 10000 });

    // Return to home page
    await page.waitForLoadState('networkidle');
    await page.getByText(ANOTHER_TRY_BUTTON).click();
    await page.waitForURL('/', { timeout: 10000 });

    // Assert that previously selected options are still checked
    await expect(page.getByTestId('calc-type-sub')).toBeChecked();
    await expect(page.getByTestId('max-digits-3')).toBeChecked();
  });
});
