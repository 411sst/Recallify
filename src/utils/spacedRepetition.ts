/**
 * Spaced Repetition Algorithm (SM-2)
 * Calculates the next review interval based on user performance
 */

export interface ReviewResult {
  interval: number; // Days until next review
  easeFactor: number; // Difficulty multiplier
  repetitions: number; // Number of successful reviews
}

export type Quality = 0 | 1 | 2 | 3 | 4 | 5;

/**
 * Calculate the next review interval using the SM-2 algorithm
 * @param quality - User's response quality (0-5)
 *   0: Total blackout
 *   1: Incorrect response with correct answer seeming familiar
 *   2: Incorrect response with correct answer easily recalled
 *   3: Correct response with difficulty
 *   4: Correct response after hesitation
 *   5: Perfect response
 * @param previousInterval - Previous interval in days
 * @param previousEaseFactor - Previous ease factor (default: 2.5)
 * @param previousRepetitions - Number of previous successful repetitions
 */
export function calculateNextReview(
  quality: Quality,
  previousInterval: number = 0,
  previousEaseFactor: number = 2.5,
  previousRepetitions: number = 0
): ReviewResult {
  // Validate quality input
  if (quality < 0 || quality > 5) {
    throw new Error('Quality must be between 0 and 5');
  }

  let easeFactor = previousEaseFactor;
  let interval = previousInterval;
  let repetitions = previousRepetitions;

  // Update ease factor
  easeFactor = Math.max(
    1.3,
    easeFactor + (0.1 - (5 - quality) * (0.08 + (5 - quality) * 0.02))
  );

  // If quality < 3, restart the learning process
  if (quality < 3) {
    repetitions = 0;
    interval = 1;
  } else {
    repetitions += 1;

    // Calculate new interval
    if (repetitions === 1) {
      interval = 1;
    } else if (repetitions === 2) {
      interval = 6;
    } else {
      interval = Math.round(interval * easeFactor);
    }
  }

  return {
    interval,
    easeFactor: Math.round(easeFactor * 100) / 100, // Round to 2 decimal places
    repetitions,
  };
}

/**
 * Calculate the date of the next review
 */
export function calculateNextReviewDate(result: ReviewResult): Date {
  const nextDate = new Date();
  nextDate.setDate(nextDate.getDate() + result.interval);
  nextDate.setHours(0, 0, 0, 0); // Set to start of day
  return nextDate;
}

/**
 * Determine if a review is overdue
 */
export function isOverdue(dueDate: Date): boolean {
  const today = new Date();
  today.setHours(0, 0, 0, 0);
  return dueDate < today;
}
