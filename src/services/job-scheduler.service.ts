import { Injectable } from '@nestjs/common';
import { JobEntity } from '../entities/job.entity';
import { cronbee } from 'cronbee';
import { env } from 'process';
import { RuntimeException } from '@nestjs/core/errors/exceptions';
import { CommandHelper } from '../commands/helper';

@Injectable()
export class JobSchedulerService {
    /**
     * Create new crontab entry
     */
    async scheduleJob(job: JobEntity): Promise<void> {
        let cmd = '/usr/local/bin/node /usr/src/app/dist/src/commands/job.js'; // Important: run npm build to use it

        /** for production release purposes I would do something like that , for simplicity job runs job.ts */
        if (env.NODE_ENV === 'prod') {
            cmd = env.MODULE_TO_RUN_COMMAND;
            if (cmd === undefined) {
                throw new RuntimeException('Missing job commands definition');
            }
        }

        const vars = [];
        job.envVariables.forEach(({ name, value }) => {
            vars.push(name + '=' + value);
        });
        vars.push('JOB_ID=' + job.id); // base on this variable commands will fetch job from db @see job.commands.ts

        // prettier-ignore
        await cronbee.ensure({
            taskName: job.identity,
            taskRun: CommandHelper.prepare(cmd, vars),
            cron: job.cron,
        });
    }

    async startJob(job: JobEntity): Promise<void> {
        await this.scheduleJob(job); // wanted to keep separate interface for JobSchedulerService for start and create job
    }

    async stopJob(job: JobEntity): Promise<void> {
        await cronbee.remove({ taskName: job.identity });
    }

    /*
    i have tested other library for running cron jobs, but this runs nodejs process instead - no crontab

    nodeCron(job: JobEntity) {
      const cron = new CronJob(
        job.cron,
        async () => {
          console.log('Cron job ID:' + job.id + ' ' + new Date().getTime());

          cron.onComplete();
        },
        () => {
          const stop = (entity: JobEntity) => {
            if (entity instanceof JobEntity && entity.isEnabled) {
              return; // stops it only if not exist or is disabled
            }
            console.log(
              'Job stopped ID:' + entity.id + ' ' + new Date().getTime(),
            );
            cron.stop();
            cron.onComplete = null;
          };

          this.repository.findJob(job.id).then(stop).catch(stop);
        },
      );

      cron.start();
    }*/
}
