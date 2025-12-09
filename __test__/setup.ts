import '@testing-library/jest-dom';
import { beforeEach, vi } from 'vitest';

Object.defineProperty(window, 'matchMedia', {
  writable: true,
  value: vi.fn().mockImplementation((query) => ({
    matches: false,
    media: query,
    onchange: null,
    addListener: vi.fn(),
    removeListener: vi.fn(),
    addEventListener: vi.fn(),
    removeEventListener: vi.fn(),
    dispatchEvent: vi.fn(),
  })),
});

// ResizeObserver mock
global.ResizeObserver = vi.fn().mockImplementation(() => ({
  observe: vi.fn(),
  unobserve: vi.fn(),
  disconnect: vi.fn(),
}));

// MutationObserver mock
global.MutationObserver = vi.fn().mockImplementation(() => ({
  observe: vi.fn(),
  disconnect: vi.fn(),
  takeRecords: vi.fn(),
}));

// SVG getBoundingClientRect mock
Object.defineProperty(SVGElement.prototype, 'getBoundingClientRect', {
  writable: true,
  value: vi.fn().mockReturnValue({
    x: 0,
    y: 0,
    width: 100,
    height: 50,
    top: 0,
    right: 100,
    bottom: 50,
    left: 0,
    toJSON: vi.fn(),
  }),
});

// HTMLElement getBoundingClientRect mock
Object.defineProperty(HTMLElement.prototype, 'getBoundingClientRect', {
  writable: true,
  value: vi.fn().mockReturnValue({
    x: 0,
    y: 0,
    width: 200,
    height: 30,
    top: 0,
    right: 200,
    bottom: 30,
    left: 0,
    toJSON: vi.fn(),
  }),
});

// querySelector mock for connector elements
Object.defineProperty(HTMLElement.prototype, 'querySelector', {
  writable: true,
  value: vi.fn().mockImplementation((selector: string) => {
    if (selector.includes('connector-')) {
      return {
        getBoundingClientRect: () => ({
          x: 0,
          y: 0,
          width: 10,
          height: 10,
          top: 0,
          right: 10,
          bottom: 10,
          left: 0,
        }),
      };
    }
    return null;
  }),
});

beforeEach(() => {
  vi.clearAllMocks();
});
