import { Module } from '@nestjs/common';
import { JobController } from './job.controller';
import { JobSchedulerService } from './job-scheduler.service';
import { TypeOrmModule } from '@nestjs/typeorm';
import { JobEntity } from './entities/job.entity';
import { JobRepository } from './job.repository';

@Module({
  imports: [
    TypeOrmModule.forFeature([JobEntity]),
    TypeOrmModule.forRoot({
      type: 'sqlite',
      database: 'var/data.db',
      entities: [
          JobEntity,
      ],
      synchronize: false,
      autoLoadEntities: true,
    }),
  ],
  controllers: [JobController],
  providers: [JobSchedulerService, JobRepository],
  exports: [JobSchedulerService],
})
export class JobModule {}
