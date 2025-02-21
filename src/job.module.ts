import { Module } from '@nestjs/common';
import { JobController } from './controllers/job.controller';
import { JobSchedulerService } from './services/job-scheduler.service';
import { TypeOrmModule } from '@nestjs/typeorm';
import { JobEntity } from './entities/job.entity';
import { JobRepository } from './services/job.repository';
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
            logging: false,
        }),
    ],
    controllers: [JobController],
    providers: [JobSchedulerService, JobRepository],
    exports: [JobRepository],
})
export class JobModule {}
