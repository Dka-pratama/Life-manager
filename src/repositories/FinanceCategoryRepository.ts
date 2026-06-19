import db from "@/database/database";
import { FinanceCategory, CreateFinanceCategoryData, UpdateFinanceCategoryData } from "@/types/financeCategorie";

export async function CreateFinanceCategory(data: CreateFinanceCategoryData) {
    const now = new Date().toISOString()
    
    const result = await db.runAsync(
        `INSERT INTO finance_categories (
        name,
        type,
        icon,
        color,
        create_at) VALUES (
        ?, ?, ?, ?, ?)`,[
            data.name,
            data.type,
            data.icon ?? null,
            data.color ?? null,
            now
        ]
    );
    return result.lastInsertRowId;
}

export async function getFinanceCategories() {
    const result = await db.getAllAsync<FinanceCategory>(
        `SELECT * FROM finance_categories`
    );
    return result;
}

export async function getFinanceCategoryById(id: number) {
    const result = await db.getFirstAsync<FinanceCategory>(
        `SELECT * FROM finance_categories WHERE id = ?`, [id]
    )
    return result
}

export async function UpdateFinanceCategory(id: number, data: UpdateFinanceCategoryData) {
    const result = await db.runAsync(
        `UPDATE finance_categories SET
            name = COALESCE(?, name),
            type = COALESCE(?, type),
            icon = COALESCE(?, icon),
            color = COALESCE(?, color)
        WHERE id = ?`, [
            data.name ?? null,
            data.type ?? null,
            data.icon ?? null,
            data.color ?? null,
            id
        ]
    )
    return result.changes > 0;
}

export async function DeleteFinanceCategory(id: number){
    const result = await db.runAsync(
        `DELETE FROM finance_categories WHERE id = ?`, [id]
    )
    return result.changes > 0;
}