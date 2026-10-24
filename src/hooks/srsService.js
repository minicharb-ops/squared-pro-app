/**
 * Spaced Repetition System (SRS) Leitner Box Service
 * Manages Leitner Box intervals and card grading math for Easy/Good/Hard answers.
 */

// Mapping of Leitner Boxes to review intervals (in days)
export const BOX_INTERVALS = {
  1: 1,   // Box 1: review every day
  2: 3,   // Box 2: review every 3 days
  3: 7,   // Box 3: review every 7 days
  4: 14,  // Box 4: review every 14 days
  5: 30,  // Box 5: review every 30 days
};

/**
 * Calculates the next Leitner review state based on user's performance grading.
 * 
 * @param {Object} currentReview - The current review state for the card (if any).
 * @param {'easy' | 'good' | 'hard'} grade - User feedback on their familiarity.
 * @returns {Object} Updated review data containing box, interval, dueDate, and lastGraded.
 */
export function calculateNextReview(currentReview, grade) {
  const now = new Date();
  const currentBox = currentReview?.box || 1;
  
  let nextBox = currentBox;
  let nextIntervalDays = 0;
  let nextDueDate = new Date();

  switch (grade) {
    case 'hard':
      // Demote to Box 1 for immediate restudy
      nextBox = 1;
      nextIntervalDays = 0; // Immediate / same-day review
      // Set due date to 10 seconds from now so it stays in today's active deck
      nextDueDate = new Date(now.getTime() + 10 * 1000);
      break;

    case 'good':
      // Advance to next box (max Box 5)
      nextBox = Math.min(currentBox + 1, 5);
      nextIntervalDays = BOX_INTERVALS[nextBox];
      nextDueDate = new Date(now.getTime() + nextIntervalDays * 24 * 60 * 60 * 1000);
      break;

    case 'easy':
      // Double promotion / advance by 2 boxes (max Box 5) for strong memory
      nextBox = Math.min(currentBox + 2, 5);
      // Give a slight bonus multiplier for "Easy" cards in the same box
      nextIntervalDays = Math.ceil(BOX_INTERVALS[nextBox] * 1.5);
      nextDueDate = new Date(now.getTime() + nextIntervalDays * 24 * 60 * 60 * 1000);
      break;

    default:
      nextBox = currentBox;
      nextIntervalDays = BOX_INTERVALS[nextBox] || 1;
      nextDueDate = new Date(now.getTime() + nextIntervalDays * 24 * 60 * 60 * 1000);
  }

  return {
    id: currentReview?.id || null,
    box: nextBox,
    interval: nextIntervalDays,
    dueDate: nextDueDate.toISOString(),
    lastGraded: now.toISOString(),
    streak: grade === 'hard' ? 0 : (currentReview?.streak || 0) + 1
  };
}

/**
 * Checks if a card is due for review today based on its due date.
 * If there is no review record, it is considered new and due.
 * 
 * @param {Object|null} cardReview - The stored review data for the card.
 * @returns {boolean} True if due, false otherwise.
 */
export function isCardDue(cardReview) {
  if (!cardReview || !cardReview.dueDate) {
    return true; // New cards are always due
  }
  const dueDate = new Date(cardReview.dueDate);
  const now = new Date();
  return dueDate <= now;
}

/**
 * Filter questions array down to only items due for review today.
 * 
 * @param {Array} questions - List of all questions.
 * @param {Object} reviews - Map of cardId to review records.
 * @returns {Array} Filtered questions.
 */
export function filterDueCards(questions, reviews) {
  const reviewsMap = reviews || {};
  return questions.filter(q => {
    const review = reviewsMap[q.id];
    return isCardDue(review);
  });
}
