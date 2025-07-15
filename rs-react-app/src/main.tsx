import { StrictMode } from 'react';
import { createRoot } from 'react-dom/client';
import './index.css';
import App from './components/App.tsx';
import ErrorBoundary from './components/ErrorBoundary/ErrorBoundary.tsx';

createRoot(
  document.querySelector('#root') || document.createElement('div')
).render(
  <StrictMode>
    <ErrorBoundary>
      <App />
    </ErrorBoundary>
  </StrictMode>
);
