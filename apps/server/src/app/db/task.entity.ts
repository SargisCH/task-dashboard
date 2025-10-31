import {
    BaseEntity,
    Column,
    CreateDateColumn,
    Entity,
    Index,
    JoinColumn,
    ManyToOne,
    PrimaryGeneratedColumn,
} from 'typeorm';
import { User } from './user.entity';
import { Status } from '@workspace/shared';

@Entity({ name: 'tasks' })
export class Task extends BaseEntity {
    @PrimaryGeneratedColumn()
    id: number;

    @Index('IDX_TASK_TITLE_FULLTEXT', ['title'], { fulltext: true })
    @Column()
    title: string;

    @Column()
    description: string;

    @ManyToOne(() => User, (user) => user.tasks, { nullable: true })
    @JoinColumn({ name: 'assigneeId' })
    assignee: User | null;

    @Column({ nullable: true })
    assigneeId: number | null;

    @Column({
        type: 'enum',
        enum: Status,
        default: Status.ToDo,
    })
    status: Status;

    @Column('timestamp')
    startDate: Date;

    @Column('timestamp')
    endDate: Date;

    @CreateDateColumn()
    createdAt: Date;
}
