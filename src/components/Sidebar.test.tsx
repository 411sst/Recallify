import { describe, it, expect, vi, beforeEach } from 'vitest';
import { screen, waitFor } from '@testing-library/react';
import userEvent from '@testing-library/user-event';
import { render } from '../test/test-utils';
import Sidebar from './Sidebar';

// Mock the database service
vi.mock('../services/database', () => ({
  getRevisionsDueToday: vi.fn(),
}));

import { getRevisionsDueToday } from '../services/database';

describe('Sidebar Component', () => {
  beforeEach(() => {
    vi.clearAllMocks();
    localStorage.clear();
  });

  it('should render all menu items', () => {
    // Arrange
    (getRevisionsDueToday as any).mockResolvedValue([]);

    // Act
    render(<Sidebar />);

    // Assert
    expect(screen.getByText('Subjects')).toBeInTheDocument();
    expect(screen.getByText('Pomodoro')).toBeInTheDocument();
    expect(screen.getByText('Streaks')).toBeInTheDocument();
    expect(screen.getByText('Analytics')).toBeInTheDocument();
    expect(screen.getByText('Settings')).toBeInTheDocument();
  });

  it('should display due count when revisions are due', async () => {
    // Arrange
    const mockRevisions = [
      { id: 1, content: 'Test 1', due_date: '2024-01-01' },
      { id: 2, content: 'Test 2', due_date: '2024-01-01' },
      { id: 3, content: 'Test 3', due_date: '2024-01-01' },
    ];
    (getRevisionsDueToday as any).mockResolvedValue(mockRevisions);

    // Act
    render(<Sidebar />);

    // Assert
    await waitFor(() => {
      expect(screen.getByText(/3 revision/)).toBeInTheDocument();
    }, { timeout: 3000 });
  });

  it('should not display due count when no revisions are due', async () => {
    // Arrange
    (getRevisionsDueToday as any).mockResolvedValue([]);

    // Act
    render(<Sidebar />);

    // Assert - wait a moment then check
    await new Promise(resolve => setTimeout(resolve, 100));
    expect(screen.queryByText(/revision/)).not.toBeInTheDocument();
  });

  it('should toggle collapsed state when button is clicked', async () => {
    // Arrange
    (getRevisionsDueToday as any).mockResolvedValue([]);
    const user = userEvent.setup();

    // Act
    render(<Sidebar />);
    const toggleButton = screen.getByLabelText('Collapse sidebar');
    await user.click(toggleButton);

    // Assert
    expect(screen.getByLabelText('Expand sidebar')).toBeInTheDocument();
  });

  it('should persist collapsed state to localStorage', async () => {
    // Arrange
    (getRevisionsDueToday as any).mockResolvedValue([]);
    const user = userEvent.setup();

    // Act
    render(<Sidebar />);
    const toggleButton = screen.getByLabelText('Collapse sidebar');
    await user.click(toggleButton);

    // Assert
    expect(localStorage.setItem).toHaveBeenCalledWith('sidebarCollapsed', 'true');
  });

  it('should load collapsed state from localStorage', () => {
    // Arrange
    (getRevisionsDueToday as any).mockResolvedValue([]);
    (localStorage.getItem as any).mockReturnValue('true');

    // Act
    render(<Sidebar />);

    // Assert
    expect(screen.getByLabelText('Expand sidebar')).toBeInTheDocument();
  });
});
