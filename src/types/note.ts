export type Note = {
    id: number;
    title: string;
    content: string | null;
    created_at: string;
    updated_at: string;
}

export type CreateNoteData = {
    title: string;
    content?: string;
}

export type UpdateNoteData = {
    title?: string;
    content?: string;
}