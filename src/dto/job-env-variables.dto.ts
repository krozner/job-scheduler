import { IJobEnvVariable } from '../entities/job.entity';
import { ApiProperty } from '@nestjs/swagger';

export class JobEnvVariablesDto implements IJobEnvVariable {
    @ApiProperty()
    name: string;
    @ApiProperty()
    value: string | number;
}
