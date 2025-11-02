-- Clear Pomodoro History ONLY
-- This clears ONLY pomodoro timer data while keeping all study logs, subjects, and entries safe

-- Clear all pomodoro sessions (the false 1325 minutes)
DELETE FROM pomodoro_sessions;

-- Clear daily activity records (streak data from pomodoros)
DELETE FROM daily_activity;

-- Clear milestone celebrations (from pomodoro streaks)
DELETE FROM milestone_celebrations;

-- Reset pomodoro timer state to default
UPDATE pomodoro_state
SET session_type = 'work',
    remaining_seconds = 1500,
    duration_seconds = 1500,
    is_running = 0,
    pomodoro_count = 0
WHERE id = 1;

-- Verify cleanup (should all show 0)
SELECT 'Pomodoro sessions remaining:', COUNT(*) FROM pomodoro_sessions;
SELECT 'Daily activity remaining:', COUNT(*) FROM daily_activity;
SELECT 'Milestones remaining:', COUNT(*) FROM milestone_celebrations;

-- Verify your study data is still intact
SELECT 'Subjects preserved:', COUNT(*) FROM subjects;
SELECT 'Study entries preserved:', COUNT(*) FROM entries;
