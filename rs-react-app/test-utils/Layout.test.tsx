import { describe, it, expect, vi } from 'vitest';
import { render, screen } from '@testing-library/react';
import { MemoryRouter, Route, Routes } from 'react-router';
import Layout from '../src/components/Layout/Layout';

vi.mock('../src/components/Header/Header', () => ({
  default: () => <div data-testid="mock-header">MockHeader</div>,
}));

describe('Layout component', () => {
  it('renders Header and navigation links', () => {
    render(
      <MemoryRouter initialEntries={['/']}>
        <Routes>
          <Route path="/" element={<Layout />}>
            <Route index element={<div>Home Content</div>} />
            <Route path="about" element={<div>About Content</div>} />
          </Route>
        </Routes>
      </MemoryRouter>
    );

    // Проверка наличия header
    expect(screen.getByTestId('mock-header')).toBeInTheDocument();

    // Проверка ссылок
    expect(screen.getByRole('link', { name: /home/i })).toBeInTheDocument();
    expect(screen.getByRole('link', { name: /about/i })).toBeInTheDocument();

    // Проверка, что рендерится Outlet-содержимое (Home)
    expect(screen.getByText(/home content/i)).toBeInTheDocument();
  });

  it('adds "active" class to the current NavLink', () => {
    render(
      <MemoryRouter initialEntries={['/about']}>
        <Routes>
          <Route path="/" element={<Layout />}>
            <Route path="about" element={<div>About Content</div>} />
          </Route>
        </Routes>
      </MemoryRouter>
    );

    const aboutLink = screen.getByRole('link', { name: /about/i });
    const homeLink = screen.getByRole('link', { name: /home/i });

    expect(aboutLink).toHaveClass('nav-link');
    expect(aboutLink).toHaveClass('active');
    expect(homeLink).toHaveClass('nav-link');
    expect(homeLink).not.toHaveClass('active');

    expect(screen.getByText(/about content/i)).toBeInTheDocument();
  });
});
