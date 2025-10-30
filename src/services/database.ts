import { invoke } from "@tauri-apps/api/tauri";
import {
  Subject,
  Entry,
  Revision,
  RevisionInterval,
  Setting,
  ActivityLog,
  SubjectWithStats,
  EntryWithDetails,
  CalendarDay,
  ActivityLogWithDetails,
} from "../types";
import { format, addDays, parseISO } from "date-fns";

// Database wrapper functions
async function dbExecute(sql: string, params: any[] = []): Promise<{ lastInsertId: number; rowsAffected: number }> {
  return await invoke("db_execute", { sql, params });
}

async function dbSelect<T>(sql: string, params: any[] = []): Promise<T[]> {
  return await invoke("db_select", { sql, params });
}

// Subject APIs
export async function getSubjects(): Promise<SubjectWithStats[]> {
  const subjects = await dbSelect<Subject>(
    "SELECT * FROM subjects ORDER BY created_at DESC",
    []
  );

  // Get entry counts and next revision for each subject
  const subjectsWithStats = await Promise.all(
    subjects.map(async (subject) => {
      const entryCount = await dbSelect<{ count: number }>(
        "SELECT COUNT(*) as count FROM entries WHERE subject_id = ?",
        [subject.id]
      );

      const nextRevision = await dbSelect<{ due_date: string }>(
        `SELECT due_date FROM revisions r
         JOIN entries e ON r.entry_id = e.id
         WHERE e.subject_id = ? AND r.status IN ('pending', 'overdue')
         ORDER BY r.due_date ASC
         LIMIT 1`,
        [subject.id]
      );

      let nextRevisionDays: number | undefined;
      if (nextRevision.length > 0) {
        const today = new Date();
        const dueDate = parseISO(nextRevision[0].due_date);
        nextRevisionDays = Math.ceil(
          (dueDate.getTime() - today.getTime()) / (1000 * 60 * 60 * 24)
        );
      }

      return {
        ...subject,
        entryCount: entryCount[0].count,
        nextRevisionDays,
      };
    })
  );

  return subjectsWithStats;
}

export async function createSubject(name: string): Promise<Subject> {
  const result = await dbExecute(
    "INSERT INTO subjects (name) VALUES (?)",
    [name]
  );

  const subjects = await dbSelect<Subject>(
    "SELECT * FROM subjects WHERE id = ?",
    [result.lastInsertId]
  );

  return subjects[0];
}

export async function updateSubject(
  id: number,
  name: string
): Promise<Subject> {
  await dbExecute(
    "UPDATE subjects SET name = ?, updated_at = CURRENT_TIMESTAMP WHERE id = ?",
    [name, id]
  );

  const subjects = await dbSelect<Subject>(
    "SELECT * FROM subjects WHERE id = ?",
    [id]
  );

  return subjects[0];
}

export async function deleteSubject(id: number): Promise<void> {
  await dbExecute("DELETE FROM subjects WHERE id = ?", [id]);
}

export async function getSubjectById(id: number): Promise<Subject> {
  const subjects = await dbSelect<Subject>(
    "SELECT * FROM subjects WHERE id = ?",
    [id]
  );
  return subjects[0];
}

// Entry APIs
export async function getEntriesBySubject(
  subjectId: number
): Promise<EntryWithDetails[]> {
  const entries = await dbSelect<Entry>(
    "SELECT * FROM entries WHERE subject_id = ? ORDER BY study_date DESC",
    [subjectId]
  );

  const subject = await getSubjectById(subjectId);

  const entriesWithDetails = await Promise.all(
    entries.map(async (entry) => {
      const revisions = await dbSelect<Revision>(
        "SELECT * FROM revisions WHERE entry_id = ? ORDER BY due_date ASC",
        [entry.id]
      );

      const intervals = await dbSelect<RevisionInterval>(
        "SELECT * FROM revision_intervals WHERE entry_id = ? ORDER BY interval_days ASC",
        [entry.id]
      );

      return {
        ...entry,
        subject_name: subject.name,
        revisions,
        intervals,
      };
    })
  );

  return entriesWithDetails;
}

