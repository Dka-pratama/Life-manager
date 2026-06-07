export type FinanceTransaction = {
    id: number;
    category_id: number | null;
    title: string;
    amount: number;
    transaction_date: string;
    created_at: string;
    updated_at: string;
}

export type CreateFinanceTransactionData = {
    category_id?: number;
    title: string;
    amount: number;
    transaction_date: string;
}

export type UpdateFinanceTransactionData = {
    category_id?: number;
    title?: string;
    amount?: number;
    transaction_date?: string;
}