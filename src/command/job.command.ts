import { Command, CommandRunner } from 'nest-commander';
import * as process from 'process';
import { writeFileSync } from 'fs';
import { JobRepository } from '../job.repository';
import { InjectEntityManager } from '@nestjs/typeorm';
import { EntityManager } from 'typeorm';
import { JobEntity } from '../entities/job.entity';
import { JobExecutionEntity } from '../entities/job-execution.entity';

@Command({
    name: 'JobCommand',
    options: {
        isDefault: true,
    },
})
export class JobCommand extends CommandRunner {
    @InjectEntityManager()
    private entityManager: EntityManager;

    // private jobRepository: JobRepository;

    async run(): Promise<void> {
        const startedAt = new Date();
        console.log('Running job command...');

        let id = null;
        let sleep = null;

        for (const [key, value] of Object.entries(process.env)) {
            if (key === 'JOB_ID') {
                id = value;
                break;
            }
            if (key === 'JOB_SLEEP') {
                sleep = value;
            }
            // any other variables for running module would be here
        }
        if (id !== null) {
            const job = await this.entityManager
                .getRepository(JobEntity)
                .findOneBy({ id });

            const execution = this.entityManager.create(JobExecutionEntity, {
                job,
                startedAt,
            });
            await this.entityManager.save(execution);

            process.on('stdout', async (data) => {
                execution.data = JSON.stringify(data);
                await this.entityManager.save(execution);
            });

            console.log('Job: ' + job.name);
        }

        // just to slow it down to test different execution times of different jobs
        if (sleep !== null) {
            await new Promise((resolve) => {
                setTimeout(resolve, sleep);
            });
        }

        // added this just to see some results if its working
        const endsAt = new Date().getTime() - startedAt.getTime();
        console.log('Job command finished. Time: ' + String(endsAt) + 'ms');
    }
}