export async function getEntryById(id: number): Promise<EntryWithDetails> {
  const entries = await dbSelect<Entry>(
    "SELECT * FROM entries WHERE id = ?",
    [id]
  );

  const entry = entries[0];
  const subject = await getSubjectById(entry.subject_id);

  const revisions = await dbSelect<Revision>(
    "SELECT * FROM revisions WHERE entry_id = ? ORDER BY due_date ASC",
    [entry.id]
  );

  const intervals = await dbSelect<RevisionInterval>(
    "SELECT * FROM revision_intervals WHERE entry_id = ? ORDER BY interval_days ASC",
    [entry.id]
  );

  return {
    ...entry,
    subject_name: subject.name,
    revisions,
    intervals,
  };
}

export async function createEntry(
  subjectId: number,
  studyDate: string,
  studyNotes: string,
  intervals: number[],
  topics?: string
): Promise<EntryWithDetails> {
  // Insert entry
  const entryResult = await dbExecute(
    "INSERT INTO entries (subject_id, study_date, study_notes, topics) VALUES (?, ?, ?, ?)",
    [subjectId, studyDate, studyNotes, topics || null]
  );

  const entryId = entryResult.lastInsertId;

  // Insert intervals
  for (const interval of intervals) {
    await dbExecute(
      "INSERT INTO revision_intervals (entry_id, interval_days) VALUES (?, ?)",
      [entryId, interval]
    );

    // Calculate due date and create revision
    const dueDate = format(
      addDays(parseISO(studyDate), interval),
      "yyyy-MM-dd"
    );
    await dbExecute(
      "INSERT INTO revisions (entry_id, interval_days, due_date, status) VALUES (?, ?, ?, 'pending')",
      [entryId, interval, dueDate]
    );
  }

  // Insert activity log
  await dbExecute(
    "INSERT INTO activity_log (entry_id, activity_type, activity_date) VALUES (?, 'study', ?)",
    [entryId, studyDate]
  );

  return await getEntryById(entryId);
}

export async function updateEntry(
  id: number,
  studyNotes: string,
  morningRecallNotes: string | null,
  intervals?: number[],
  topics?: string
): Promise<EntryWithDetails> {
  await dbExecute(
    "UPDATE entries SET study_notes = ?, morning_recall_notes = ?, topics = ?, updated_at = CURRENT_TIMESTAMP WHERE id = ?",
    [studyNotes, morningRecallNotes, topics || null, id]
  );

  // If intervals are provided, update them
  if (intervals) {
    const entries = await dbSelect<Entry>(
      "SELECT * FROM entries WHERE id = ?",
      [id]
    );
    const studyDate = entries[0].study_date;

    // Delete existing intervals and revisions that are not completed
    await dbExecute("DELETE FROM revision_intervals WHERE entry_id = ?", [
      id,
    ]);
    await dbExecute(
      "DELETE FROM revisions WHERE entry_id = ? AND status = 'pending'",
      [id]
    );

    // Insert new intervals
    for (const interval of intervals) {
      await dbExecute(
        "INSERT INTO revision_intervals (entry_id, interval_days) VALUES (?, ?)",
        [id, interval]
      );

      // Calculate due date and create revision
      const dueDate = format(
        addDays(parseISO(studyDate), interval),
        "yyyy-MM-dd"
      );
      await dbExecute(
        "INSERT INTO revisions (entry_id, interval_days, due_date, status) VALUES (?, ?, ?, 'pending')",
        [id, interval, dueDate]
      );
    }
  }

  return await getEntryById(id);
}

export async function deleteEntry(id: number): Promise<void> {
  await dbExecute("DELETE FROM entries WHERE id = ?", [id]);
}

// Revision APIs
export async function getRevisionsDueToday(): Promise<
  (Revision & { entry: Entry; subject: Subject })[]
