import { Module } from '@nestjs/common';
import { JobCommand } from './job.command';

@Module({
    imports: [JobCommand],
})
export class JobCommandModule {}
