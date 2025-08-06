import { render, fireEvent, screen } from '@testing-library/react';
import ErrorButton from '../src/components/ErrorButton/ErrorButton';
import ErrorBoundary from '../src/components/ErrorBoundary/ErrorBoundary';
import { vi } from 'vitest';

describe('ErrorButton', () => {
  const originalConsoleError = console.error;

  beforeEach(() => {
    console.error = vi.fn();
  });

  afterEach(() => {
    console.error = originalConsoleError;
  });

  it('triggers ErrorBoundary fallback UI when error is thrown', () => {
    render(
      <ErrorBoundary>
        <ErrorButton />
      </ErrorBoundary>
    );

    const button = screen.getByRole('button', { name: /error button/i });
    fireEvent.click(button);

    expect(screen.getByText(/test error from button/i)).toBeInTheDocument();
  });
});
