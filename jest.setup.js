require('@testing-library/jest-dom')

// Mock crypto.randomUUID for Jest environment
Object.defineProperty(global.crypto, 'randomUUID', {
  value: () => 'mock-uuid',
  writable: true,
});