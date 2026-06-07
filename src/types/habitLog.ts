export type HabitLog = {
    id: number;
    habit_id: number;
    progress: number;
    completed_date: string;
}

export type CreateHabitLogData = {
    habit_id: number;
    progress?: number;
    completed_date: string;
}

export type UpdateHabitLogData = {
    progress?: number;
    completed_date?: string;
}