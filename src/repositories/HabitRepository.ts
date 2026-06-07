import db from "@/database/database";
import { Habit, CreateHabitsData, UpdateHabitData } from "@/types/habit";

export async function createHabit(data : CreateHabitsData){
    const now = new Date().toISOString();

    const result = await db.runAsync(
        `
        INSERT INTO habits (
            name,
            icon,
            color,
            target_per_day,
            created_at
            )
            VALUES (?, ?, ?, ?, ?)
        `,
        [
            data.name,
            data.icon ?? null,
            data.color ?? null,
            data.target_per_day ?? 0,
            now
        ]
    );
    return result.lastInsertRowId;
}

export async function getHabits() {
    const habits = await db.getAllAsync<Habit>(`
        SELECT * FROM habits`)
        return habits;
}

export async function getHabitById(id:number) {
    const habits = await db.getFirstAsync<Habit>(`
        SELECT * FROM habits WHERE id = ?
        `, [id]);
    return habits
}

export async function updateHabit(id:number, data:UpdateHabitData) {
    const result = await db.runAsync(`
        UPDATE habits SET
            name = COALESCE(?, name),
            icon = COALESCE(?, icon),
            color = COALESCE(?, color),
            target_per_day = COALESCE(?, target_per_day)
        WHERE id = ?`,
    [
        data.name ?? null,
        data.icon ?? null,
        data.color ?? null,
        data.target_per_day ?? null,
        id
    ]);
    return result.changes > 0;
}

export async function deleteHabit(id: number) {
    const result = await db.runAsync(`
        DELETE FROM habits WHERE id = ?`,
    [id])
    return result.changes > 0;
}