import { render, screen } from '@testing-library/react';
import App from '../src/components/App';

describe('App', () => {
  it('renders without crashing', () => {
    render(<App />);
    expect(screen.getByText(/Поиск/i)).toBeInTheDocument();
  });
});
