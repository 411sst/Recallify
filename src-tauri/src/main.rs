// Prevents additional console window on Windows in release, DO NOT REMOVE!!
#![cfg_attr(not(debug_assertions), windows_subsystem = "windows")]

use once_cell::sync::Lazy;
use rusqlite::{Connection, Result};
use std::sync::Mutex;

static DB: Lazy<Mutex<Connection>> = Lazy::new(|| {
    let conn = Connection::open("recallify.db").expect("Failed to open database");
    init_database(&conn).expect("Failed to initialize database");
    Mutex::new(conn)
});

fn init_database(conn: &Connection) -> Result<()> {
    conn.execute_batch(
        "
        CREATE TABLE IF NOT EXISTS subjects (
            id INTEGER PRIMARY KEY AUTOINCREMENT,
            name TEXT NOT NULL,
            created_at TIMESTAMP DEFAULT CURRENT_TIMESTAMP,
            updated_at TIMESTAMP DEFAULT CURRENT_TIMESTAMP
        );

        CREATE TABLE IF NOT EXISTS entries (
            id INTEGER PRIMARY KEY AUTOINCREMENT,
            subject_id INTEGER NOT NULL,
            study_date DATE NOT NULL,
            study_notes TEXT NOT NULL,
            morning_recall_notes TEXT,
            created_at TIMESTAMP DEFAULT CURRENT_TIMESTAMP,
            updated_at TIMESTAMP DEFAULT CURRENT_TIMESTAMP,
            FOREIGN KEY (subject_id) REFERENCES subjects(id) ON DELETE CASCADE
        );

        CREATE TABLE IF NOT EXISTS revision_intervals (
            id INTEGER PRIMARY KEY AUTOINCREMENT,
            entry_id INTEGER NOT NULL,
            interval_days INTEGER NOT NULL,
            FOREIGN KEY (entry_id) REFERENCES entries(id) ON DELETE CASCADE
        );

        CREATE TABLE IF NOT EXISTS revisions (
            id INTEGER PRIMARY KEY AUTOINCREMENT,
            entry_id INTEGER NOT NULL,
            interval_days INTEGER NOT NULL,
            due_date DATE NOT NULL,
            status TEXT NOT NULL CHECK(status IN ('pending', 'completed', 'overdue', 'rescheduled')),
            completed_at TIMESTAMP,
            created_at TIMESTAMP DEFAULT CURRENT_TIMESTAMP,
            updated_at TIMESTAMP DEFAULT CURRENT_TIMESTAMP,
            FOREIGN KEY (entry_id) REFERENCES entries(id) ON DELETE CASCADE
        );

        CREATE TABLE IF NOT EXISTS settings (
            key TEXT PRIMARY KEY,
            value TEXT NOT NULL,
            updated_at TIMESTAMP DEFAULT CURRENT_TIMESTAMP
        );

        CREATE TABLE IF NOT EXISTS activity_log (
            id INTEGER PRIMARY KEY AUTOINCREMENT,
            entry_id INTEGER NOT NULL,
            activity_type TEXT NOT NULL CHECK(activity_type IN ('study', 'revision_completed', 'entry_created')),
            activity_date DATE NOT NULL,
            details TEXT,
            created_at TIMESTAMP DEFAULT CURRENT_TIMESTAMP,
            FOREIGN KEY (entry_id) REFERENCES entries(id) ON DELETE CASCADE
        );

        CREATE INDEX IF NOT EXISTS idx_entries_subject_id ON entries(subject_id);
        CREATE INDEX IF NOT EXISTS idx_entries_study_date ON entries(study_date);
        CREATE INDEX IF NOT EXISTS idx_revisions_entry_id ON revisions(entry_id);
        CREATE INDEX IF NOT EXISTS idx_revisions_due_date ON revisions(due_date);
        CREATE INDEX IF NOT EXISTS idx_revisions_status ON revisions(status);
        CREATE INDEX IF NOT EXISTS idx_activity_log_entry_id ON activity_log(entry_id);
        CREATE INDEX IF NOT EXISTS idx_activity_log_activity_date ON activity_log(activity_date);
        ",
    )?;

    // Insert default settings if not exists
    conn.execute(
        "INSERT OR IGNORE INTO settings (key, value) VALUES ('default_intervals', '3,7')",
        [],
    )?;
    conn.execute(
        "INSERT OR IGNORE INTO settings (key, value) VALUES ('notification_enabled', 'true')",
        [],
    )?;
    conn.execute(
        "INSERT OR IGNORE INTO settings (key, value) VALUES ('notification_time', '10:00')",
        [],
    )?;

    Ok(())
}

