import { Module } from '@nestjs/common';
import { JobModule } from '../job.module';
import { ExecuteJobCommand } from './execute-job.command';
import { UpdateJobCommand } from './update-job.command';

@Module({
    imports: [JobModule, ExecuteJobCommand, UpdateJobCommand],
})
export class JobCommandModule {}
