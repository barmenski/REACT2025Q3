import { render, screen } from '@testing-library/react';
import { describe, it, vi, expect } from 'vitest';
import ErrorBoundary from '../src/components/ErrorBoundary/ErrorBoundary';

describe('ErrorBoundary', () => {
  it('displays fallback UI when error occurs', () => {
    const ProblemChild = () => {
      throw new Error('Test error');
    };

    render(
      <ErrorBoundary>
        <ProblemChild />
      </ErrorBoundary>
    );

    expect(screen.getByText(/test error/i)).toBeInTheDocument();
  });

  it('logs error to console with correct arguments', () => {
    const consoleErrorSpy = vi
      .spyOn(console, 'error')
      .mockImplementation(() => {});

    const ProblemChild = () => {
      throw new Error('Another test error');
    };

    render(
      <ErrorBoundary>
        <ProblemChild />
      </ErrorBoundary>
    );

    expect(consoleErrorSpy).toHaveBeenCalled();

    expect(consoleErrorSpy).toHaveBeenCalledWith(
      'Ошибка в ErrorBoundary:',
      expect.any(Error),
      expect.any(Object)
    );

    const callArgs = consoleErrorSpy.mock.calls[0];
    const errorObj = callArgs[1];
    expect(errorObj).toBeInstanceOf(Error);
    expect(errorObj.message).toBe('Another test error');

    consoleErrorSpy.mockRestore();
  });
});
