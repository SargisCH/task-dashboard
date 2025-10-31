import {
    PaginationDto,
    PaginationResponse,
    UserCreateDto,
    UserProfileResponse,
} from '@workspace/shared';

import { $axios } from '../client';

export async function getSelf() {
    return await $axios.get<UserProfileResponse>('/users/self');
}

export async function createOne(data: UserCreateDto) {
    return await $axios.post<UserProfileResponse>('/users/', data);
}

export async function getMany(data: PaginationDto) {
    return await $axios.get<PaginationResponse<UserProfileResponse>>(`/users/`, {
        params: data,
    });
}
