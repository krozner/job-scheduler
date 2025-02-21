import { Injectable } from '@nestjs/common';
import { EntityManager } from 'typeorm';
import { JobEntity } from '../entities/job.entity';
import { InjectEntityManager } from '@nestjs/typeorm';
import { JobDto } from '../dto/job.dto';
import { Paginator } from '../utils/paginator';
import { JobExecutionEntity } from '../entities/job-execution.entity';

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

    async toggleStatus(id: number): Promise<JobEntity> {
        const job = await this.findJob(id);
        if (job instanceof JobEntity) {
            job.isEnabled = !job.isEnabled;
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

        return this.entityManager
            .getRepository(JobEntity)
            .find({
                skip: paginator.offset,
                take: paginator.limit,
                order: paginator.orderBy,
                relations: {
                    executions: true,
                },
            });
    }
}
