import * as request from 'supertest';
import { INestApplication } from '@nestjs/common';
import { JobDto } from '../src/dto/job.dto';

describe('JobController (e2e)', () => {
    let app: INestApplication;
    let jobName: string;

    beforeAll(async () => {
        jobName = 'Text Job ' + new Date().getTime();
        app = {
            getHttpServer: () => 'http://0.0.0.0:3000',
        } as INestApplication;
    });

    it('Create job', async () => {
        const data: JobDto = {
            name: jobName,
            cron: '* * * * *',
            dockerImagePath: '/',
            envVariables: [],
        };

        let response = await request(app.getHttpServer()).post('/jobs').send({ name: jobName }).expect(400);

        response = await request(app.getHttpServer()).post('/jobs').send(data).expect(201);

        expect(response.body).toHaveProperty('id');
    });

    it('Get jobs', async () => {
        const getJob = async () => {
            const response = await request(app.getHttpServer()).get('/jobs').expect(200);

            expect(response.body).toHaveProperty('items');
            const [latestJob] = response.body.items;
            return latestJob;
        };

        let lastJob = await getJob();

        expect(lastJob).toHaveProperty('name');
        expect(lastJob).toHaveProperty('isEnabled');
        expect(lastJob.name).toEqual(jobName);
        expect(lastJob.isEnabled).toEqual(true);

        await request(app.getHttpServer())
            .patch('/jobs/' + lastJob.id + '/disable')
            .expect(204);

        lastJob = await getJob();
        expect(lastJob.isEnabled).toEqual(false);

        await request(app.getHttpServer())
            .patch('/jobs/' + lastJob.id + '/enable')
            .expect(204);

        lastJob = await getJob();
        expect(lastJob.isEnabled).toEqual(true);
    });

    it('should have crontab entry', async () => {
        const crontab = await request(app.getHttpServer()).get('/crontab').expect(200);
        const response = await request(app.getHttpServer()).get('/jobs').expect(200);

        const {
            items: [lastJob],
        } = response.body;

        expect(lastJob).toHaveProperty('id');
        expect(crontab.body).toBeInstanceOf(Array);
        expect(JSON.stringify(crontab.body)).toContain('Job_' + lastJob.id);
    });
});
