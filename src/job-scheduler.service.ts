import { Injectable } from '@nestjs/common';
import { JobEntity } from './entities/job.entity';
import { JobRepository } from './job.repository';
import { cronbee } from 'cronbee';

@Injectable()
export class JobSchedulerService {
    constructor(private repository: JobRepository) {}

    async scheduleJob(job: JobEntity): Promise<void> {
        await cronbee.ensure({
            taskName: job.identity,
            taskRun: `sleep 5`,
            workingDirectory: '/app/var',
            cron: job.cron,
        });
    }

    async startJob(job: JobEntity): Promise<void> {
        await this.scheduleJob(job); // has the same interface as needed for job creation, but i wantend to keep separate interface for JobSchedulerService
    }

    async stopJob(job: JobEntity): Promise<void> {
        await cronbee.remove({ taskName: job.identity });
    }

    /*
    i have checkin other library for running cron jobs, but this runs nodejs process instaead - no crontab
    now i am testing cronbee

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
