import { ReactElement } from 'react';
import { render, RenderOptions } from '@testing-library/react';
import { ChakraProvider } from '@chakra-ui/react';
import { BrowserRouter } from 'react-router-dom';
import { vi } from 'vitest';

// Custom render function that wraps components with necessary providers
function customRender(
  ui: ReactElement,
  options?: Omit<RenderOptions, 'wrapper'>,
) {
  function Wrapper({ children }: { children: React.ReactNode }) {
    return (
      <ChakraProvider>
        <BrowserRouter>{children}</BrowserRouter>
      </ChakraProvider>
    );
  }

  return render(ui, { wrapper: Wrapper, ...options });
}

// Mock factory for creating test data
export const createMockSubject = (overrides = {}) => ({
  id: 1,
  name: 'Test Subject',
  color: '#FF6B6B',
  icon: '📚',
  createdAt: new Date().toISOString(),
  ...overrides,
});

export const createMockRevision = (overrides = {}) => ({
  id: 1,
  subjectId: 1,
  content: 'Test revision content',
  nextReview: new Date().toISOString(),
  interval: 1,
  easeFactor: 2.5,
  repetitions: 0,
  ...overrides,
});

export const createMockPomodoroSession = (overrides = {}) => ({
  id: 1,
  subjectId: 1,
  startTime: new Date().toISOString(),
  endTime: new Date().toISOString(),
  duration: 1500, // 25 minutes
  completed: true,
  ...overrides,
});

// Mock database functions
export const createMockDatabase = () => ({
  getSubjects: vi.fn().mockResolvedValue([createMockSubject()]),
  getSubjectById: vi.fn().mockResolvedValue(createMockSubject()),
  addSubject: vi.fn().mockResolvedValue(1),
  updateSubject: vi.fn().mockResolvedValue(undefined),
  deleteSubject: vi.fn().mockResolvedValue(undefined),
  getRevisionsDueToday: vi.fn().mockResolvedValue([createMockRevision()]),
  updateRevision: vi.fn().mockResolvedValue(undefined),
});

// Re-export everything from React Testing Library
export * from '@testing-library/react';

// Override render with custom render
export { customRender as render };
