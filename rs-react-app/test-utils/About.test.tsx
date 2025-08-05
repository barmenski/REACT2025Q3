// test-utils/About.test.tsx
import { render, screen, cleanup } from '@testing-library/react';
import { MemoryRouter } from 'react-router';
import About from '../src/components/About/About';
import { describe, it, expect, afterEach } from 'vitest';

describe('About component', () => {
  afterEach(cleanup);

  it('renders author link with correct attributes', () => {
    render(
      <MemoryRouter>
        <About />
      </MemoryRouter>
    );

    const authorLink = screen.getByText(/Author: Alexandr Bondar/i);
    expect(authorLink).toBeInTheDocument();
    expect(authorLink).toHaveAttribute('href', 'https://github.com/barmenski');
    expect(authorLink).toHaveAttribute('target', '_blank');
    expect(authorLink).toHaveAttribute('rel', 'noopener noreferrer');
  });

  it('renders RS School link with correct attributes', () => {
    render(
      <MemoryRouter>
        <About />
      </MemoryRouter>
    );

    const rsLink = screen.getByText(/RS School\. React\./i);
    expect(rsLink).toBeInTheDocument();
    expect(rsLink).toHaveAttribute(
      'href',
      'https://github.com/rolling-scopes-school/tasks/blob/master/react'
    );
    expect(rsLink).toHaveAttribute('target', '_blank');
    expect(rsLink).toHaveAttribute('rel', 'noopener noreferrer');
  });
});
