import { describe, it, expect, vi, beforeEach } from 'vitest';
import { getSubjects, createSubject } from './database';

// Mock the Tauri API
vi.mock('@tauri-apps/api/tauri', () => ({
  invoke: vi.fn(),
}));

import { invoke } from '@tauri-apps/api/tauri';

describe('Database Service', () => {
  beforeEach(() => {
    vi.clearAllMocks();

    // Mock Tauri API availability
    (window as any).__TAURI__ = {
      invoke: vi.fn(),
    };
  });

  describe('getSubjects', () => {
    it('should fetch subjects with stats', async () => {
      // Arrange: Setup mock data
      const mockSubjects = [
        { id: 1, name: 'Math', color: '#FF6B6B', icon: '📐', created_at: '2024-01-01' },
        { id: 2, name: 'Science', color: '#4ECDC4', icon: '🔬', created_at: '2024-01-02' },
      ];

      const mockEntryCount = [{ count: 5 }];
      const mockNextRevision = [{ due_date: '2024-12-25' }];

      // Mock the invoke function to return different values based on SQL
      (invoke as any).mockImplementation((cmd: string, args: any) => {
        if (args.sql.includes('SELECT * FROM subjects')) {
          return Promise.resolve(mockSubjects);
        }
        if (args.sql.includes('COUNT(*) as count')) {
          return Promise.resolve(mockEntryCount);
        }
        if (args.sql.includes('due_date FROM revisions')) {
          return Promise.resolve(mockNextRevision);
        }
        return Promise.resolve([]);
      });

      // Act: Call the function
      const subjects = await getSubjects();

      // Assert: Verify results
      expect(subjects).toHaveLength(2);
      expect(subjects[0]).toHaveProperty('entryCount', 5);
      expect(subjects[0]).toHaveProperty('nextRevisionDays');
      expect(invoke).toHaveBeenCalled();
    });

    it('should handle empty subjects list', async () => {
      // Arrange
      (invoke as any).mockResolvedValue([]);

      // Act
      const subjects = await getSubjects();

      // Assert
      expect(subjects).toHaveLength(0);
    });

    it('should handle database errors', async () => {
      // Arrange
      (invoke as any).mockRejectedValue(new Error('Database error'));

      // Act & Assert
      await expect(getSubjects()).rejects.toThrow('Database error');
    });
  });

  describe('createSubject', () => {
    it('should create a new subject', async () => {
      // Arrange
      const mockResult = { lastInsertId: 1, rowsAffected: 1 };
      const mockSubject = {
        id: 1,
        name: 'Physics',
        color: '#FF6B6B',
        icon: '⚛️',
        created_at: '2024-01-01'
      };

      (invoke as any).mockImplementation((cmd: string, args: any) => {
        if (args.sql.includes('INSERT INTO subjects')) {
          return Promise.resolve(mockResult);
        }
        if (args.sql.includes('SELECT * FROM subjects WHERE id')) {
          return Promise.resolve([mockSubject]);
        }
        return Promise.resolve([]);
      });

      // Act
      const subject = await createSubject('Physics');

      // Assert
      expect(subject).toEqual(mockSubject);
      expect(invoke).toHaveBeenCalled();
    });
  });
});