#[tauri::command]
fn db_execute(sql: String, params: Vec<serde_json::Value>) -> Result<serde_json::Value, String> {
    let db = DB.lock().map_err(|e| e.to_string())?;

    // Convert JSON values to rusqlite parameters
    let sql_params: Vec<Box<dyn rusqlite::ToSql>> = params
        .iter()
        .map(|v| -> Box<dyn rusqlite::ToSql> {
            match v {
                serde_json::Value::String(s) => Box::new(s.clone()),
                serde_json::Value::Number(n) => {
                    if let Some(i) = n.as_i64() {
                        Box::new(i)
                    } else if let Some(f) = n.as_f64() {
                        Box::new(f)
                    } else {
                        Box::new(n.to_string())
                    }
                }
                serde_json::Value::Bool(b) => Box::new(*b),
                serde_json::Value::Null => Box::new(None::<String>),
                _ => Box::new(v.to_string()),
            }
        })
        .collect();

    let sql_params_refs: Vec<&dyn rusqlite::ToSql> = sql_params
        .iter()
        .map(|b| b.as_ref())
        .collect();

    db.execute(&sql, sql_params_refs.as_slice())
        .map_err(|e| e.to_string())?;

    let last_id = db.last_insert_rowid();

    Ok(serde_json::json!({
        "lastInsertId": last_id,
        "rowsAffected": db.changes()
    }))
}

#[tauri::command]
fn db_select(sql: String, params: Vec<serde_json::Value>) -> Result<Vec<serde_json::Value>, String> {
    let db = DB.lock().map_err(|e| e.to_string())?;

    let mut stmt = db.prepare(&sql).map_err(|e| e.to_string())?;

    let column_count = stmt.column_count();
    let column_names: Vec<String> = (0..column_count)
        .map(|i| stmt.column_name(i).unwrap_or("").to_string())
        .collect();

    // Convert JSON values to rusqlite parameters
    let sql_params: Vec<Box<dyn rusqlite::ToSql>> = params
        .iter()
        .map(|v| -> Box<dyn rusqlite::ToSql> {
            match v {
                serde_json::Value::String(s) => Box::new(s.clone()),
                serde_json::Value::Number(n) => {
                    if let Some(i) = n.as_i64() {
                        Box::new(i)
                    } else if let Some(f) = n.as_f64() {
                        Box::new(f)
                    } else {
                        Box::new(n.to_string())
                    }
                }
                serde_json::Value::Bool(b) => Box::new(*b),
                serde_json::Value::Null => Box::new(None::<String>),
                _ => Box::new(v.to_string()),
            }
        })
        .collect();

    let sql_params_refs: Vec<&dyn rusqlite::ToSql> = sql_params
        .iter()
        .map(|b| b.as_ref())
        .collect();

    let rows = stmt
        .query_map(sql_params_refs.as_slice(), |row| {
            let mut obj = serde_json::Map::new();
            for (i, name) in column_names.iter().enumerate() {
                // Try different types
                let value = if let Ok(s) = row.get::<_, Option<String>>(i) {
                    match s {
                        Some(v) => serde_json::Value::String(v),
                        None => serde_json::Value::Null,
                    }
                } else if let Ok(n) = row.get::<_, Option<i64>>(i) {
                    match n {
                        Some(v) => serde_json::Value::Number(v.into()),
                        None => serde_json::Value::Null,
                    }
                } else if let Ok(f) = row.get::<_, Option<f64>>(i) {
                    match f {
                        Some(v) => serde_json::Number::from_f64(v)
                            .map(serde_json::Value::Number)
                            .unwrap_or(serde_json::Value::Null),
                        None => serde_json::Value::Null,
                    }
                } else {
                    serde_json::Value::Null
                };

                obj.insert(name.clone(), value);
            }
            Ok(serde_json::Value::Object(obj))
        })
        .map_err(|e| e.to_string())?
        .collect::<std::result::Result<Vec<_>, _>>()
        .map_err(|e: rusqlite::Error| e.to_string())?;

    Ok(rows)
}

fn main() {
    // Initialize database at startup
    drop(DB.lock());

    tauri::Builder::default()
        .invoke_handler(tauri::generate_handler![db_execute, db_select])
        .run(tauri::generate_context!())
        .expect("error while running tauri application");
}
