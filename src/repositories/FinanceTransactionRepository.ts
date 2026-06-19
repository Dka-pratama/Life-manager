import db from "@/database/database";
import { FinanceTransaction, CreateFinanceTransactionData, UpdateFinanceTransactionData } from "@/types/financeTransaction";

export async function CreateFinanceTransaction(data: CreateFinanceTransactionData) {
    const now = new Date().toISOString();
    const result = await db.runAsync(
        `INSERT INTO finance_transactions (
        category_id,
        title,
        amount,
        transaction_date,
        created_at
        ) VALUES (
         ?, ?, ?, ?, ?)`, [
            data.category_id ?? null,
            data.title,
            data.amount,
            data.transaction_date,
            now
         ]
    )
    return result.lastInsertRowId;
}

export async function getFinanceTransactions() {
    return await db.getAllAsync<FinanceTransaction>(`
        SELECT
            ft.*,
            fc.name AS category_name,
            fc.icon,
            fc.color,
            fc.type
        FROM finance_transactions ft
        JOIN finance_categories fc
            ON ft.category_id = fc.id
        ORDER BY ft.transaction_date DESC
    `);
}

export async function getFinanceTransactionById(id: number) {
    return await db.getFirstAsync<FinanceTransaction>(`
        SELECT
            ft.*,
            fc.name AS category_name,
            fc.icon,
            fc.color,
            fc.type
        FROM finance_transactions ft
        JOIN finance_categories fc
            ON ft.category_id = fc.id
        WHERE ft.id = ?`, [id])
}

export async function getTransactionByCategory(category_id: number) {
    return await db.getAllAsync<FinanceTransaction>(`
        SELECT * FROM finance_transactions
         WHERE category_id = ?`, [ category_id])
}

export async function UpdateFinanceTransaction(id: number, data: UpdateFinanceTransactionData) {
    const now = new Date().toISOString();
    const result = await db.runAsync(`
        UPDATE finance_transactions SET
            category_id = COALESCE(?, category_id),
            title = COALESCE(?, title),
            amount = COALESCE(?, amount),
            transaction_date = COALESCE(?, transaction_date),
            updated_at = COALESCE(?, updated_at)
        WHERE id = ?`, [
            data.category_id ?? null,
            data.title ?? null,
            data.amount ?? null,
            data.transaction_date ?? null,
            now,
            id
        ])
    return result.changes > 0
}

export async function DeleteFinanceTransaction(id: number) {
    const result = await db.runAsync(`
        DELETE FROM finance_transactions WHERE id = ?`, [id])
    return result.changes > 0
}