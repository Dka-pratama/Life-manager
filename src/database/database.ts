import * as SQLite from 'expo-sqlite';

const db = SQLite.openDatabaseSync('life_manager.db');

db.execSync('PRAGMA foreign_keys = ON;');

export default db;