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

        let id = null;
        let exitCode = null;
        let finishedAt = null;

        for (const [key, value] of Object.entries(process.env)) {
            if (key === 'JOB_EXECUTION_ID') {
                id = value;
            }
            if (key === 'JOB_EXECUTION_EXIT_CODE') {
                exitCode = value;
            }
            if (key === 'JOB_EXECUTION_FINISHED_AT') {
                finishedAt = new Date(Number(value));
            }
            // any other variables for running module would be here
        }

        if (id !== null) {
            const execution = await this.entityManager.getRepository(JobExecutionEntity).findOneBy({ id });

            execution.finishedAt = new Date(finishedAt);
            execution.exitCode = exitCode;

            await this.entityManager.save(execution);
        } else {
            throw new Error('Job not found!\n');
        }
        // added this just to see some results if its working
        const endedAt = new Date().getTime() - startedAt.getTime();
        console.log('Command finished. Time: ' + String(endedAt) + 'ms');
    }
}
