import { Entity, Column, PrimaryGeneratedColumn, ManyToOne } from 'typeorm';
import { JobEntity } from './job.entity';

@Entity({ name: 'job_execution' })
export class JobExecutionEntity {
    @ManyToOne(() => JobEntity, (job) => job.executions)
    job: JobEntity;

    @PrimaryGeneratedColumn()
    id: number;

    @Column()
    startedAt: Date;

    @Column({ nullable: true })
    finishedAt?: Date;

    @Column({ nullable: true })
    exitCode?: number;
}
