import { Role } from '@workspace/shared';
import { BaseEntity, Column, Entity, OneToMany, PrimaryGeneratedColumn } from 'typeorm';
import { Session } from './session.entity';
import { Task } from './task.entity';
import { Availability } from './avilaibility.entity';

@Entity({ name: 'users' })
export class User extends BaseEntity {
    @PrimaryGeneratedColumn()
    id: number;

    @OneToMany(() => Session, (session) => session.user)
    sessions: Session[];

    @Column({
        type: 'enum',
        enum: Role,
        default: Role.User,
    })
    role: Role;

    @Column({
        length: 255,
    })
    email: string;

    @Column()
    hash: string;

    @Column()
    firstName: string;

    @Column()
    lastName: string;

    @Column({
        nullable: true,
    })
    position: string;

    @Column({
        default: true,
    })
    isActive: boolean;

    @OneToMany(() => Task, (task) => task.assignee)
    tasks: Task[];

    @OneToMany(() => Availability, (availability) => availability.user)
    availabilities: Availability[];

    @Column({
        default: () => 'CURRENT_TIMESTAMP',
    })
    createdAt: Date;
}
