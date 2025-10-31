import {
    AssignUserDto,
    PaginationResponse,
    TaskCreateDto,
    TaskResponse,
    TasksPaginationDto,
} from '@workspace/shared';

import { $axios } from '../client';

export async function getMany(data: TasksPaginationDto) {
    return await $axios.get<PaginationResponse<TaskResponse>>(`/tasks/`, {
        params: data,
    });
}

export async function createOne(task: TaskCreateDto) {
    return $axios.post<TaskResponse>(`/tasks/`, task);
}

export async function getOne(id: number) {
    return $axios.get<TaskResponse>(`/tasks/${id}`);
}

export async function updateOne(id: number, task: TaskCreateDto) {
    return $axios.put<TaskResponse>(`/tasks/${id}`, task);
}
export async function assignUser(id: number, payload: AssignUserDto) {
    return $axios.patch<TaskResponse>(`/tasks/${id}/assign`, payload);
}
export async function deleteTask(id: number) {
    return $axios.delete(`/tasks/${id}`);
}
