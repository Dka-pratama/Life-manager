export type FinanceCategoryType =
    | 'income'
    | 'expense';

export type FinanceCategory = {
    id: number;
    name: string;
    type: FinanceCategoryType;
    icon: string | null;
    color: string | null;
    create_at: string
}

export type CreateFinanceCategoryData = {
    name: string;
    type: FinanceCategoryType;
    icon?: string;
    color?: string;
}

export type UpdateFinanceCategoryData = {
    name?: string;
    type?: FinanceCategoryType;
    icon?: string;
    color?: string;
}