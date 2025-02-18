import { Entity, Column, PrimaryGeneratedColumn } from 'typeorm';

interface IJobEnvVariable {
  name: string;
  value: string | number;
}

@Entity({ name: 'job' })
export class JobEntity {
  @PrimaryGeneratedColumn()
  id: number;

  @Column()
  name: string;

  @Column()
  cron: string;

  // @Column()
  // envVariables: IJobEnvVariable[] = [];

  @Column({ default: true })
  isEnabled: boolean;
}
