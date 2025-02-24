import { ApiProperty } from '@nestjs/swagger';
import { JobEntity } from '../../entities/job.entity';
import { ListView } from './list.view';
import { JobView } from './job-list.view';

class ExecutionView {
    @ApiProperty()
    time: number;

    @ApiProperty()
    code: number;

    @ApiProperty()
    lastExecution: Date | string;
}

// tslint:disable-next-line:max-classes-per-file
class JobExecutionView extends JobView {
    @ApiProperty({ type: ExecutionView })
    execution: ExecutionView;
}

// tslint:disable-next-line:max-classes-per-file
export class JobExecutionListView extends ListView<JobExecutionView> {
    @ApiProperty({ isArray: true, type: JobExecutionView })
    items: JobExecutionView[];
}
