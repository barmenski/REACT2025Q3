import '@testing-library/jest-dom/vitest';
import { afterEach } from 'vitest';
import { cleanup } from '@testing-library/react';
import '@testing-library/jest-dom';
import { vi } from 'vitest';

afterEach(() => {
  cleanup();
});

Object.defineProperty(global.URL, 'createObjectURL', {
  writable: true,
  value: vi.fn(() => 'blob:mocked-url'),
});