import { IsArray, IsNotEmpty, IsOptional } from 'class-validator';
import { IJobEnvVariable } from '../entities/job.entity';
import { ApiProperty } from '@nestjs/swagger';
import { JobEnvVariablesDto } from './job-env-variables.dto';

export class JobDto {
    @ApiProperty()
    @IsNotEmpty()
    name: string;

    /**
     * CRON string (for scheduling)
     */
    @ApiProperty()
    @IsNotEmpty()
    cron: string;

    @ApiProperty()
    @IsNotEmpty()
    dockerImagePath: string;

    @ApiProperty({ required: false, type: JobEnvVariablesDto, isArray: true })
    @IsOptional()
    @IsArray()
    envVariables?: IJobEnvVariable[];
}
