import { Entity, Column, PrimaryGeneratedColumn, OneToMany } from 'typeorm';
import { JobExecutionEntity } from './job-execution.entity';
import { Exclude } from 'class-transformer';

export interface IJobEnvVariable {
    name: string;
    value: string | number;
}

@Entity({ name: 'job' })
export class JobEntity {
    @PrimaryGeneratedColumn()
    id: number;

    @Column()
    name: string;

    @Exclude()
    @Column()
    cron: string;

    @Exclude()
    @Column({ name: 'envVariables', nullable: true })
    private envVariablesSerialized?: string; // sqlite doesn't allow to store array so value for env variables is serialized to json

    set envVariables(vars: IJobEnvVariable[]) {
        this.envVariablesSerialized = JSON.stringify(vars);
    }

    get envVariables(): IJobEnvVariable[] {
        return this.envVariablesSerialized
            ? JSON.parse(this.envVariablesSerialized)
            : [];
    }

    @Column({ default: true })
    isEnabled: boolean;

    /**
     * Unique cron job identification (used to recognize job in crontab)
     * e.g: *  *  *  *  *  root  {COMMAND} #Job_1
     */
    get identity(): string {
        return 'Job_' + this.id;
    }

    @OneToMany(() => JobExecutionEntity, (execution) => execution.job)
    executions: JobExecutionEntity[];
}
