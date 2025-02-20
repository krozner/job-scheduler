import { Module } from '@nestjs/common';
import { JobController } from './job.controller';
import { JobSchedulerService } from './job-scheduler.service';
import { TypeOrmModule } from '@nestjs/typeorm';
import { JobEntity } from './entities/job.entity';
import { JobRepository } from './job.repository';
import { JobExecutionEntity } from './entities/job-execution.entity';

@Module({
    imports: [
        TypeOrmModule.forFeature([JobEntity]),
        TypeOrmModule.forRoot({
            type: 'sqlite',
            database: 'var/data.db',
            entities: [JobEntity, JobExecutionEntity],
            synchronize: true,
            autoLoadEntities: true,
        }),
    ],
    controllers: [JobController],
    providers: [JobSchedulerService, JobRepository],
    exports: [JobRepository],
})
export class JobModule {}
