import { Injectable } from '@nestjs/common';
import { EntityManager } from 'typeorm';
import { JobEntity } from '../entities/job.entity';
import { InjectEntityManager } from '@nestjs/typeorm';
import { JobDto } from '../dto/job.dto';
import { JobAvailabilityDto } from '../dto/job-availability.dto';
import { Paginator } from '../utils/paginator';
import { JobExecutionEntity } from '../entities/job-execution.entity';
import { JobStatusDto } from '../dto';
import { JobStatus } from '../entities/job.status';

type IJobStatusUpdate = {
    [key in JobAvailabilityDto]?: boolean;
};

@Injectable()
export class JobRepository {
    @InjectEntityManager()
    private readonly entityManager: EntityManager;

    async createJob(data: JobDto): Promise<JobEntity> {
        const entity = this.entityManager.create(JobEntity, data);
        entity.envVariables = data.envVariables;
        await this.entityManager.save(entity);

        return entity;
    }

    async findJob(id: number): Promise<JobEntity> {
        return this.entityManager.findOneBy(JobEntity, { id });
    }

    fetch(paginator: Paginator<JobEntity>): Promise<JobEntity[]> {
        return this.entityManager
            .getRepository(JobEntity)
            .createQueryBuilder()
            .offset(paginator.offset)
            .limit(paginator.limit)
            .orderBy(paginator.orderBy)
            .getMany();
    }

    /**
     * @param id
     * @param options If disable|enable option is set it forces status change
     */
    async toggleStatus(id: number, options?: IJobStatusUpdate): Promise<JobEntity> {
        const job = await this.findJob(id);
        if (job instanceof JobEntity) {
            if (options?.disable) {
                job.isEnabled = false;
            } else if (options?.enable) {
                job.isEnabled = true;
            } else {
                job.isEnabled = !job.isEnabled;
            }

            await this.entityManager.save(job);
            return job;
        }
        return null;
    }

    async findExecutions(paginator: Paginator<JobEntity>, options?: { status: JobStatusDto }): Promise<JobStatus[]> {
        const total = await this.entityManager
            .getRepository(JobEntity)
            .createQueryBuilder()
            .getCount();

        paginator
            .setAlias('j') // sorts by job.id, @see query builder below
            .setTotal(total);

        const ids = await this.entityManager
            .createQueryBuilder()
            .select('e.id')
            .from('(SELECT e.* FROM job_execution e ORDER BY e.id DESC)', 'e')
            .groupBy('e.jobId')
            .offset(paginator.offset)
            .limit(paginator.limit)
            .getRawMany();

        const collection = await this.entityManager
            .getRepository(JobExecutionEntity)
            .createQueryBuilder('e')
            .leftJoinAndMapOne('e.job', JobEntity, 'j', 'e.jobId = j.id')
            .where('e.id IN (:...id)', { id: ids.map(({ id }) => id) })
            .orderBy(paginator.orderBy) // sorted by job.id DESC
            .getMany();

        return collection.map((execution) => new JobStatus(execution));
    }
}
