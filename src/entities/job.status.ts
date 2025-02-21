import { JobEntity } from './job.entity';
import { plainToClassFromExist, Expose, Exclude } from 'class-transformer';
import { JobExecutionEntity } from './job-execution.entity';
import { JobStatusDto } from '../dto';
import { ApiProperty } from '@nestjs/swagger';

class JobStatusExecution {
    @ApiProperty()
    time?: number;

    @ApiProperty()
    code?: number;

    @ApiProperty()
    lastExecution?: Date;
}

// tslint:disable-next-line:max-classes-per-file
export class JobStatus extends JobEntity {
    @Exclude()
    private readonly exclusion: JobExecutionEntity;

    constructor(exclusion: JobExecutionEntity) {
        super();
        this.exclusion = exclusion;

        plainToClassFromExist(this, exclusion.job);
    }

    @ApiProperty({ type: JobStatusExecution })
    @Expose({ name: 'status' })
    getStatus(): string {
        if (this.exclusion.finishedAt) {
            return JobStatusDto.finished;
        }
        return JobStatusDto.inProgress;
    }

    @ApiProperty({ type: JobStatusExecution })
    @Expose({ name: 'execution' })
    getExecution(): JobStatusExecution {
        return {
            time: this.exclusion.getExecutionTime(),
            code: this.exclusion.exitCode,
            lastExecution: this.exclusion.startedAt,
        };
    }
}
