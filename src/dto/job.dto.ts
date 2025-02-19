import { IsArray, IsNotEmpty, IsOptional } from 'class-validator';
import { IJobEnvVariable } from '../entities/job.entity';

export class JobDto {
    @IsNotEmpty()
    name: string;

    /**
     * CRON string (for scheduling)
     */
    @IsNotEmpty()
    cron: string;

    @IsNotEmpty()
    dockerImagePath: string;

    @IsOptional()
    @IsArray()
    envVariables?: IJobEnvVariable[];
}
