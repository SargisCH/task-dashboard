import { ConflictException, Injectable, NotFoundException } from '@nestjs/common';
import { User } from '@/app/db/user.entity';
import { hashPassword } from '@/app/auth/utils/hash-password';
import { ConfigService } from '@nestjs/config';
import {
    UserProfileResponse,
    UserCreateDto,
    PaginationResponse,
    PaginationDto,
} from '@workspace/shared';

@Injectable()
export class UsersService {
    constructor(private readonly configService: ConfigService) {}

    getProfile(user: User): UserProfileResponse {
        return user;
    }

    async createOne(userCreateDto: UserCreateDto): Promise<UserProfileResponse> {
        const countSameEmailUser = await User.countBy({ email: userCreateDto.email });

        if (countSameEmailUser > 0)
            throw new ConflictException('A user with this email address already exists');

        const user: User = new User();

        user.email = userCreateDto.email;
        user.hash = hashPassword(
            userCreateDto.password,
            this.configService.get<string>('secrets.pwdsalt')
        );
        user.firstName = userCreateDto.firstName;
        user.lastName = userCreateDto.lastName;
        if (userCreateDto.role) user.role = userCreateDto.role;

        await user.save();
        return this.getProfile(user);
    }

    async getMany(paginationDto: PaginationDto): Promise<PaginationResponse<UserProfileResponse>> {
        const queryBuilder = User.createQueryBuilder('users');

        if (paginationDto.filter)
            queryBuilder.where(
                `LOWER(CONCAT(users.firstName, ' ', users.lastName, ' ', users.email)) LIKE :filter`,
                {
                    filter: `%${paginationDto.filter.toLowerCase()}%`,
                }
            );

        queryBuilder.take(paginationDto.take).skip((paginationDto.page - 1) * paginationDto.take);

        switch (paginationDto.sortBy) {
            case 'name':
                queryBuilder.addOrderBy(
                    'users.firstName',
                    paginationDto.descending ? 'DESC' : 'ASC'
                );
                queryBuilder.addOrderBy(
                    'users.lastName',
                    paginationDto.descending ? 'DESC' : 'ASC'
                );
                break;
            case 'role':
                queryBuilder.addOrderBy('users.role', paginationDto.descending ? 'DESC' : 'ASC');
                break;
            case 'createdAt':
                queryBuilder.addOrderBy(
                    'users.createdAt',
                    paginationDto.descending ? 'DESC' : 'ASC'
                );
                break;
            default:
                queryBuilder.addOrderBy('users.role', 'ASC');
        }

        const [foundUsers, total] = await queryBuilder.getManyAndCount();

        return {
            page: paginationDto.page,
            pages: Math.ceil(total / paginationDto.take),
            total: total,
            elements: foundUsers.map(this.getProfile.bind(this)),
        };
    }

    async getOne(id: number): Promise<UserProfileResponse> {
        const foundUser = await User.findOneBy({ id });

        if (!foundUser) throw new NotFoundException();
        return this.getProfile(foundUser);
    }
}