> {
  const today = format(new Date(), "yyyy-MM-dd");

  const revisions = await dbSelect<Revision>(
    "SELECT * FROM revisions WHERE due_date <= ? AND status IN ('pending', 'overdue') ORDER BY due_date ASC",
    [today]
  );

  const revisionsWithDetails = await Promise.all(
    revisions.map(async (revision) => {
      const entry = await getEntryById(revision.entry_id);
      const subject = await getSubjectById(entry.subject_id);

      return {
        ...revision,
        entry: entry,
        subject: subject,
      };
    })
  );

  return revisionsWithDetails;
}

export async function getRevisionsByDate(
  date: string
): Promise<(Revision & { entry: Entry; subject: Subject })[]> {
  const revisions = await dbSelect<Revision>(
    "SELECT * FROM revisions WHERE due_date = ? ORDER BY status ASC",
    [date]
  );

  const revisionsWithDetails = await Promise.all(
    revisions.map(async (revision) => {
      const entry = await getEntryById(revision.entry_id);
      const subject = await getSubjectById(entry.subject_id);

      return {
        ...revision,
        entry: entry,
        subject: subject,
      };
    })
  );

  return revisionsWithDetails;
}

export async function completeRevision(id: number): Promise<void> {
  await dbExecute(
    "UPDATE revisions SET status = 'completed', completed_at = CURRENT_TIMESTAMP, updated_at = CURRENT_TIMESTAMP WHERE id = ?",
    [id]
  );

  // Get the revision to log activity
  const revisions = await dbSelect<Revision>(
    "SELECT * FROM revisions WHERE id = ?",
    [id]
  );
  const revision = revisions[0];

  await dbExecute(
    "INSERT INTO activity_log (entry_id, activity_type, activity_date, details) VALUES (?, 'revision_completed', DATE('now'), ?)",
    [revision.entry_id, `Day ${revision.interval_days} revision`]
  );
}

export async function uncompleteRevision(id: number): Promise<void> {
  const revisions = await dbSelect<Revision>(
    "SELECT * FROM revisions WHERE id = ?",
    [id]
  );
  const revision = revisions[0];

  const today = format(new Date(), "yyyy-MM-dd");
  const status = revision.due_date < today ? "overdue" : "pending";

  await dbExecute(
    "UPDATE revisions SET status = ?, completed_at = NULL, updated_at = CURRENT_TIMESTAMP WHERE id = ?",
    [status, id]
  );
}

export async function rescheduleRevision(
  id: number,
  newDate: string
): Promise<void> {
  // Mark old revision as rescheduled
  await dbExecute(
    "UPDATE revisions SET status = 'rescheduled', updated_at = CURRENT_TIMESTAMP WHERE id = ?",
    [id]
  );

  // Get the revision details
  const revisions = await dbSelect<Revision>(
    "SELECT * FROM revisions WHERE id = ?",
    [id]
  );
  const revision = revisions[0];

  // Create new revision with new date
  await dbExecute(
    "INSERT INTO revisions (entry_id, interval_days, due_date, status) VALUES (?, ?, ?, 'pending')",
    [revision.entry_id, revision.interval_days, newDate]
  );
}

// Calendar APIs
export async function getCalendarData(
  month: number,
  year: number
): Promise<CalendarDay[]> {
  const startDate = format(new Date(year, month - 1, 1), "yyyy-MM-dd");
  const endDate = format(new Date(year, month, 0), "yyyy-MM-dd");

  const revisions = await dbSelect<Revision>(
    "SELECT * FROM revisions WHERE due_date >= ? AND due_date <= ? ORDER BY due_date ASC",
    [startDate, endDate]
  );

  // Group revisions by date
  const revisionsByDate: Record<string, Revision[]> = {};
  revisions.forEach((revision) => {
    if (!revisionsByDate[revision.due_date]) {
      revisionsByDate[revision.due_date] = [];
    }
    revisionsByDate[revision.due_date].push(revision);
  });

  // Create calendar days
  const calendarDays: CalendarDay[] = [];
  const daysInMonth = new Date(year, month, 0).getDate();

  for (let day = 1; day <= daysInMonth; day++) {
    const date = format(new Date(year, month - 1, day), "yyyy-MM-dd");
    const dayRevisions = revisionsByDate[date] || [];

    let status: CalendarDay["status"] = "none";
    const today = format(new Date(), "yyyy-MM-dd");

    if (dayRevisions.length > 0) {
      if (dayRevisions.some((r) => r.status === "overdue")) {
        status = "overdue";
      } else if (
        dayRevisions.some((r) => r.status === "pending") &&
        date <= today
      ) {
        status = "due";
      } else if (dayRevisions.every((r) => r.status === "completed")) {
        status = "completed";
      } else {
        status = "future";
      }
    }

    calendarDays.push({
      date,
      revisions: dayRevisions,
      status,
    });
  }

  return calendarDays;
}

