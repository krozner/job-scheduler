import { Injectable } from '@nestjs/common';
import { JobEntity } from './entities/job.entity';
import { CronJob } from 'cron';
import { JobRepository } from './job.repository';

@Injectable()
export class JobSchedulerService {
  constructor(private repository: JobRepository) {}

  scheduleJob(job: JobEntity) {
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
  }
}
