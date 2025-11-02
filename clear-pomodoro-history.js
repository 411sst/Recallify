// Clear Pomodoro History Utility
// This script clears all pomodoro sessions and resets daily activity

const { Database } = require('better-sqlite3');
const path = require('path');
const os = require('os');

function getDbPath() {
  const platform = os.platform();
  let appDataPath;

  if (platform === 'win32') {
    appDataPath = path.join(process.env.LOCALAPPDATA || '', 'Recallify', 'recallify.db');
  } else if (platform === 'darwin') {
    appDataPath = path.join(os.homedir(), 'Library', 'Application Support', 'Recallify', 'recallify.db');
  } else {
    appDataPath = path.join(os.homedir(), '.local', 'share', 'Recallify', 'recallify.db');
  }

  return appDataPath;
}

try {
  const dbPath = getDbPath();
  console.log(`Database path: ${dbPath}`);

  const sqlite3 = require('better-sqlite3');
  const db = new sqlite3(dbPath);

  // Clear all pomodoro sessions
  const deleteSessionsStmt = db.prepare('DELETE FROM pomodoro_sessions');
  const deletedSessions = deleteSessionsStmt.run();
  console.log(`✅ Deleted ${deletedSessions.changes} pomodoro sessions`);

  // Clear all daily activity
  const deleteDailyActivityStmt = db.prepare('DELETE FROM daily_activity');
  const deletedActivity = deleteDailyActivityStmt.run();
  console.log(`✅ Deleted ${deletedActivity.changes} daily activity records`);

  // Clear all milestone celebrations
  const deleteMilestonesStmt = db.prepare('DELETE FROM milestone_celebrations');
  const deletedMilestones = deleteMilestonesStmt.run();
  console.log(`✅ Deleted ${deletedMilestones.changes} milestone celebrations`);

  // Reset pomodoro state
  const resetStateStmt = db.prepare(`
    UPDATE pomodoro_state
    SET session_type = 'work',
        remaining_seconds = 1500,
        duration_seconds = 1500,
        is_running = 0,
        pomodoro_count = 0
    WHERE id = 1
  `);
  resetStateStmt.run();
  console.log(`✅ Reset pomodoro timer state`);

  db.close();
  console.log('\n✅ Successfully cleared all pomodoro history!');
  console.log('You can now start fresh with accurate tracking.');

} catch (error) {
  console.error('❌ Error clearing pomodoro history:', error.message);
  console.log('\nIf better-sqlite3 is not installed, run: npm install better-sqlite3');
  console.log('Or use the manual SQL commands below:\n');
  console.log('DELETE FROM pomodoro_sessions;');
  console.log('DELETE FROM daily_activity;');
  console.log('DELETE FROM milestone_celebrations;');
  console.log("UPDATE pomodoro_state SET session_type = 'work', remaining_seconds = 1500, duration_seconds = 1500, is_running = 0, pomodoro_count = 0 WHERE id = 1;");
}
