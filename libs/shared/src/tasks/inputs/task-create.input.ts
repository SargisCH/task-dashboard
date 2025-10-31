import { date, mixed, number, object, ObjectSchema, string } from 'yup';
import { Status, UseSchema } from '@workspace/shared';

export const taskCreateSchema: ObjectSchema<TaskCreateDto> = object().shape({
    title: string().required().trim(),
    description: string().required().trim(),
    assigneeId: number().optional().nullable(),
    status: mixed<Status>().oneOf(Object.values(Status)).optional(),
    startDate: date().required(),
    endDate: date().required(),
});

@UseSchema(taskCreateSchema)
export class TaskCreateDto {
    title: string;
    description: string;
    status?: Status;
    assigneeId?: number;
    startDate: Date;
    endDate: Date;
}
