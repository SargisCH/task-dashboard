import { Status } from '../../common';
import { UserProfileResponse } from '../../users';

export interface TaskResponse {
    id: number;
    title: string;
    status: Status;
    description: string;
    assigneeId?: number;
    assignee?: UserProfileResponse;
    createdAt: Date;
    startDate: Date;
    endDate: Date;
}