// History APIs
export async function getActivityLog(filters?: {
  subjectId?: number;
  startDate?: string;
  endDate?: string;
  activityType?: string;
}): Promise<ActivityLogWithDetails[]> {
  let query = "SELECT * FROM activity_log WHERE 1=1";
  const params: any[] = [];

  if (filters?.activityType) {
    query += " AND activity_type = ?";
    params.push(filters.activityType);
  }

  if (filters?.startDate) {
    query += " AND activity_date >= ?";
    params.push(filters.startDate);
  }

  if (filters?.endDate) {
    query += " AND activity_date <= ?";
    params.push(filters.endDate);
  }

  query += " ORDER BY activity_date DESC, created_at DESC";

  const activities = await dbSelect<ActivityLog>(query, params);

  const activitiesWithDetails = await Promise.all(
    activities.map(async (activity) => {
      const entry = await getEntryById(activity.entry_id);
      const subject = await getSubjectById(entry.subject_id);

      // Filter by subject if provided
      if (filters?.subjectId && subject.id !== filters.subjectId) {
        return null;
      }

      return {
        ...activity,
        entry,
        subject,
      };
    })
  );

  return activitiesWithDetails.filter(
    (a) => a !== null
  ) as ActivityLogWithDetails[];
}

// Settings APIs
export async function getSettings(): Promise<Record<string, string>> {
  const settings = await dbSelect<Setting>("SELECT * FROM settings", []);

  return settings.reduce(
    (acc, setting) => {
      acc[setting.key] = setting.value;
      return acc;
    },
    {} as Record<string, string>
  );
}

export async function updateSetting(key: string, value: string): Promise<void> {
  await dbExecute(
    "INSERT OR REPLACE INTO settings (key, value, updated_at) VALUES (?, ?, CURRENT_TIMESTAMP)",
    [key, value]
  );
}

// Update overdue revisions
export async function updateOverdueRevisions(): Promise<void> {
  const today = format(new Date(), "yyyy-MM-dd");

  await dbExecute(
    "UPDATE revisions SET status = 'overdue' WHERE due_date < ? AND status = 'pending'",
    [today]
  );
}

// Syllabus Management APIs
export async function getSyllabusItems(subjectId: number): Promise<any[]> {
  const items = await dbSelect<any>(
    `SELECT s.*,
      (SELECT COUNT(*) FROM entry_syllabus_links WHERE syllabus_item_id = s.id) as entry_count
     FROM syllabus_items s
     WHERE s.subject_id = ?
     ORDER BY s.sort_order, s.created_at`,
    [subjectId]
  );

  // Build tree structure
  const itemMap = new Map();
  const rootItems: any[] = [];

  // First pass: create map of all items
  items.forEach(item => {
    itemMap.set(item.id, {
      ...item,
      children: [],
      entry_count: item.entry_count || 0,
      completed_count: 0,
      progress_percentage: 0,
    });
  });

  // Second pass: build tree and calculate progress
  items.forEach(item => {
    const node = itemMap.get(item.id);
    if (item.parent_id === null) {
      rootItems.push(node);
    } else {
      const parent = itemMap.get(item.parent_id);
      if (parent) {
        parent.children.push(node);
      }
    }
  });

  // Third pass: calculate progress recursively
  function calculateProgress(node: any): { total: number; completed: number } {
    let total = 1;
    let completed = node.is_completed === 1 ? 1 : 0;

    if (node.children.length > 0) {
      node.children.forEach((child: any) => {
        const childProgress = calculateProgress(child);
        total += childProgress.total;
        completed += childProgress.completed;
      });
    }

    node.completed_count = completed;
    node.progress_percentage = total > 0 ? (completed / total) * 100 : 0;

    return { total, completed };
  }

  rootItems.forEach(root => calculateProgress(root));

  return rootItems;
}

