import { Role, UserCreateDto } from '@workspace/shared';

export const usersSeedData: UserCreateDto[] = [
    {
        email: 'admin@admin.com',
        password: '123456',
        role: Role.Admin,
        firstName: 'John',
        lastName: 'Doe',
    },
    {
        email: 'user1@test-main.com',
        password: '123456',
        role: Role.User,
        firstName: 'John 2',
        lastName: 'Doe 2',
    },
    {
        email: 'user2@test-main.com',
        password: '123456',
        role: Role.User,
        firstName: 'John 3',
        lastName: 'Doe 3',
    },
    {
        email: 'user3@test-main.com',
        password: '123456',
        role: Role.User,
        firstName: 'John 4',
        lastName: 'Doe 4',
    },
    {
        email: 'user4@test-main.com',
        password: '123456',
        role: Role.User,
        firstName: 'John 5',
        lastName: 'Doe 5',
    },
    {
        email: 'user5@test-main.com',
        password: '123456',
        role: Role.User,
        firstName: 'John 6',
        lastName: 'Doe 6',
    },
];
