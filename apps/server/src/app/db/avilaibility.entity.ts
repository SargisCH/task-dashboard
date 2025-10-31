import {
    BaseEntity,
    Column,
    CreateDateColumn,
    Entity,
    ManyToOne,
    PrimaryGeneratedColumn,
} from 'typeorm';
import { User } from './user.entity';

@Entity({ name: 'availabilities' })
export class Availability extends BaseEntity {
    @PrimaryGeneratedColumn()
    id: number;

    @ManyToOne(() => User, (user) => user.availabilities)
    user: User;

    @Column()
    userId: number;

    @Column('timestamp')
    startDate: Date;

    @Column('timestamp')
    endDate: Date;

    @Column()
    taskId: number;

    @CreateDateColumn()
    createdAt: Date;
}
