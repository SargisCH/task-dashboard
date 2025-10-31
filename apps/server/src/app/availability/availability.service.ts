import { Injectable, Logger } from '@nestjs/common';
import { Task } from '../db/task.entity';
import { Availability } from '../db/avilaibility.entity';
import { OnEvent } from '@nestjs/event-emitter';
import { TaskCreatePayload, TaskEvents, TaskUpdatePayload } from '@/events';

@Injectable()
export class AvailabilityService {
    private readonly logger = new Logger(AvailabilityService.name);

    @OnEvent(TaskEvents.TASK_CREATED, { async: true })
    async handleTaskCreated(payload: TaskCreatePayload) {
        const { taskId } = payload;
        try {
            const task = await Task.findOne({
                where: { id: taskId },
            });

            if (task) {
                await this.updateAvailability(task);
                this.logger.log(`Availability updated for task: ${taskId}`);
            }
        } catch (error) {
            this.logger.error(`Failed to update availability for task ${taskId}`, error);
        }
    }

    @OnEvent(TaskEvents.TASK_UPDATED, { async: true })
    async handleTaskUpdated(payload: TaskUpdatePayload) {
        const { taskId } = payload;
        this.logger.log(`Processing availability for updated task: ${taskId}`);

        try {
            const task = await Task.findOne({
                where: { id: taskId },
            });

            if (task) {
                await this.updateAvailability(task);
                this.logger.log(`Availability updated for task: ${taskId}`);
            }
        } catch (error) {
            this.logger.error(`Failed to update availability for task ${taskId}`, error);
        }
    }

    @OnEvent(TaskEvents.TASK_REASSIGNED, { async: true })
    async handleTaskReassigned({ taskId }: TaskCreatePayload) {
        try {
            const task = await Task.findOne({
                where: { id: taskId },
            });

            if (task) {
                await this.updateAvailability(task);
                this.logger.log(`Availability updated for reassigned task: ${taskId}`);
            }
        } catch (error) {
            this.logger.error(`Failed to update availability for task ${taskId}`, error);
        }
    }

    @OnEvent(TaskEvents.TASK_DELETED, { async: true })
    async handleTaskDeleted({ taskId }: TaskUpdatePayload) {
        this.logger.log(`Processing availability cleanup for deleted task: ${taskId}`);

        try {
            await this.removeAvailability(taskId);
            this.logger.log(`Availability removed for task: ${taskId}`);
        } catch (error) {
            this.logger.error(`Failed to remove availability for task ${taskId}`, error);
        }
    }

    private async updateAvailability(task: Task): Promise<void> {
        await this.removeAvailability(task.id);
        const availability = new Availability();
        availability.userId = task.assigneeId;
        availability.startDate = task.startDate;
        availability.endDate = task.endDate;
        availability.taskId = task.id;

        await availability.save();
    }

    private async removeAvailability(taskId: number): Promise<void> {
        await Availability.delete({ taskId: taskId });
    }
}
