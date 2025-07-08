import { render, screen } from '@testing-library/react'
import userEvent from '@testing-library/user-event'
import { useGame, GameProvider } from './GameContext'
import { act } from '@testing-library/react'

describe('GameContext', () => {
  const TestComponent = () => {
    const { state, dispatch } = useGame()

    const startGame = () => {
      const questions = [
        { q: '2 + 3 =', a: 5, calcType: 'add', maxDigits: 1, carryUp: false, borrowDown: false },
      ]
      dispatch({ type: 'SET_QUESTIONS', payload: { questions } })
    }

    return (
      <div>
        <div data-testid="score">{state.score}</div>
        {state.questions.length > 0 && (
          <div data-testid="question">{state.questions[0].q}</div>
        )}
        <button onClick={startGame}>Start</button>
        <button
          onClick={() => dispatch({ type: 'ANSWER', payload: { answer: 5 } })}
        >
          Correct Answer
        </button>
        <button
          onClick={() => dispatch({ type: 'ANSWER', payload: { answer: 1 } })}
        >
          Wrong Answer
        </button>
      </div>
    )
  }

  it('should handle correct answers and update score', async () => {
    render(
      <GameProvider>
        <TestComponent />
      </GameProvider>
    )

    await act(async () => {
      await userEvent.click(screen.getByText('Start'))
    })

    expect(screen.getByTestId('question').textContent).toBe('2 + 3 =')

    await act(async () => {
      await userEvent.click(screen.getByText('Correct Answer'))
    })

    expect(screen.getByTestId('score').textContent).toBe('2')
  })

  it('should not update score for wrong answers', async () => {
    render(
      <GameProvider>
        <TestComponent />
      </GameProvider>
    )

    await act(async () => {
      await userEvent.click(screen.getByText('Start'))
    })

    expect(screen.getByTestId('question').textContent).toBe('2 + 3 =')

    await act(async () => {
      await userEvent.click(screen.getByText('Wrong Answer'))
    })

    expect(screen.getByTestId('score').textContent).toBe('0')
  })
})
