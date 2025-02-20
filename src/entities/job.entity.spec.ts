import { JobEntity } from './job.entity';

describe('JobEntity', () => {
    describe('sets env variables', () => {
        it('should serialize env variables', async () => {
            const job = new JobEntity();

            expect(job.envVariables).toEqual([]);

            const vars = [{ name: 'JOB_SLEEP', value: 500 }];
            job.envVariables = vars;
            expect(job.envVariables).toEqual(vars);

            expect(job).toHaveProperty('envVariablesSerialized');
            expect(
                Object.getOwnPropertyDescriptor(job, 'envVariablesSerialized')
                    .value,
            ).toEqual(JSON.stringify(vars));
        });
    });
});
