import { render, screen, cleanup } from '@testing-library/react';
import { MemoryRouter } from 'react-router';
import NotFound from '../src/components/NotFound/NotFound';
import { describe, it, expect, afterEach } from 'vitest';

describe('NotFound component', () => {
  afterEach(cleanup);

  it('renders "404 Not Found" message', () => {
    render(
      <MemoryRouter>
        <NotFound />
      </MemoryRouter>
    );

    const text = screen.getByText(/Not Found/i);
    expect(text).toBeInTheDocument();
  });
});
