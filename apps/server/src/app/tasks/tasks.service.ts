import { ConflictException, Injectable } from '@nestjs/common';
import {
    PaginationResponse,
    TaskCreateDto,
    TaskResponse,
    TasksPaginationDto,
} from '@workspace/shared';
import { Task } from '../db/task.entity';
import { Availability } from '../db/avilaibility.entity';
import { EventEmitter2 } from '@nestjs/event-emitter';
import { TaskEvents } from '@/events';

@Injectable()
export class TasksService {
    constructor(private eventEmitter: EventEmitter2) {}

    async getTasks(paginationDto: TasksPaginationDto): Promise<PaginationResponse<TaskResponse>> {
        const queryBuilder = Task.createQueryBuilder('tasks');
        if (paginationDto.filter?.title)
            queryBuilder.where(`MATCH(tasks.title) AGAINST (:title IN BOOLEAN MODE)`, {
                title: `${paginationDto.filter.title.toLowerCase()}*`,
            });
        if (paginationDto.filter?.description)
            queryBuilder.andWhere(`LOWER(tasks.description) LIKE :description`, {
                description: `%${paginationDto.filter.description.toLowerCase()}%`,
            });
        if (paginationDto.filter?.assigneeId)
            queryBuilder.andWhere(`tasks.assigneeId = :assigneeId`, {
                assigneeId: paginationDto.filter.assigneeId,
            });

        queryBuilder.take(paginationDto.take).skip((paginationDto.page - 1) * paginationDto.take);

        switch (paginationDto.sortBy) {
            case 'title':
                queryBuilder.addOrderBy('tasks.title', paginationDto.descending ? 'DESC' : 'ASC');
                break;
            case 'createdAt':
                queryBuilder.addOrderBy(
                    'tasks.createdAt',
                    paginationDto.descending ? 'DESC' : 'ASC'
                );
                break;
            default:
                queryBuilder.addOrderBy('tasks.title', 'ASC');
        }

        const [foundTasks, total] = await queryBuilder.getManyAndCount();

        return {
            page: paginationDto.page,
            pages: Math.ceil(total / paginationDto.take),
            total: total,
            elements: foundTasks,
        };
    }
    getOne(id: number): Promise<TaskResponse> {
        return Task.findOneBy({ id });
    }
    async createTask(task: TaskCreateDto): Promise<TaskResponse> {
        const newTask = new Task();
        newTask.title = task.title;
        newTask.description = task.description;
        newTask.status = task.status;
        newTask.assigneeId = task.assigneeId;
        newTask.startDate = task.startDate;
        newTask.endDate = task.endDate;
        if (task.startDate >= task.endDate) {
            throw new ConflictException('Start date must be before end date');
        }
        if (task.assigneeId) {
            await this.checkUserAvailability(task.assigneeId, task.startDate, task.endDate);
        }

        const createdTask = await newTask.save();
        this.eventEmitter.emit(TaskEvents.TASK_CREATED, { taskId: createdTask.id });
        return createdTask;
    }
    async updateTask(id: number, task: TaskCreateDto): Promise<TaskResponse> {
        const taskDB = await Task.findOneBy({ id });
        if (task.assigneeId && taskDB.assigneeId !== task.assigneeId) {
            await this.checkUserAvailability(task.assigneeId, task.startDate, task.endDate);
            this.eventEmitter.emit(TaskEvents.TASK_UPDATED, { taskId: id });
        }
        await Task.update(id, task);
        return Task.findOneBy({ id });
    }
    async assignUser(id: number, assigneeId: number): Promise<TaskResponse> {
        const taskDB = await Task.findOneBy({ id });
        if (assigneeId === taskDB.assigneeId) {
            return taskDB;
        }

        await this.checkUserAvailability(taskDB.assigneeId, taskDB.startDate, taskDB.endDate);
        this.eventEmitter.emit(TaskEvents.TASK_REASSIGNED, { taskId: id });
        await Task.update(id, { assigneeId });
        return Task.findOneBy({ id });
    }

    async delete(id: number): Promise<void> {
        await Task.delete(id);
        this.eventEmitter.emit(TaskEvents.TASK_DELETED, { taskId: id });
    }

    async checkUserAvailability(userId: number, startDate: Date, endDate: Date): Promise<void> {
        const queryBuilderAvailability = Availability.createQueryBuilder('availability')
            .where('availability.userId = :userId', { userId })
            .andWhere('(availability.startDate < :endDate AND availability.endDate > :startDate)', {
                startDate,
                endDate,
            });
        const conflictingAvailability = await queryBuilderAvailability.getOne();
        if (conflictingAvailability) {
            throw new ConflictException('User is not available during the specified time period');
        }
    }
}