export async function createSyllabusItem(data: {
  subject_id: number;
  parent_id: number | null;
  title: string;
  description: string | null;
  estimated_hours: number | null;
  due_date: string | null;
  sort_order?: number;
}): Promise<{ lastInsertId: number; rowsAffected: number }> {
  return await dbExecute(
    `INSERT INTO syllabus_items
     (subject_id, parent_id, title, description, estimated_hours, due_date, sort_order)
     VALUES (?, ?, ?, ?, ?, ?, ?)`,
    [
      data.subject_id,
      data.parent_id,
      data.title,
      data.description,
      data.estimated_hours,
      data.due_date,
      data.sort_order || 0,
    ]
  );
}

export async function updateSyllabusItem(
  id: number,
  data: {
    title?: string;
    description?: string | null;
    estimated_hours?: number | null;
    due_date?: string | null;
    is_completed?: number;
  }
): Promise<void> {
  const updates: string[] = [];
  const params: any[] = [];

  if (data.title !== undefined) {
    updates.push("title = ?");
    params.push(data.title);
  }
  if (data.description !== undefined) {
    updates.push("description = ?");
    params.push(data.description);
  }
  if (data.estimated_hours !== undefined) {
    updates.push("estimated_hours = ?");
    params.push(data.estimated_hours);
  }
  if (data.due_date !== undefined) {
    updates.push("due_date = ?");
    params.push(data.due_date);
  }
  if (data.is_completed !== undefined) {
    updates.push("is_completed = ?");
    params.push(data.is_completed);
  }

  if (updates.length > 0) {
    updates.push("updated_at = CURRENT_TIMESTAMP");
    params.push(id);

    await dbExecute(
      `UPDATE syllabus_items SET ${updates.join(", ")} WHERE id = ?`,
      params
    );
  }
}

export async function deleteSyllabusItem(id: number): Promise<void> {
  await dbExecute("DELETE FROM syllabus_items WHERE id = ?", [id]);
}

export async function toggleSyllabusCompletion(id: number, isCompleted: number): Promise<void> {
  await dbExecute(
    "UPDATE syllabus_items SET is_completed = ?, updated_at = CURRENT_TIMESTAMP WHERE id = ?",
    [isCompleted, id]
  );
}

export async function linkEntryToSyllabus(entryId: number, syllabusItemIds: number[]): Promise<void> {
  // First, remove existing links
  await dbExecute("DELETE FROM entry_syllabus_links WHERE entry_id = ?", [entryId]);

  // Then add new links
  for (const syllabusItemId of syllabusItemIds) {
    await dbExecute(
      "INSERT INTO entry_syllabus_links (entry_id, syllabus_item_id) VALUES (?, ?)",
      [entryId, syllabusItemId]
    );
  }
}

export async function getEntrySyllabusLinks(entryId: number): Promise<any[]> {
  return await dbSelect<any>(
    `SELECT s.* FROM syllabus_items s
     JOIN entry_syllabus_links l ON s.id = l.syllabus_item_id
     WHERE l.entry_id = ?`,
    [entryId]
  );
}

// PDF Management APIs
export async function getPdfAttachments(entryId: number): Promise<any[]> {
  return await dbSelect<any>(
    "SELECT * FROM pdf_attachments WHERE entry_id = ? ORDER BY created_at DESC",
    [entryId]
  );
}

export async function createPdfAttachment(data: {
  entry_id: number;
  file_name: string;
  file_path: string;
  file_size: number;
  page_count: number | null;
}): Promise<{ lastInsertId: number; rowsAffected: number }> {
  return await dbExecute(
    `INSERT INTO pdf_attachments (entry_id, file_name, file_path, file_size, page_count)
     VALUES (?, ?, ?, ?, ?)`,
    [data.entry_id, data.file_name, data.file_path, data.file_size, data.page_count]
  );
}

