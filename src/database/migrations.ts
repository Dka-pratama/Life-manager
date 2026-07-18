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

    // Seed default finance categories if empty
    const catCount = await db.getFirstAsync<{ count: number }>(`SELECT COUNT(*) as count FROM finance_categories`);
    if (catCount && catCount.count === 0) {
        const now = new Date().toISOString();
        const defaultCategories = [
            // Expense
            { name: "Food", type: "expense", icon: "restaurant", color: "#fb923c" },
            { name: "Transport", type: "expense", icon: "car", color: "#60a5fa" },
            { name: "Shopping", type: "expense", icon: "cart", color: "#f472b6" },
            { name: "Bills", type: "expense", icon: "flash", color: "#fbbf24" },
            { name: "Entertainment", type: "expense", icon: "film", color: "#a78bfa" },
            { name: "Health", type: "expense", icon: "medkit", color: "#ef4444" },
            { name: "Education", type: "expense", icon: "school", color: "#34d399" },
            { name: "Other", type: "expense", icon: "wallet", color: "#908fa0" },
            // Income
            { name: "Salary", type: "income", icon: "briefcase", color: "#4ade80" },
            { name: "Freelance", type: "income", icon: "laptop", color: "#2dd4bf" },
            { name: "Gift", type: "income", icon: "gift", color: "#f472b6" },
            { name: "Other", type: "income", icon: "wallet", color: "#908fa0" },
        ];
        for (const cat of defaultCategories) {
            await db.runAsync(
                `INSERT INTO finance_categories (name, type, icon, color, create_at) VALUES (?, ?, ?, ?, ?)`,
                [cat.name, cat.type, cat.icon, cat.color, now]
            );
        }
    }
}