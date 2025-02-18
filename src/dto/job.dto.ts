import { IsNotEmpty } from 'class-validator';

export class JobDto {
  @IsNotEmpty()
  name: string;

  @IsNotEmpty()
  dockerImagePath: string;
  /**
   * CRON string (for scheduling)
   */
  @IsNotEmpty()
  cron: string;

  environmentVariables: Array<{ name: string; value: unknown }>;
}
