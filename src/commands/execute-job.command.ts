import { Command, CommandRunner } from 'nest-commander';
import * as process from 'process';
import { InjectEntityManager } from '@nestjs/typeorm';
import { EntityManager } from 'typeorm';
import { JobEntity } from '../entities/job.entity';
import { JobExecutionEntity } from '../entities/job-execution.entity';
import { exec } from 'node:child_process';
import { CommandHelper } from './helper';

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
        console.log('Running job commands...');

        let id = null;
        let sleep = null;

        for (const [key, value] of Object.entries(process.env)) {
            if (key === 'JOB_ID') {
                id = value;
            }
            if (key === 'JOB_SLEEP') {
                sleep = value;
            }
            // any other variables for running module would be here
        }

        // just to slow it down to test different execution times of different jobs
        if (sleep !== null) {
            await new Promise((resolve) => {
                setTimeout(resolve, sleep);
            });
        }

        let execution: JobExecutionEntity = null;
        let job: JobEntity = null;

        process.on('exit', (exitCode) => {
            const cmd = '/usr/local/bin/node /usr/src/app/dist/src/commands/job.js UpdateJob'; // Important: run npm build to use it
            const vars = [
                'JOB_ID' + job?.id,
                'JOB_EXECUTION_ID=' + execution?.id,
                'JOB_EXECUTION_EXIT_CODE=' + exitCode,
                'JOB_EXECUTION_FINISHED_AT=' + new Date().getTime(),
            ];
            exec(CommandHelper.prepare(cmd, vars));
        });

        if (id !== null) {
            job = await this.entityManager.getRepository(JobEntity).findOneBy({ id });
            execution = this.entityManager.create(JobExecutionEntity, {
                job,
                startedAt,
            });
            await this.entityManager.save(execution);
        } else {
            throw new Error('Job not found!');
        }

        // added this just to see some results if its working
        const endsAt = new Date().getTime() - startedAt.getTime();
        console.log('Job execution finished. Time: ' + String(endsAt) + 'ms Job ID: ' + id);
    }
}
