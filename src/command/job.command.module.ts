import { Module } from '@nestjs/common';
import { JobCommand } from './job.command';
import { JobModule } from '../job.module';

@Module({
    imports: [JobCommand, JobModule],
})
export class JobCommandModule {}
