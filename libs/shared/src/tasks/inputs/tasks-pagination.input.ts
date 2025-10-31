import { bool, number, object, ObjectSchema, string } from 'yup';
import { UseSchema } from '@workspace/shared';

export const tasksPaginationDtoSchema: ObjectSchema<TasksPaginationDto> = object().shape({
    page: number().optional().default(1).min(1),
    take: number().optional().default(10).min(1).max(50),
    sortBy: string().optional(),
    descending: bool().optional(),
    filter: object()
        .shape({
            title: string().optional(),
            description: string().optional(),
            assigneeId: number().optional(),
        })
        .optional(),
});

@UseSchema(tasksPaginationDtoSchema)
export class TasksPaginationDto {
    page?: number;
    take?: number;
    sortBy?: string;
    descending?: boolean;
    filter?: {
        title?: string;
        description?: string;
        assigneeId?: number;
    };
}
