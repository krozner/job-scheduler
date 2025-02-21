import {
    Get,
    Controller,
    Post,
    Body,
    Req,
    Patch,
    HttpCode,
    Param,
    UseInterceptors,
    ClassSerializerInterceptor,
} from '@nestjs/common';
import { JobSchedulerService } from '../services/job-scheduler.service';
import { JobAvailabilityDto, JobDto, JobStatusDto } from '../dto';
import { JobRepository } from '../services/job.repository';
import { Paginator } from '../utils/paginator';
import { JobEntity } from '../entities/job.entity';
import { Request } from 'express';
import { cronbee } from 'cronbee';
import { ApiOperation, ApiParam, ApiResponse } from '@nestjs/swagger';
import { ListView } from './views/list.view';

@Controller()
export class JobController {
    constructor(private readonly jobScheduler: JobSchedulerService, private readonly jobRepository: JobRepository) {}

    @ApiOperation({ summary: 'Create Job' })
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

    @ApiOperation({ summary: 'List of jobs' })
    @ApiResponse({ type: ListView })
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

    @ApiOperation({ summary: 'Change Job availability. (Disable or Enable)' })
    @ApiParam({ name: 'availability', enum: JobAvailabilityDto })
    @Patch('/jobs/:id/:availability')
    @HttpCode(204)
    async changeAvailability(@Param('id') id: number, @Param('availability') availability: JobAvailabilityDto) {
        const job = await this.jobRepository.toggleStatus(id, { [availability]: true });
        if (job instanceof JobEntity) {
            job.isEnabled ? await this.jobScheduler.startJob(job) : await this.jobScheduler.stopJob(job);
        }
    }

    @ApiOperation({ summary: 'List of jobs execution (finished & in progress)' })
    @ApiResponse({ type: ListView })
    @ApiParam({
        name: 'status',
        enum: JobStatusDto,
        allowEmptyValue: true,
        required: false,
        description: 'Without `status` parameter endpoint returns all jobs',
    })
    @UseInterceptors(ClassSerializerInterceptor)
    @Get(['/jobs/executions', '/jobs/executions/:status'])
    async executions(@Req() request: Request, @Param('status') status?: JobStatusDto) {
        const paginator = new Paginator<JobEntity>(request);
        const collection = await this.jobRepository.findExecutions(paginator, { status });

        return {
            pages: paginator.pages,
            items: collection,
        };
    }

    @ApiOperation({ summary: 'Extra endpoint to see raw crontab' })
    @Get('/crontab')
    async crontab() {
        return await cronbee.load();
    }
}
