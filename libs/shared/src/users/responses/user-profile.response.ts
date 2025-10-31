import { Role } from '../../common';

export interface UserProfileResponse {
    id: number;
    role: Role;
    email: string;
    firstName: string;
    lastName: string;
    position: string;
    isActive: boolean;
    createdAt: Date;
}
