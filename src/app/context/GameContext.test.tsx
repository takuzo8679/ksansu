import { render, screen } from '@testing-library/react'
import userEvent from '@testing-library/user-event'
import { useGame, GameProvider } from './GameContext'
import { act } from '@testing-library/react'
import { useEffect } from 'react'

describe('GameContext', () => {
  // Helper component to access context values
  const TestComponent = ({ initialQuestions }: any) => {
    const { state, dispatch } = useGame();

    // Effect to set initial questions if provided
    useEffect(() => {
      if (initialQuestions) {
        dispatch({ type: 'SET_QUESTIONS', payload: { questions: initialQuestions } });
      }
    }, [initialQuestions, dispatch]);

    return (
      <div>
        <div data-testid="score">{state.score}</div>
        <div data-testid="correct-answers-count">{state.correctAnswersCount}</div>
        <div data-testid="current-question-index">{state.currentQuestionIndex}</div>
        {state.questions.length > 0 && state.currentQuestionIndex < state.questions.length && (
          <div data-testid="question">{state.questions[state.currentQuestionIndex].q}</div>
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
      </div>
    );
  };

  // Helper to render the component wrapped in GameProvider
  const renderWithGameProvider = (initialQuestions?: any) => {
    return render(
      <GameProvider>
        <TestComponent initialQuestions={initialQuestions} />
      </GameProvider>
    );
  };

  beforeEach(() => {
    // Reset the context before each test if necessary
    // For functional components, context state is usually reset by re-rendering
  });

  it('should initialize with a score of 0 and no questions', () => {
    renderWithGameProvider();
    expect(screen.getByTestId('score').textContent).toBe('0');
    expect(screen.getByTestId('correct-answers-count').textContent).toBe('0');
    expect(screen.getByTestId('current-question-index').textContent).toBe('0');
    expect(screen.queryByTestId('question')).toBeNull();
  });

  it('should set questions and update current question index', async () => {
    const questions = [
      { q: '1 + 1 =', a: 2, calcType: 'add', maxDigits: 1, carryUp: false, borrowDown: false },
      { q: '2 + 2 =', a: 4, calcType: 'add', maxDigits: 1, carryUp: false, borrowDown: false },
    ];
    renderWithGameProvider(questions);

    expect(screen.getByTestId('question').textContent).toBe('1 + 1 =');
    expect(screen.getByTestId('current-question-index').textContent).toBe('0');

    await act(async () => {
      await userEvent.click(screen.getByText('Answer 5')); // Changed from Answer 2 to Answer 5
    });

    // After answering, currentQuestionIndex should increment
    expect(screen.getByTestId('current-question-index').textContent).toBe('1');
    expect(screen.getByTestId('question').textContent).toBe('2 + 2 =');
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
        const questions = [
          { q: 'dummy', a: 1, calcType: type, maxDigits: digits, carryUp: carry, borrowDown: borrow },
        ];
        renderWithGameProvider(questions);

        // Simulate a correct answer
        await act(async () => {
          await userEvent.click(screen.getByText('Answer 1')); // Assuming the correct answer is 1 for dummy question
        });

        expect(screen.getByTestId('score').textContent).toBe(expectedScore.toString());
        expect(screen.getByTestId('correct-answers-count').textContent).toBe('1');
      }
    );

    it('should not update score for wrong answers', async () => {
      const questions = [
        { q: 'dummy', a: 5, calcType: 'add', maxDigits: 1, carryUp: false, borrowDown: false },
      ];
      renderWithGameProvider(questions);

      await act(async () => {
        await userEvent.click(screen.getByText('Answer 1')); // Wrong answer
      });

      expect(screen.getByTestId('score').textContent).toBe('0');
      expect(screen.getByTestId('correct-answers-count').textContent).toBe('0');
    });
  });

  it('should reset game state', async () => {
    const questions = [
      { q: '5 + 0 =', a: 5, calcType: 'add', maxDigits: 1, carryUp: false, borrowDown: false }, // Question where answer is 5
    ];
    renderWithGameProvider(questions);

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
    expect(screen.getByTestId('current-question-index').textContent).toBe('0');
    expect(screen.queryByTestId('question')).toBeNull();
  });
});