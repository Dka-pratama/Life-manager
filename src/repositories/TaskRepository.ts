import db from '../database/database';
import { Task, CreateTaskData, UpdateTaskData } from '../types/task';


export async function createTask(data: CreateTaskData) {
  const now = new Date().toISOString();

  const result = await db.runAsync(
    `
      INSERT INTO tasks (
        title,
        description,
        due_date,
        created_at,
        updated_at
      )
      VALUES (?, ?, ?, ?, ?)
    `,
    [
      data.title,
      data.description ?? null,
      data.dueDate ?? null,
      now,
      now,
    ]
  );

  return result.lastInsertRowId;
}

export async function getTasks() {
  const tasks = await db.getAllAsync<Task>(`
    SELECT * FROM tasks
    ORDER BY due_date IS NULL, due_date ASC, created_at DESC
  `);
  return tasks;
};

export async function getTaskById(id: number) {

  const task = await db.getFirstAsync(
    `SELECT * FROM tasks WHERE id = ?`,
    [id]
  );
  return task;
}

export async function updateTask(id:number, data: UpdateTaskData) {
    const now = new Date().toISOString();
    const result = await db.runAsync(
        `
        UPDATE tasks SET
            title = COALESCE(?, title),
            description = COALESCE(?, description),
            due_date = COALESCE(?, due_date),
            status = COALESCE(?, status),
            updated_at = ?
        WHERE id = ?
        `,
        [
            data.title ?? null,
            data.description ?? null,
            data.dueDate ?? null,
            data.status ?? null,
            now,
            id
        ]
    );
    return result.changes > 0;
}

export async function deleteTask(id: number) {
    const result = await db.runAsync(
        `DELETE FROM tasks WHERE id = ?`,
        [id]
    );
    return result.changes > 0;
}