export async function updatePdfLastViewedPage(pdfId: number, pageNumber: number): Promise<void> {
  await dbExecute(
    "UPDATE pdf_attachments SET last_viewed_page = ? WHERE id = ?",
    [pageNumber, pdfId]
  );
}

export async function deletePdfAttachment(pdfId: number): Promise<void> {
  await dbExecute("DELETE FROM pdf_attachments WHERE id = ?", [pdfId]);
}

export async function getPdfById(pdfId: number): Promise<any | null> {
  const result = await dbSelect<any>(
    "SELECT * FROM pdf_attachments WHERE id = ?",
    [pdfId]
  );
  return result.length > 0 ? result[0] : null;
}

// Study Session Analytics APIs
export async function recordPomodoroSession(data: {
  session_type: "work" | "short_break" | "long_break";
  duration_minutes: number;
  subject_id: number | null;
  syllabus_item_id: number | null;
}): Promise<void> {
  await dbExecute(
    `INSERT INTO pomodoro_sessions (session_type, duration_minutes, subject_id, syllabus_item_id)
     VALUES (?, ?, ?, ?)`,
    [data.session_type, data.duration_minutes, data.subject_id, data.syllabus_item_id]
  );
}

export async function getStudyTimeBySubject(subjectId: number, days: number = 7): Promise<any> {
  const result = await dbSelect<any>(
    `SELECT
      COUNT(*) as session_count,
      SUM(duration_minutes) as total_minutes
     FROM pomodoro_sessions
     WHERE subject_id = ?
     AND session_type = 'work'
     AND completed_at >= datetime('now', '-${days} days')`,
    [subjectId]
  );
  return result[0];
}

export async function getAllSubjectsStudyTime(days: number = 7): Promise<any[]> {
  return await dbSelect<any>(
    `SELECT
      s.id,
      s.name,
      COUNT(ps.id) as session_count,
      COALESCE(SUM(ps.duration_minutes), 0) as total_minutes
     FROM subjects s
     LEFT JOIN pomodoro_sessions ps ON s.id = ps.subject_id AND ps.session_type = 'work'
       AND ps.completed_at >= datetime('now', '-${days} days')
     GROUP BY s.id, s.name
     ORDER BY total_minutes DESC`,
    []
  );
}

// ============= TAGS =============

export async function getAllTags() {
  return await dbSelect<any>("SELECT * FROM tags ORDER BY usage_count DESC, name ASC", []);
}

export async function getOrCreateTag(tagName: string): Promise<number> {
  const normalizedName = tagName.trim().toLowerCase();
  if (!normalizedName) throw new Error("Tag name cannot be empty");

  // Check if tag exists
  const existing = await dbSelect<any>("SELECT id FROM tags WHERE name = ?", [normalizedName]);

  if (existing.length > 0) {
    // Increment usage count
    await dbExecute("UPDATE tags SET usage_count = usage_count + 1 WHERE id = ?", [existing[0].id]);
    return existing[0].id;
  }

  // Create new tag
  const result = await dbExecute("INSERT INTO tags (name) VALUES (?)", [normalizedName]);
  return result.lastInsertId;
}

export async function linkTagsToEntry(entryId: number, tagNames: string[]) {
  // Remove existing tags for this entry
  await dbExecute("DELETE FROM entry_tags WHERE entry_id = ?", [entryId]);

  // Add new tags
  for (const tagName of tagNames) {
    if (tagName.trim()) {
      const tagId = await getOrCreateTag(tagName);
      await dbExecute(
        "INSERT OR IGNORE INTO entry_tags (entry_id, tag_id) VALUES (?, ?)",
        [entryId, tagId]
      );
    }
  }
}

export async function getEntryTags(entryId: number) {
  return await dbSelect<any>(
    `SELECT t.* FROM tags t
     INNER JOIN entry_tags et ON t.id = et.tag_id
     WHERE et.entry_id = ?
     ORDER BY t.name`,
    [entryId]
  );
}

