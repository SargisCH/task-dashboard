import { mixed, object, ObjectSchema, string } from 'yup';
import { UseSchema } from '@workspace/shared';
import { Role } from '../../common';

export const userCreateSchema: ObjectSchema<UserCreateDto> = object().shape({
    email: string().required().email().lowercase().trim(),
    password: string().required().min(6),
    firstName: string().required().trim(),
    lastName: string().required().trim(),
    role: mixed<Role>().optional().oneOf(Object.values(Role)),
});

@UseSchema(userCreateSchema)
export class UserCreateDto {
    email: string;
    password: string;
    firstName: string;
    lastName: string;
    role?: Role;
}
