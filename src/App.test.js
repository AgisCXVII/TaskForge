import { render, screen } from '@testing-library/react';
import App from './App';

test('renders CrossPost header', () => {
  render(<App />);
  const headerElement = screen.getByRole('heading', { name: 'CrossPost' });
  expect(headerElement).toBeInTheDocument();
});
