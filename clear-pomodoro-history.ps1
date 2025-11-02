# Clear Pomodoro History PowerShell Script
# This script clears all pomodoro sessions and resets daily activity

Write-Host "🔍 Locating Recallify database..." -ForegroundColor Cyan

# Determine database path based on OS
$dbPath = Join-Path $env:LOCALAPPDATA "Recallify\recallify.db"

if (-not (Test-Path $dbPath)) {
    Write-Host "❌ Database not found at: $dbPath" -ForegroundColor Red
    Write-Host "Please make sure Recallify has been run at least once." -ForegroundColor Yellow
    exit 1
}

Write-Host "✓ Found database at: $dbPath" -ForegroundColor Green
Write-Host ""

# Check if sqlite3 is available
$sqlite3Path = Get-Command sqlite3 -ErrorAction SilentlyContinue

if (-not $sqlite3Path) {
    Write-Host "⚠️  SQLite3 command-line tool not found." -ForegroundColor Yellow
    Write-Host "You can clear the history manually:" -ForegroundColor Cyan
    Write-Host ""
    Write-Host "Option 1: Download SQLite from https://www.sqlite.org/download.html" -ForegroundColor White
    Write-Host "Then run: sqlite3.exe `"$dbPath`" < clear-pomodoro-history.sql" -ForegroundColor White
    Write-Host ""
    Write-Host "Option 2: Use the app's built-in settings (if available)" -ForegroundColor White
    Write-Host ""
    Write-Host "Option 3: Delete the database file (you'll lose all data):" -ForegroundColor White
    Write-Host "Remove-Item `"$dbPath`"" -ForegroundColor White
    exit 1
}

Write-Host "🗑️  Clearing pomodoro history..." -ForegroundColor Cyan

# Execute SQL commands
$sqlCommands = @"
DELETE FROM pomodoro_sessions;
DELETE FROM daily_activity;
DELETE FROM milestone_celebrations;
UPDATE pomodoro_state SET session_type = 'work', remaining_seconds = 1500, duration_seconds = 1500, is_running = 0, pomodoro_count = 0 WHERE id = 1;
SELECT 'Sessions cleared:', COUNT(*) FROM pomodoro_sessions;
SELECT 'Activity cleared:', COUNT(*) FROM daily_activity;
SELECT 'Milestones cleared:', COUNT(*) FROM milestone_celebrations;
"@

$sqlCommands | sqlite3 $dbPath

Write-Host ""
Write-Host "✅ Successfully cleared all pomodoro history!" -ForegroundColor Green
Write-Host "You can now start fresh with accurate tracking." -ForegroundColor Cyan
