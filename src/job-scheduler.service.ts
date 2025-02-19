import { Injectable } from '@nestjs/common';
import { JobEntity } from './entities/job.entity';
import { JobRepository } from './job.repository';
import { cronbee } from 'cronbee';
import { env } from 'process';

@Injectable()
export class JobSchedulerService {
    constructor(private repository: JobRepository) {}

    /**
     * Create new crontab entry
     * @param job
     */
    async scheduleJob(job: JobEntity): Promise<void> {
        let cmd = 'ts-node /usr/src/app/src/command/job.ts';
        if (env.NODE_ENV === 'prod') {
            cmd = 'nodejs /usr/src/app/dist/command/job.js';
        }

        await cronbee.ensure({
            taskName: job.identity,
            taskRun: cmd + ' >> /usr/src/app/var/cron.log 2>&1',
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
