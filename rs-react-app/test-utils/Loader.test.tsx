// test-utils/Loader.test.tsx
import { render, screen, cleanup } from '@testing-library/react';
import Loader from '../src/components/Loader/Loader';
import { describe, it, expect, afterEach } from 'vitest';

describe('Loader component', () => {
  afterEach(cleanup);

  it('does not render when loading is false', () => {
    render(<Loader loading={false} />);
    const loader = screen.queryByText(/Загрузка/i);
    expect(loader).not.toBeInTheDocument();
  });

  it('does not render when loading prop is undefined', () => {
    render(<Loader />);
    const loader = screen.queryByText(/Загрузка/i);
    expect(loader).not.toBeInTheDocument();
  });

  it('renders when loading is true', () => {
    render(<Loader loading={true} />);
    const loader = screen.getByText(/Загрузка/i);
    expect(loader).toBeInTheDocument();
    expect(loader).toHaveClass('loader');
  });
});
