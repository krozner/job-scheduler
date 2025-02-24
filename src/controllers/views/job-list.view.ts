import { ApiProperty } from '@nestjs/swagger';
import { ListView } from './list.view';
import { JobEntity } from '../../entities/job.entity';

export class JobView implements Partial<JobEntity> {
    @ApiProperty()
    id: number;

    @ApiProperty()
    name: string;

    @ApiProperty()
    isEnabled: boolean;
}

// tslint:disable-next-line:max-classes-per-file
export class JobListView extends ListView<JobView> {
    @ApiProperty({ isArray: true, type: JobView })
    items: JobView[];
}
