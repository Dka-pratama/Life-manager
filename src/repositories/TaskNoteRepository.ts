import db from "@/database/database";
import { TaskNote, CreateTaskNoteData } from "@/types/taskNote";

export async function CreateTaskNote(data:CreateTaskNoteData) {
    const result = await db.runAsync(
        `INSERT INTO task_notes (
            task_id,
            note_id
        )
        VALUES (?, ?)`, [
            data.task_id,
            data.note_id
        ]
    );
    return result.changes > 0;
}

export async function getNotesByTaskId(taskId: number) {
    return await db.getAllAsync(
        `SELECT n.*
        FROM notes n
        JOIN task_notes tn
            ON n.id = tn.note_id
        WHERE tn.task_id = ?`, [taskId]
    );
}

export async function getTasksByNoteId(noteId: number) {
    return await db.getAllAsync (
        `SELECT t.*
        FROM tasks t
        JOIN task_notes tn
            ON t.id = tn.task_id
        WHERE tn.note_id = ?`, [noteId]
    );
}

export async function deleteTaskNote(data: TaskNote) {
    const result = await db.runAsync(
        `DELETE FROM task_notes
        WHERE task_id = ?
        AND note_id = ?`, [data.task_id, data.note_id]
    )
    return result.changes > 0
}

export async function taskNoteExists(data: TaskNote) {
    const result = await db.getFirstAsync(
        `SELECT *
        FROM task_notes
        WHERE task_id = ?
        AND note_id = ?`, [data.task_id, data.note_id]
    );
    // Mengubah nilai jadi boolean
    return !!result;
}