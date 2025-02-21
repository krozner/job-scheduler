import { Command, CommandRunner } from 'nest-commander';
import * as process from 'process';
import { InjectEntityManager } from '@nestjs/typeorm';
import { EntityManager } from 'typeorm';
import { JobExecutionEntity } from '../entities/job-execution.entity';

@Command({
    name: 'UpdateJob',
})
export class UpdateJobCommand extends CommandRunner {
    @InjectEntityManager()
    private entityManager: EntityManager;

    async run(): Promise<void> {
        const startedAt = new Date();
        console.log('Updating job commands...');

        let jobId = null;
        let executionId = null;
        let exitCode = null;
        let finishedAt = null;

        for (const [key, value] of Object.entries(process.env)) {
            if (key === 'JOB_EXECUTION_ID') {
                executionId = value;
            }
            if (key === 'JOB_OD') {
                jobId = value;
            }
            if (key === 'JOB_EXECUTION_EXIT_CODE') {
                exitCode = value;
            }
            if (key === 'JOB_EXECUTION_FINISHED_AT') {
                finishedAt = new Date(Number(value));
            }
            // any other variables for running module would be here
        }

        if (executionId !== null) {
            const execution = await this.entityManager.getRepository(JobExecutionEntity).findOneBy({ id: executionId });

            execution.finishedAt = new Date(finishedAt);
            execution.exitCode = exitCode;

            await this.entityManager.save(execution);
        } else {
            throw new Error('Job execution entity not found! JOB ID: ' + jobId + '\n');
        }
        // added this just to see some results if its working
        const endedAt = new Date().getTime() - startedAt.getTime();
        console.log('Command finished. Time: ' + String(endedAt) + 'ms');
    }
}
