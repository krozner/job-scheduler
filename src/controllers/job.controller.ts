import {
    Get,
    Controller,
    Post,
    Body,
    Req,
    Put,
    Patch,
    HttpCode,
    Param,
    UseInterceptors,
    ClassSerializerInterceptor,
} from '@nestjs/common';
import { JobSchedulerService } from '../services/job-scheduler.service';
import { JobDto } from '../dto/job.dto';
import { JobRepository } from '../services/job.repository';
import { Paginator } from '../utils/paginator';
import { JobEntity } from '../entities/job.entity';
import { Request } from 'express';
import { cronbee } from 'cronbee';

@Controller()
export class JobController {
    constructor(private readonly jobScheduler: JobSchedulerService, private readonly jobRepository: JobRepository) {}

    @Post('/jobs')
    @HttpCode(201)
    async createJob(@Body() job: JobDto) {
        // todo wrap it in transaction
        const entity = await this.jobRepository.createJob(job);
        await this.jobScheduler.scheduleJob(entity);

        return {
            id: entity.id,
        };
    }

    @UseInterceptors(ClassSerializerInterceptor)
    @Get('/jobs')
    async fetch(@Req() request: Request) {
        const paginator = new Paginator<JobEntity>(request);
        const collection = await this.jobRepository.fetch(paginator);

        return {
            pages: paginator.pages,
            items: collection,
        };
    }

    @Patch('/jobs/:id')
    @HttpCode(204)
    async update(@Param('id') id: number) {
        const job = await this.jobRepository.toggleStatus(id);
        if (job instanceof JobEntity) {
            job.isEnabled ? await this.jobScheduler.startJob(job) : await this.jobScheduler.stopJob(job);
        }
    }

    @UseInterceptors(ClassSerializerInterceptor)
    @Get('/jobs/executions')
    async executions(@Req() request: Request) {
        const paginator = new Paginator<JobEntity>(request);
        const collection = await this.jobRepository.findExecutions(paginator);

        return {
            pages: paginator.pages,
            items: collection,
        };
    }

    @Get('/crontab')
    async crontab(@Req() request: Request) {
        return await cronbee.load();
    }
}