// Daily Activity Tracking for Streaks
export async function updateDailyActivity(date: string) {
  // Calculate pomodoro minutes and count for the day
  const pomodoroData = await dbSelect<any>(
    `SELECT
      COUNT(*) as pomodoro_count,
      SUM(duration_minutes) as study_minutes
     FROM pomodoro_sessions
     WHERE session_type = 'work'
       AND DATE(completed_at) = ?`,
    [date]
  );

  // Count entries created on this day
  const entryData = await dbSelect<any>(
    `SELECT COUNT(*) as entry_count
     FROM entries
     WHERE DATE(study_date) = ?`,
    [date]
  );

  // Get unique subjects studied
  const subjectsData = await dbSelect<any>(
    `SELECT DISTINCT s.name
     FROM subjects s
     INNER JOIN entries e ON s.id = e.subject_id
     WHERE DATE(e.study_date) = ?`,
    [date]
  );

  const studyMinutes = pomodoroData[0]?.study_minutes || 0;
  const pomodoroCount = pomodoroData[0]?.pomodoro_count || 0;
  const entryCount = entryData[0]?.entry_count || 0;
  const subjectsStudied = subjectsData.map((s: any) => s.name).join(',');

  // Insert or update daily activity
  await dbExecute(
    `INSERT INTO daily_activity (activity_date, study_minutes, pomodoro_count, entry_count, subjects_studied, updated_at)
     VALUES (?, ?, ?, ?, ?, CURRENT_TIMESTAMP)
     ON CONFLICT(activity_date) DO UPDATE SET
       study_minutes = ?,
       pomodoro_count = ?,
       entry_count = ?,
       subjects_studied = ?,
       updated_at = CURRENT_TIMESTAMP`,
    [date, studyMinutes, pomodoroCount, entryCount, subjectsStudied, studyMinutes, pomodoroCount, entryCount, subjectsStudied]
  );
}

export async function getDailyActivities(startDate: string, endDate: string) {
  return await dbSelect<any>(
    `SELECT * FROM daily_activity
     WHERE activity_date BETWEEN ? AND ?
     ORDER BY activity_date DESC`,
    [startDate, endDate]
  );
}

export async function calculateStreaks() {
  // Get all activity dates in descending order
  const activities = await dbSelect<any>(
    `SELECT activity_date FROM daily_activity
     WHERE study_minutes > 0 OR entry_count > 0
     ORDER BY activity_date DESC`,
    []
  );

  if (activities.length === 0) {
    return {
      currentStreak: 0,
      longestStreak: 0,
      totalActiveDays: 0,
    };
  }

  const today = format(new Date(), 'yyyy-MM-dd');
  let currentStreak = 0;
  let longestStreak = 0;
  let tempStreak = 1;
  let previousDate: Date | null = null;

  // Check if today or yesterday has activity for current streak
  const latestActivityDate = activities[0].activity_date;
  const yesterday = format(addDays(new Date(), -1), 'yyyy-MM-dd');

  if (latestActivityDate === today || latestActivityDate === yesterday) {
    currentStreak = 1;

    // Count backwards from latest activity
    for (let i = 1; i < activities.length; i++) {
      const currentDate = parseISO(activities[i].activity_date);
      const prevDate = parseISO(activities[i - 1].activity_date);

      const diffDays = Math.round((prevDate.getTime() - currentDate.getTime()) / (1000 * 60 * 60 * 24));

      if (diffDays === 1) {
        currentStreak++;
      } else {
        break;
      }
    }
  }

  // Calculate longest streak
  for (let i = 0; i < activities.length; i++) {
    const currentDate = parseISO(activities[i].activity_date);

    if (previousDate) {
      const diffDays = Math.round((previousDate.getTime() - currentDate.getTime()) / (1000 * 60 * 60 * 24));

      if (diffDays === 1) {
        tempStreak++;
        longestStreak = Math.max(longestStreak, tempStreak);
      } else {
        tempStreak = 1;
      }
    } else {
      longestStreak = 1;
    }

    previousDate = currentDate;
  }

  return {
    currentStreak,
    longestStreak,
    totalActiveDays: activities.length,
  };
}
