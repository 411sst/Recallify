-- Clear Pomodoro History
-- This SQL script clears all pomodoro sessions and resets tracking

-- Clear all pomodoro sessions
DELETE FROM pomodoro_sessions;

-- Clear all daily activity records
DELETE FROM daily_activity;

-- Clear all milestone celebrations
DELETE FROM milestone_celebrations;

-- Reset pomodoro timer state
UPDATE pomodoro_state
SET session_type = 'work',
    remaining_seconds = 1500,
    duration_seconds = 1500,
    is_running = 0,
    pomodoro_count = 0
WHERE id = 1;

-- Verify cleanup
SELECT 'Remaining pomodoro sessions:', COUNT(*) FROM pomodoro_sessions;
SELECT 'Remaining daily activity:', COUNT(*) FROM daily_activity;
SELECT 'Remaining milestones:', COUNT(*) FROM milestone_celebrations;
