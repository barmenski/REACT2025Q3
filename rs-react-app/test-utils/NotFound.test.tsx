// test-utils/NotFound.test.tsx
import { render, screen, cleanup } from '@testing-library/react';
import { MemoryRouter } from 'react-router';
import NotFound from '../src/components/NotFound/NotFound';
import { describe, it, expect, afterEach } from 'vitest';

describe('NotFound component', () => {
  afterEach(cleanup);

  it('renders "404 Not found" message', () => {
    render(
      <MemoryRouter>
        <NotFound />
      </MemoryRouter>
    );

    const text = screen.getByText(/404 Not found/i);
    expect(text).toBeInTheDocument();
  });

  it('renders NavLink "Home"', () => {
    render(
      <MemoryRouter>
        <NotFound />
      </MemoryRouter>
    );

    const homeLink = screen.getByText('Home');
    expect(homeLink).toBeInTheDocument();
    expect(homeLink).toHaveAttribute('href', '/');
  });

  it('NavLink has active class when path is "/"', () => {
    render(
      <MemoryRouter initialEntries={['/']}>
        <NotFound />
      </MemoryRouter>
    );

    const homeLink = screen.getByText('Home');
    expect(homeLink).toHaveClass('active');
  });

  it('NavLink does not have active class when path is not "/"', () => {
    render(
      <MemoryRouter initialEntries={['/not-found']}>
        <NotFound />
      </MemoryRouter>
    );

    const homeLink = screen.getByText('Home');
    expect(homeLink).not.toHaveClass('active');
  });
});
