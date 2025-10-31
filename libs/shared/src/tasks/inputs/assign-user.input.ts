import { number, object, ObjectSchema } from 'yup';
import { UseSchema } from '@workspace/shared';

export const assignUserSchema: ObjectSchema<AssignUserDto> = object().shape({
    assigneeId: number().required(),
});

@UseSchema(assignUserSchema)
export class AssignUserDto {
    assigneeId: number;
}
