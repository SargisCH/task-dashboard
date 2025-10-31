import { staticDir } from '@/common/filesystem';
import { Module } from '@nestjs/common';
import { ConfigModule } from '@nestjs/config';
import { ServeStaticModule } from '@nestjs/serve-static';
import { config } from '@/common';
import { EventEmitterModule } from '@nestjs/event-emitter';
import { DatabaseModule } from './db/database.module';
import { CliModule } from './cli/cli.module';
import { UsersModule } from './users/users.module';
import { AuthModule } from './auth/auth.module';
import { TaskModule } from './tasks/tasks.module';
import { AvailabilityModule } from './availability/availability.module';

@Module({
    imports: [
        ConfigModule.forRoot({
            load: [config],
            isGlobal: true,
        }),
        EventEmitterModule.forRoot(),

        ServeStaticModule.forRoot({
            rootPath: staticDir(),
            exclude: ['/api*'],
        }),

        DatabaseModule,
        CliModule,
        AuthModule,
        UsersModule,
        TaskModule,
        AvailabilityModule,
    ],

    controllers: [],
})
export class AppModule {}
