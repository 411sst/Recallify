export interface Subject {
  id: number;
  name: string;
  created_at: string;
  updated_at: string;
}

export interface Entry {
  id: number;
  subject_id: number;
  study_date: string;
  study_notes: string;
  morning_recall_notes: string | null;
  created_at: string;
  updated_at: string;
}

export interface RevisionInterval {
  id: number;
  entry_id: number;
  interval_days: number;
}

export interface Revision {
  id: number;
  entry_id: number;
  interval_days: number;
  due_date: string;
  status: "pending" | "completed" | "overdue" | "rescheduled";
  completed_at: string | null;
  created_at: string;
  updated_at: string;
}

export interface Setting {
  key: string;
  value: string;
  updated_at: string;
}

export interface ActivityLog {
  id: number;
  entry_id: number;
  activity_type: "study" | "revision_completed" | "entry_created";
  activity_date: string;
  details: string | null;
  created_at: string;
}

// Extended types for UI
export interface SubjectWithStats extends Subject {
  entryCount: number;
  nextRevisionDays?: number;
}

export interface EntryWithDetails extends Entry {
  subject_name: string;
  revisions: Revision[];
  intervals: RevisionInterval[];
}

export interface CalendarDay {
  date: string;
  revisions: Revision[];
  status: "completed" | "due" | "overdue" | "future" | "none";
}

export interface ActivityLogWithDetails extends ActivityLog {
  entry: Entry;
  subject: Subject;
}

// Pomodoro types
export interface PomodoroSession {
  id: number;
  session_type: "work" | "short_break" | "long_break";
  duration_minutes: number;
  completed_at: string;
}

export interface PomodoroState {
  id: number;
  session_type: "work" | "short_break" | "long_break";
  start_timestamp: number | null;
  duration_seconds: number;
  remaining_seconds: number;
  is_running: number;
  pomodoro_count: number;
  updated_at: string;
}
