import db from './database';

export async function runMigrations() {
    await db.execAsync(`
        CREATE TABLE IF NOT EXISTS settings (
            key TEXT PRIMARY KEY,
            value TEXT NOT NULL
        );
        
        CREATE TABLE IF NOT EXISTS tasks (
            id INTEGER PRIMARY KEY AUTOINCREMENT,
            title TEXT NOT NULL,
            description TEXT,
            due_date TEXT,
            category TEXT DEFAULT 'personal',
            priority TEXT DEFAULT 'med',
            status TEXT DEFAULT 'pending',
            created_at TEXT,
            updated_at TEXT
        );

        CREATE TABLE IF NOT EXISTS notes (
            id INTEGER PRIMARY KEY AUTOINCREMENT,
            title TEXT NOT NULL,
            content TEXT,
            created_at TEXT,
            updated_at TEXT
        );

        CREATE TABLE IF NOT EXISTS task_notes (
            task_id INTEGER,
            note_id INTEGER,
            PRIMARY KEY (task_id, note_id),
            FOREIGN KEY (task_id) REFERENCES tasks(id) ON DELETE CASCADE,
            FOREIGN KEY (note_id) REFERENCES notes(id) ON DELETE CASCADE
        );

        CREATE TABLE IF NOT EXISTS habits (
            id INTEGER PRIMARY KEY AUTOINCREMENT,
            name TEXT NOT NULL,
            icon TEXT,
            color TEXT,
            target_per_day INTEGER,
            created_at TEXT
        );

        CREATE TABLE IF NOT EXISTS habit_logs (
            id INTEGER PRIMARY KEY AUTOINCREMENT,
            habit_id INTEGER,
            progress REAL DEFAULT 0,
            completed_date TEXT,
            FOREIGN KEY (habit_id) REFERENCES habits(id) ON DELETE CASCADE,
            UNIQUE(habit_id, completed_date)
        );

        CREATE TABLE IF NOT EXISTS finance_categories (
            id INTEGER PRIMARY KEY AUTOINCREMENT,
            name TEXT NOT NULL,
            type TEXT NOT NULL,
            icon TEXT,
            color TEXT,
            create_at TEXT
        );

        CREATE TABLE IF NOT EXISTS finance_transactions (
            id INTEGER PRIMARY KEY AUTOINCREMENT,
            category_id INTEGER,
            title TEXT NOT NULL,
            amount REAL NOT NULL,
            transaction_date TEXT NOT NULL,
            created_at TEXT,
            updated_at TEXT,
            FOREIGN KEY (category_id) REFERENCES finance_categories(id) ON DELETE SET NULL
        );
    `);

    // Add category & priority columns to existing tasks tables
    try {
        await db.execAsync(`ALTER TABLE tasks ADD COLUMN category TEXT DEFAULT 'personal'`);
    } catch (_) {}
    try {
        await db.execAsync(`ALTER TABLE tasks ADD COLUMN priority TEXT DEFAULT 'med'`);
    } catch (_) {}
}