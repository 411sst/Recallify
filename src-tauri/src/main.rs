// Prevents additional console window on Windows in release, DO NOT REMOVE!!
#![cfg_attr(not(debug_assertions), windows_subsystem = "windows")]

use once_cell::sync::Lazy;
use rusqlite::{Connection, Result};
use std::sync::Mutex;
use std::path::PathBuf;
use std::fs;

fn get_app_data_dir() -> PathBuf {
    #[cfg(target_os = "windows")]
    {
        use directories::BaseDirs;
        if let Some(base_dirs) = BaseDirs::new() {
            let app_data = base_dirs.data_local_dir().join("Recallify");
            fs::create_dir_all(&app_data).expect("Failed to create app data directory");
            return app_data;
        }
    }

    #[cfg(not(target_os = "windows"))]
    {
        use directories::ProjectDirs;
        if let Some(proj_dirs) = ProjectDirs::from("com", "Recallify", "Recallify") {
            let app_data = proj_dirs.data_dir().to_path_buf();
            fs::create_dir_all(&app_data).expect("Failed to create app data directory");
            return app_data;
        }
    }

    // Fallback to current directory if all else fails
    PathBuf::from(".")
}

static DB: Lazy<Mutex<Connection>> = Lazy::new(|| {
    let db_path = get_app_data_dir().join("recallify.db");
    println!("Database location: {:?}", db_path);
    let conn = Connection::open(&db_path).expect("Failed to open database");
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

        CREATE TABLE IF NOT EXISTS pomodoro_sessions (
            id INTEGER PRIMARY KEY AUTOINCREMENT,
            session_type TEXT NOT NULL CHECK(session_type IN ('work', 'short_break', 'long_break')),
            duration_minutes INTEGER NOT NULL,
            subject_id INTEGER,
            syllabus_item_id INTEGER,
            completed_at TIMESTAMP DEFAULT CURRENT_TIMESTAMP,
            FOREIGN KEY (subject_id) REFERENCES subjects(id) ON DELETE SET NULL,
            FOREIGN KEY (syllabus_item_id) REFERENCES syllabus_items(id) ON DELETE SET NULL
        );

        CREATE TABLE IF NOT EXISTS pomodoro_state (
            id INTEGER PRIMARY KEY CHECK(id = 1),
            session_type TEXT NOT NULL CHECK(session_type IN ('work', 'short_break', 'long_break')),
            start_timestamp INTEGER,
            duration_seconds INTEGER NOT NULL,
            remaining_seconds INTEGER NOT NULL,
            is_running INTEGER DEFAULT 0,
            pomodoro_count INTEGER DEFAULT 0 CHECK(pomodoro_count >= 0 AND pomodoro_count <= 4),
            updated_at TIMESTAMP DEFAULT CURRENT_TIMESTAMP
        );

        CREATE TABLE IF NOT EXISTS syllabus_items (
            id INTEGER PRIMARY KEY AUTOINCREMENT,
            subject_id INTEGER NOT NULL,
            parent_id INTEGER,
            title TEXT NOT NULL,
            description TEXT,
            estimated_hours REAL,
            due_date DATE,
            is_completed INTEGER DEFAULT 0,
            sort_order INTEGER DEFAULT 0,
            created_at TIMESTAMP DEFAULT CURRENT_TIMESTAMP,
            updated_at TIMESTAMP DEFAULT CURRENT_TIMESTAMP,
            FOREIGN KEY (subject_id) REFERENCES subjects(id) ON DELETE CASCADE,
            FOREIGN KEY (parent_id) REFERENCES syllabus_items(id) ON DELETE CASCADE
        );

        CREATE TABLE IF NOT EXISTS entry_syllabus_links (
            entry_id INTEGER NOT NULL,
            syllabus_item_id INTEGER NOT NULL,
            created_at TIMESTAMP DEFAULT CURRENT_TIMESTAMP,
            PRIMARY KEY (entry_id, syllabus_item_id),
            FOREIGN KEY (entry_id) REFERENCES entries(id) ON DELETE CASCADE,
            FOREIGN KEY (syllabus_item_id) REFERENCES syllabus_items(id) ON DELETE CASCADE
        );

        CREATE TABLE IF NOT EXISTS pdf_attachments (
            id INTEGER PRIMARY KEY AUTOINCREMENT,
            entry_id INTEGER NOT NULL,
            file_name TEXT NOT NULL,
            file_path TEXT NOT NULL,
            file_size INTEGER NOT NULL,
            page_count INTEGER,
            last_viewed_page INTEGER DEFAULT 1,
            created_at TIMESTAMP DEFAULT CURRENT_TIMESTAMP,
            FOREIGN KEY (entry_id) REFERENCES entries(id) ON DELETE CASCADE
        );

        CREATE TABLE IF NOT EXISTS export_history (
            id INTEGER PRIMARY KEY AUTOINCREMENT,
            export_type TEXT NOT NULL,
            file_name TEXT NOT NULL,
            file_path TEXT NOT NULL,
            file_size INTEGER,
            exported_at TIMESTAMP DEFAULT CURRENT_TIMESTAMP
        );

        CREATE INDEX IF NOT EXISTS idx_entries_subject_id ON entries(subject_id);
        CREATE INDEX IF NOT EXISTS idx_entries_study_date ON entries(study_date);
        CREATE INDEX IF NOT EXISTS idx_revisions_entry_id ON revisions(entry_id);
        CREATE INDEX IF NOT EXISTS idx_revisions_due_date ON revisions(due_date);
        CREATE INDEX IF NOT EXISTS idx_revisions_status ON revisions(status);
        CREATE INDEX IF NOT EXISTS idx_activity_log_entry_id ON activity_log(entry_id);
        CREATE INDEX IF NOT EXISTS idx_activity_log_activity_date ON activity_log(activity_date);
        CREATE INDEX IF NOT EXISTS idx_pomodoro_sessions_completed_at ON pomodoro_sessions(completed_at);
        CREATE INDEX IF NOT EXISTS idx_pomodoro_sessions_subject_id ON pomodoro_sessions(subject_id);
        CREATE INDEX IF NOT EXISTS idx_syllabus_items_subject_id ON syllabus_items(subject_id);
        CREATE INDEX IF NOT EXISTS idx_syllabus_items_parent_id ON syllabus_items(parent_id);
        CREATE INDEX IF NOT EXISTS idx_pdf_attachments_entry_id ON pdf_attachments(entry_id);
        CREATE INDEX IF NOT EXISTS idx_export_history_exported_at ON export_history(exported_at);
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

    // Pomodoro settings
    conn.execute(
        "INSERT OR IGNORE INTO settings (key, value) VALUES ('pomodoro_work_duration', '25')",
        [],
    )?;
    conn.execute(
        "INSERT OR IGNORE INTO settings (key, value) VALUES ('pomodoro_short_break', '5')",
        [],
    )?;
    conn.execute(
        "INSERT OR IGNORE INTO settings (key, value) VALUES ('pomodoro_long_break_default', '20')",
        [],
    )?;
    conn.execute(
        "INSERT OR IGNORE INTO settings (key, value) VALUES ('pomodoro_sound_enabled', 'true')",
        [],
    )?;
    conn.execute(
        "INSERT OR IGNORE INTO settings (key, value) VALUES ('pomodoro_sound_choice', 'gentle_bell')",
        [],
    )?;

    // Dark mode setting
    conn.execute(
        "INSERT OR IGNORE INTO settings (key, value) VALUES ('dark_mode_enabled', 'false')",
        [],
    )?;

    // Initialize pomodoro state
    conn.execute(
        "INSERT OR IGNORE INTO pomodoro_state (id, session_type, duration_seconds, remaining_seconds, pomodoro_count) VALUES (1, 'work', 1500, 1500, 0)",
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

#[tauri::command]
fn read_pdf_file(file_path: String) -> Result<Vec<u8>, String> {
    std::fs::read(&file_path).map_err(|e| format!("Failed to read PDF file: {}", e))
}

#[tauri::command]
fn save_pdf_file(file_name: String, file_data: Vec<u8>) -> Result<String, String> {
    // Create pdfs directory in app data folder (same location as database)
    let pdfs_dir = get_app_data_dir().join("pdfs");

    // Create directory if it doesn't exist
    fs::create_dir_all(&pdfs_dir)
        .map_err(|e| format!("Failed to create pdfs directory: {}", e))?;

    // Generate unique file path
    let file_path = pdfs_dir.join(&file_name);

    // Write file
    fs::write(&file_path, file_data)
        .map_err(|e| format!("Failed to write PDF file: {}", e))?;

    // Return absolute path
    file_path
        .to_str()
        .ok_or_else(|| "Failed to convert path to string".to_string())
        .map(|s| s.to_string())
}

#[tauri::command]
fn delete_pdf_file(file_path: String) -> Result<(), String> {
    std::fs::remove_file(&file_path)
        .map_err(|e| format!("Failed to delete PDF file: {}", e))
}

fn main() {
    // Initialize database at startup
    drop(DB.lock());

    tauri::Builder::default()
        .invoke_handler(tauri::generate_handler![
            db_execute,
            db_select,
            read_pdf_file,
            save_pdf_file,
            delete_pdf_file
        ])
        .run(tauri::generate_context!())
        .expect("error while running tauri application");
}
