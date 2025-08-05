import { render, screen } from '@testing-library/react';
import Header from '../src/components/Header/Header';

describe('Header', () => {
  it('renders the logo image with correct alt text', () => {
    render(<Header />);
    const img = screen.getByRole('img', { name: /logo/i });

    expect(img).toBeInTheDocument();
    expect(img).toHaveClass('logo');
    expect(img).toHaveAttribute('alt', 'Logo');
    expect(img).toHaveAttribute('src');
  });
});
