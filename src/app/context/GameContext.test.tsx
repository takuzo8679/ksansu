import { render, screen } from '@testing-library/react'
import userEvent from '@testing-library/user-event'
import { useGame, GameProvider } from './GameContext'
import { act } from '@testing-library/react'
import { useEffect } from 'react'

describe('GameContext', () => {
  // Helper component to access context values
  const TestComponent = ({ initialQuestion }: any) => {
    const { state, dispatch } = useGame();

    // Effect to set initial question if provided
    useEffect(() => {
      if (initialQuestion) {
        dispatch({ type: 'SET_CURRENT_QUESTION', payload: { question: initialQuestion } });
      }
    }, [initialQuestion, dispatch]);

    return (
      <div>
        <div data-testid="score">{state.score}</div>
        <div data-testid="correct-answers-count">{state.correctAnswersCount}</div>
        <div data-testid="current-user">{state.currentUser?.name}</div>
        <div data-testid="users-count">{state.users.length}</div>
        {state.currentQuestion && (
          <div data-testid="question">{state.currentQuestion.q}</div>
        )}
        <button onClick={() => dispatch({ type: 'RESET' })}>Reset</button>
        <button
          onClick={() => dispatch({ type: 'ANSWER', payload: { answer: 5 } })}
        >
          Answer 5
        </button>
        <button
          onClick={() => dispatch({ type: 'ANSWER', payload: { answer: 1 } })}
        >
          Answer 1
        </button>
        <button onClick={() => dispatch({ type: 'ADD_USER', payload: { name: 'Test User' } })}>
          Add User
        </button>
        <button onClick={() => dispatch({ type: 'SWITCH_USER', payload: { userId: 'user-2' } })}>
          Switch User
        </button>
      </div>
    );
  };

  // Helper to render the component wrapped in GameProvider
  const renderWithGameProvider = (initialQuestion?: any) => {
    return render(
      <GameProvider>
        <TestComponent initialQuestion={initialQuestion} />
      </GameProvider>
    );
  };

  beforeEach(() => {
    // Reset localStorage before each test
    localStorage.clear();
  });

  it('should initialize with a score of 0 and no current question', () => {
    renderWithGameProvider();
    expect(screen.getByTestId('score').textContent).toBe('0');
    expect(screen.getByTestId('correct-answers-count').textContent).toBe('0');
    expect(screen.queryByTestId('question')).toBeNull();
  });

  it('should set current question and update score on correct answer', async () => {
    const initialQuestion = { q: '1 + 0 =', a: 1, calcType: 'add', maxDigits: 1, carryUp: false, borrowDown: false };
    renderWithGameProvider(initialQuestion);

    expect(screen.getByTestId('question').textContent).toBe('1 + 0 =');

    await act(async () => {
      await userEvent.click(screen.getByText('Answer 1')); // Correct answer
    });

    // Score should be updated
    expect(screen.getByTestId('score').textContent).toBe('2'); // 1 (base) + 1 (digit)
    expect(screen.getByTestId('correct-answers-count').textContent).toBe('1');
    // Question should change
    expect(screen.getByTestId('question').textContent).not.toBe('1 + 0 =');
  });

  it('should not change question on incorrect answer', async () => {
    const initialQuestion = { q: '1 + 0 =', a: 1, calcType: 'add', maxDigits: 1, carryUp: false, borrowDown: false };
    renderWithGameProvider(initialQuestion);

    expect(screen.getByTestId('question').textContent).toBe('1 + 0 =');

    await act(async () => {
      await userEvent.click(screen.getByText('Answer 5')); // Incorrect answer
    });

    // Score should not be updated
    expect(screen.getByTestId('score').textContent).toBe('0');
    expect(screen.getByTestId('correct-answers-count').textContent).toBe('0');
    // Question should remain the same
    expect(screen.getByTestId('question').textContent).toBe('1 + 0 =');
  });

  describe('score calculation', () => {
    // Test cases for score calculation based on spec.md
    const scoreTestCases = [
      // Add/Sub: 1 point + digits + carry/borrow
      { type: 'add', digits: 1, carry: false, borrow: false, expectedScore: 1 + 1, description: '1-digit add, no carry' }, // 1 (base) + 1 (digit)
      { type: 'add', digits: 1, carry: true, borrow: false, expectedScore: 1 + 1 + 1, description: '1-digit add, with carry' }, // 1 (base) + 1 (digit) + 1 (carry)
      { type: 'sub', digits: 2, carry: false, borrow: false, expectedScore: 1 + 2, description: '2-digit sub, no borrow' }, // 1 (base) + 2 (digit)
      { type: 'sub', digits: 2, carry: false, borrow: true, expectedScore: 1 + 2 + 1, description: '2-digit sub, with borrow' }, // 1 (base) + 2 (digit) + 1 (borrow)
      // Mul/Div: 2 points + digits
      { type: 'mul', digits: 1, carry: false, borrow: false, expectedScore: 2 + 1, description: '1-digit mul' }, // 2 (base) + 1 (digit)
      { type: 'div', digits: 3, carry: false, borrow: false, expectedScore: 2 + 3, description: '3-digit div' }, // 2 (base) + 3 (digit)
    ];

    test.each(scoreTestCases)(
      'should calculate score correctly for %s', 
      async ({ type, digits, carry, borrow, expectedScore, description }) => {
        const initialQuestion = { q: 'dummy', a: 1, calcType: type, maxDigits: digits, carryUp: carry, borrowDown: borrow };
        renderWithGameProvider(initialQuestion);

        // Simulate a correct answer
        await act(async () => {
          await userEvent.click(screen.getByText('Answer 1')); // Assuming the correct answer is 1 for dummy question
        });

        expect(screen.getByTestId('score').textContent).toBe(expectedScore.toString());
        expect(screen.getByTestId('correct-answers-count').textContent).toBe('1');
      }
    );

    it('should not update score for wrong answers', async () => {
      const initialQuestion = { q: 'dummy', a: 5, calcType: 'add', maxDigits: 1, carryUp: false, borrowDown: false };
      renderWithGameProvider(initialQuestion);

      await act(async () => {
        await userEvent.click(screen.getByText('Answer 1')); // Wrong answer
      });

      expect(screen.getByTestId('score').textContent).toBe('0');
      expect(screen.getByTestId('correct-answers-count').textContent).toBe('0');
    });
  });

  it('should reset game state but keep user state', async () => {
    const initialQuestion = { q: '5 + 0 =', a: 5, calcType: 'add', maxDigits: 1, carryUp: false, borrowDown: false };
    renderWithGameProvider(initialQuestion);

    await act(async () => {
      await userEvent.click(screen.getByText('Add User'));
    });

    expect(screen.getByTestId('current-user').textContent).toBe('Test User');
    expect(screen.getByTestId('users-count').textContent).toBe('1');

    await act(async () => {
      await userEvent.click(screen.getByText('Answer 5'));
    });

    // Score should be updated to 1 (base) + 1 (digit) = 2
    expect(screen.getByTestId('score').textContent).toBe('2'); 
    expect(screen.getByTestId('correct-answers-count').textContent).toBe('1');

    await act(async () => {
      await userEvent.click(screen.getByText('Reset'));
    });

    expect(screen.getByTestId('score').textContent).toBe('0');
    expect(screen.getByTestId('correct-answers-count').textContent).toBe('0');
    expect(screen.queryByTestId('question')).toBeNull();
    // User state should be preserved
    expect(screen.getByTestId('current-user').textContent).toBe('Test User');
    expect(screen.getByTestId('users-count').textContent).toBe('1');
  });

  describe('user management', () => {
    it('should add a new user and set it as current user', async () => {
      renderWithGameProvider();
      expect(screen.getByTestId('users-count').textContent).toBe('0');
      expect(screen.getByTestId('current-user').textContent).toBe('');

      await act(async () => {
        await userEvent.click(screen.getByText('Add User'));
      });

      expect(screen.getByTestId('users-count').textContent).toBe('1');
      expect(screen.getByTestId('current-user').textContent).toBe('Test User');
    });

    
  });
});