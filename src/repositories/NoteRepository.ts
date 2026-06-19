import db from "@/database/database";
import { Note, CreateNoteData, UpdateNoteData } from "@/types/note";

export async function CreateNote(data: CreateNoteData) {
    const now = new Date().toISOString();
    const result = await db.runAsync(
        `
        INSERT INTO notes (
            title,
            content,
            created_at
            )
            VALUES (?, ?, ?)
        `,
        [
            data.title,
            data.content ?? null,
            now
        ]
    );
    return result.lastInsertRowId;
}

export async function getNotes() {
    const result = await db.getAllAsync<Note>(
        `SELECT * FROM notes`
    );
    return result
}

export async function getNoteById( id: number) {
    const result = await db.getFirstAsync<Note>(
        `SELECT * FROM notes WHERE id = ?`, [id]
    );
    return result;
}

export async function UpdateNote(id : number, data: UpdateNoteData){
    const now = new Date().toISOString();
    const result = await db.runAsync(`
        UPDATE notes SET
            title = COALESCE(?, title),
            content = COALESCE(?, content),
            updated_at = COALESCE(?, updated_at)
        WHERE id = ?`,
    [
        data.title ?? null,
        data.content ?? null,
        data.updated_at ?? null,
        id
    ]);
    return result.changes > 0;
}

export async function DeleteNote(id: number) {
    const result = await db.runAsync(
        `DELETE FROM notes WHERE id = ?`, [id]
    )
    return result.changes > 0;
}