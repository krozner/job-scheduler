import { Command, CommandRunner } from 'nest-commander';
import * as process from 'process';
import { InjectEntityManager } from '@nestjs/typeorm';
import { EntityManager } from 'typeorm';
import { JobEntity } from '../entities/job.entity';
import { JobExecutionEntity } from '../entities/job-execution.entity';
import { exec } from 'node:child_process';

@Command({
    name: 'ExecuteJob',
    options: {
        isDefault: true,
    },
})
export class ExecuteJobCommand extends CommandRunner {
    @InjectEntityManager()
    private entityManager: EntityManager;

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

            process.on('exit', (data) => {
                const cmd = '/usr/local/bin/node /usr/src/app/dist/command/job.js UpdateJob'; // Important: run npm build to use it
                const vars = [
                    'JOB_EXECUTION_ID=' + execution.id,
                    'JOB_EXECUTION_EXIT_CODE=' + 1,
                ];
                exec([
                    ...vars,
                    cmd,
                ].join(' '));
            });

            console.log('Job: ' + job.id);
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
