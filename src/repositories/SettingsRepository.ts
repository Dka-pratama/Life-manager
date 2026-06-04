import db from '../database/database';

// ambil nilai setting berdasarkan key
export async function getSetting(key: string){
    return await db.getFirstAsync<{value: string}>(
        'SELECT value FROM settings WHERE key = ?',
        [key]
    );
}

// simpan atau update nilai setting berdasarkan key
export async function setSetting(
    key: string, 
    value: string
){
    await db.runAsync(
        `INSERT OR REPLACE INTO settings 
        (key, value) 
        VALUES (?, ?)
        `,
        [key, value]
    );
}