import { Controller, Get, Query } from '@nestjs/common';
import { UsersService } from './users.service';
import { AuthUser } from '@/app/auth/decorators/auth-user.decorator';
import { User } from '@/app/db/user.entity';
import { UserProfileResponse, PaginationResponse, PaginationDto } from '@workspace/shared';

@Controller('/users')
export class UsersController {
    constructor(private readonly usersService: UsersService) {}

    @Get('/self')
    async getSelf(@AuthUser() user: User) {
        return this.usersService.getProfile(user);
    }

    @Get('/')
    async getMany(
        @Query() paginationDto: PaginationDto
    ): Promise<PaginationResponse<UserProfileResponse>> {
        return await this.usersService.getMany(paginationDto);
    }
}
