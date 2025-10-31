export enum TaskEvents {
    TASK_CREATED = 'task.created',
    TASK_UPDATED = 'task.updated',
    TASK_DELETED = 'task.deleted',
    TASK_REASSIGNED = 'task.reassigned',
}

export interface TaskCreatePayload {
    taskId: number;
}
export type TaskUpdatePayload = TaskCreatePayload;
