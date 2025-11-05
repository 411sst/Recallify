import { describe, it, expect, beforeEach, vi } from 'vitest';
import {
  calculateNextReview,
  calculateNextReviewDate,
  isOverdue,
  type Quality,
} from './spacedRepetition';

describe('Spaced Repetition Utils', () => {
  describe('calculateNextReview', () => {
    it('should calculate first review with quality 5', () => {
      // Arrange
      const quality: Quality = 5;

      // Act
      const result = calculateNextReview(quality);

      // Assert
      expect(result.interval).toBe(1);
      expect(result.repetitions).toBe(1);
      expect(result.easeFactor).toBeGreaterThan(2.5);
    });

    it('should calculate second review with quality 5', () => {
      // Arrange
      const quality: Quality = 5;
      const previousInterval = 1;
      const previousRepetitions = 1;

      // Act
      const result = calculateNextReview(
        quality,
        previousInterval,
        2.5,
        previousRepetitions
      );

      // Assert
      expect(result.interval).toBe(6);
      expect(result.repetitions).toBe(2);
    });

    it('should calculate subsequent reviews with quality 5', () => {
      // Arrange
      const quality: Quality = 5;
      const previousInterval = 6;
      const previousEaseFactor = 2.6;
      const previousRepetitions = 2;

      // Act
      const result = calculateNextReview(
        quality,
        previousInterval,
        previousEaseFactor,
        previousRepetitions
      );

      // Assert
      expect(result.interval).toBe(16); // 6 * 2.6 ≈ 16
      expect(result.repetitions).toBe(3);
      expect(result.easeFactor).toBeGreaterThan(previousEaseFactor);
    });

    it('should restart learning process when quality < 3', () => {
      // Arrange
      const quality: Quality = 2;
      const previousInterval = 30;
      const previousEaseFactor = 2.5;
      const previousRepetitions = 5;

      // Act
      const result = calculateNextReview(
        quality,
        previousInterval,
        previousEaseFactor,
        previousRepetitions
      );

      // Assert
      expect(result.interval).toBe(1);
      expect(result.repetitions).toBe(0);
    });

    it('should decrease ease factor for poor quality responses', () => {
      // Arrange
      const quality: Quality = 2;
      const initialEaseFactor = 2.5;

      // Act
      const result = calculateNextReview(quality, 0, initialEaseFactor, 0);

      // Assert
      expect(result.easeFactor).toBeLessThan(initialEaseFactor);
    });

    it('should maintain minimum ease factor of 1.3', () => {
      // Arrange
      const quality: Quality = 0;
      const veryLowEaseFactor = 1.3;

      // Act
      const result = calculateNextReview(quality, 0, veryLowEaseFactor, 0);

      // Assert
      expect(result.easeFactor).toBeGreaterThanOrEqual(1.3);
    });

    it('should increase ease factor for high quality responses', () => {
      // Arrange
      const quality: Quality = 5;
      const initialEaseFactor = 2.5;

      // Act
      const result = calculateNextReview(quality, 0, initialEaseFactor, 0);

      // Assert
      expect(result.easeFactor).toBeGreaterThan(initialEaseFactor);
    });

    it('should throw error for invalid quality', () => {
      // Arrange & Act & Assert
      expect(() => calculateNextReview(-1 as Quality)).toThrow(
        'Quality must be between 0 and 5'
      );
      expect(() => calculateNextReview(6 as Quality)).toThrow(
        'Quality must be between 0 and 5'
      );
    });

    it.each([
      [0, 1, 0],
      [1, 1, 0],
      [2, 1, 0],
      [3, 1, 1],
      [4, 1, 1],
      [5, 1, 1],
    ] as [Quality, number, number][])(
      'quality %i should result in interval %i and repetitions %i',
      (quality, expectedInterval, expectedRepetitions) => {
        // Act
        const result = calculateNextReview(quality);

        // Assert
        expect(result.interval).toBe(expectedInterval);
        expect(result.repetitions).toBe(expectedRepetitions);
      }
    );
  });

  describe('calculateNextReviewDate', () => {
    beforeEach(() => {
      // Use fake timers for consistent date testing
      vi.useFakeTimers();
      vi.setSystemTime(new Date('2024-01-01T12:00:00Z'));
    });

    afterEach(() => {
      vi.useRealTimers();
    });

    it('should calculate next review date correctly', () => {
      // Arrange
      const result = {
        interval: 5,
        easeFactor: 2.5,
        repetitions: 3,
      };

      // Act
      const nextDate = calculateNextReviewDate(result);

      // Assert
      expect(nextDate.getDate()).toBe(6); // Jan 1 + 5 days = Jan 6
      expect(nextDate.getMonth()).toBe(0); // January
      expect(nextDate.getFullYear()).toBe(2024);
    });

    it('should set time to start of day', () => {
      // Arrange
      const result = {
        interval: 1,
        easeFactor: 2.5,
        repetitions: 1,
      };

      // Act
      const nextDate = calculateNextReviewDate(result);

      // Assert
      expect(nextDate.getHours()).toBe(0);
      expect(nextDate.getMinutes()).toBe(0);
      expect(nextDate.getSeconds()).toBe(0);
      expect(nextDate.getMilliseconds()).toBe(0);
    });

    it('should handle month transitions', () => {
      // Arrange
      vi.setSystemTime(new Date('2024-01-30T12:00:00Z'));
      const result = {
        interval: 5,
        easeFactor: 2.5,
        repetitions: 3,
      };

      // Act
      const nextDate = calculateNextReviewDate(result);

      // Assert
      expect(nextDate.getDate()).toBe(4); // Jan 30 + 5 = Feb 4
      expect(nextDate.getMonth()).toBe(1); // February
    });
  });

  describe('isOverdue', () => {
    beforeEach(() => {
      vi.useFakeTimers();
      vi.setSystemTime(new Date('2024-01-15T12:00:00Z'));
    });

    afterEach(() => {
      vi.useRealTimers();
    });

    it('should return true for past dates', () => {
      // Arrange
      const pastDate = new Date('2024-01-10T00:00:00Z');

      // Act
      const result = isOverdue(pastDate);

      // Assert
      expect(result).toBe(true);
    });

    it('should return false for today', () => {
      // Arrange
      const today = new Date('2024-01-15T00:00:00Z');

      // Act
      const result = isOverdue(today);

      // Assert
      expect(result).toBe(false);
    });

    it('should return false for future dates', () => {
      // Arrange
      const futureDate = new Date('2024-01-20T00:00:00Z');

      // Act
      const result = isOverdue(futureDate);

      // Assert
      expect(result).toBe(false);
    });

    it('should ignore time of day when checking overdue status', () => {
      // Arrange
      const todayLate = new Date('2024-01-15T23:59:59Z');

      // Act
      const result = isOverdue(todayLate);

      // Assert
      expect(result).toBe(false);
    });
  });

  describe('Integration: Full review workflow', () => {
    it('should simulate a learning progression', () => {
      // Simulate learning a new card with varying quality

      // First review - perfect recall
      let review = calculateNextReview(5);
      expect(review.interval).toBe(1);
      expect(review.repetitions).toBe(1);

      // Second review - perfect recall
      review = calculateNextReview(
        5,
        review.interval,
        review.easeFactor,
        review.repetitions
      );
      expect(review.interval).toBe(6);
      expect(review.repetitions).toBe(2);

      // Third review - good recall
      review = calculateNextReview(
        4,
        review.interval,
        review.easeFactor,
        review.repetitions
      );
      expect(review.interval).toBeGreaterThan(6);
      expect(review.repetitions).toBe(3);

      // Fourth review - forgot (quality 1)
      review = calculateNextReview(
        1,
        review.interval,
        review.easeFactor,
        review.repetitions
      );
      expect(review.interval).toBe(1); // Reset
      expect(review.repetitions).toBe(0); // Reset
    });
  });
});
