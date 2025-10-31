import { Body, Controller, Delete, Get, Param, Patch, Post, Put, Query } from '@nestjs/common';
import { TasksService } from './tasks.service';
import { AuthUser } from '@/app/auth/decorators/auth-user.decorator';
import { User } from '../db/user.entity';
import {
    AssignUserDto,
    TaskCreateDto,
    TaskResponse,
    TasksPaginationDto,
} from '../../../../../libs/shared/src/tasks';
import { PaginationResponse } from '@workspace/shared';

@Controller('/tasks')
export class TaskController {
    constructor(private readonly taskSService: TasksService) {}

    @Get('/')
    async getMany(
        @Query() paginationDto: TasksPaginationDto
    ): Promise<PaginationResponse<TaskResponse>> {
        return await this.taskSService.getTasks(paginationDto);
    }
    @Get('/:id')
    async getOne(@AuthUser() user: User, @Param('id') id: number) {
        return this.taskSService.getOne(id);
    }

    @Post('/')
    async createTask(@AuthUser() user: User, @Body() task: TaskCreateDto) {
        return this.taskSService.createTask(task);
    }

    @Put('/:id')
    async updateTask(@AuthUser() user: User, @Param('id') id: number, @Body() task: TaskCreateDto) {
        return this.taskSService.updateTask(id, task);
    }
    @Patch('/:id/assign')
    async assignUser(
        @AuthUser() user: User,
        @Param('id') id: number,
        @Body() assignUserPayload: AssignUserDto
    ) {
        return this.taskSService.assignUser(id, assignUserPayload.assigneeId);
    }
    @Delete('/:id')
    async deleteTask(@AuthUser() user: User, @Param('id') id: number) {
        return this.taskSService.delete(id);
    }
}
