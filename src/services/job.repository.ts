import { Injectable } from '@nestjs/common';
import { EntityManager } from 'typeorm';
import { JobEntity } from '../entities/job.entity';
import { InjectEntityManager } from '@nestjs/typeorm';
import { JobDto } from '../dto/job.dto';
import { JobStatusDto } from '../dto/job-status.dto';
import { Paginator } from '../utils/paginator';
import { JobExecutionEntity } from '../entities/job-execution.entity';

type IJobStatusUpdate  = {
    [key in JobStatusDto]?: boolean;
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

    async findExecutions(paginator: Paginator<JobEntity>): Promise<JobEntity[]> {
        const total = await this.entityManager
            .getRepository(JobEntity)
            .createQueryBuilder('j')
            .leftJoinAndSelect(JobExecutionEntity, 'e')
            .getCount();
        paginator.setTotal(total);

        return this.entityManager.getRepository(JobEntity).find({
            skip: paginator.offset,
            take: paginator.limit,
            order: paginator.orderBy,
            relations: {
                executions: true,
            },
        });
    }
}
