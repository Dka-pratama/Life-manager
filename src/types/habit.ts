export type Habit = {
    id: number,
    name: string,
    icon: string | null,
    color: string | null,
    target_per_day: number,
    created_at: string
}

export type CreateHabitsData = {
    name:string,
    icon?:string,
    color?:string,
    target_per_day?: number,
}

export type UpdateHabitData = {
    name?: string;
    icon?: string;
    color?: string;
    target_per_day?: number;
}