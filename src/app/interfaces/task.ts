export interface ITask {
    id?: number;
    parent_id?: number;
    list_id?: number;
    task_title?: string;
    task_description?: string;
    is_completed?: boolean;
    due_date?: Date;
    created_at?: Date;
    modified_at?: Date;
    due_time?: string;
    order_id?: number;
}
