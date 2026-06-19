import db from "@/database/database";
import { HabitLog, CreateHabitLogData, UpdateHabitLogData } from "@/types/habitLog";

export async function saveHabitProgress(data: CreateHabitLogData) {
    const existing = await db.getFirstAsync<HabitLog>(
        `SELECT id
        FROM habit_logs
        WHERE habit_id = ?
        AND completed_date = ?`,
        [
            data.habit_id,
            data.completed_date
        ]
    );

    if(existing) {
        await db.runAsync(
            `UPDATE habit_logs
            SET progress = ?
            WHERE habit_id = ?
            AND completed_date = ?`,
            [
                data.progress ?? null,
                data.habit_id,
                data.completed_date
            ]
        );
        return existing.id;
    }

    const result = await db.runAsync(
        `INSERT INTO habit_logs (
            habit_id,
            progress,
            completed_date)
        VALUES (?, ?, ?)`, [
            data.habit_id,
            data.progress ?? null,
            data.completed_date
        ]
    )
    return result.lastInsertRowId
}

export async function getHabitLogsByHabitId(
    habitId: number
) {
    return await db.getAllAsync<HabitLog>(
        `SELECT *
         FROM habit_logs
         WHERE habit_id = ?
         ORDER BY completed_date DESC`,
        [habitId]
    );
}

export async function getHabitLogByDate(
    habitId: number,
    date: string
) {
    return await db.getFirstAsync<HabitLog>(
        `SELECT *
         FROM habit_logs
         WHERE habit_id = ?
         AND completed_date = ?`,
        [habitId, date]
    );
}

export async function deleteHabitLog(id: number) {
    await db.runAsync(
        `DELETE FROM habit_logs
         WHERE id = ?`,
        [id]
    );
}