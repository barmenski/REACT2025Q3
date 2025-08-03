import { StrictMode } from 'react';
import { createRoot } from 'react-dom/client';
import { BrowserRouter, Routes, Route } from 'react-router';
import './index.css';
import App from './components/App.tsx';
import ErrorBoundary from './components/ErrorBoundary/ErrorBoundary.tsx';
import About from './components/About/About.tsx';
import NotFound from './components/NotFound/NotFound.tsx';
import { store } from './state/store.ts';
import { Provider } from 'react-redux';

createRoot(
  document.querySelector('#root') || document.createElement('div')
).render(
  <StrictMode>
    <Provider store={store}>
      <BrowserRouter>
        <ErrorBoundary>
          <Routes>
            <Route path="/" element={<App />}>
              <Route index element={null} />
            </Route>

            <Route path="/about" element={<About />} />
            <Route path="*" element={<NotFound />} />
          </Routes>
        </ErrorBoundary>
      </BrowserRouter>
    </Provider>
  </StrictMode>
);
