import * as request from 'supertest';
import { Test } from '@nestjs/testing';
import { INestApplication } from '@nestjs/common';
import { JobModule } from '../src/job.module';
import { JobDto } from '../src/dto/job.dto';
import { TypeOrmModule } from '@nestjs/typeorm';
import { JobEntity } from '../src/entities/job.entity';

describe('JobController (e2e)', () => {
    let app: INestApplication;

    beforeAll(async () => {
        const moduleFixture = await Test.createTestingModule({
            imports: [
                JobModule,
            ],
        }).compile();

        app = moduleFixture.createNestApplication();
        await app.init();
    });

    it.skip('Create job', async () => {
        const data: JobDto = {
            name: 'Test Job',
            cron: '* * * * *',
            dockerImagePath: '/',
            envVariables: [],
        };

        let response = await request(app.getHttpServer())
            .post('/jobs')
            .send({ name: 'Test Job' })
            .expect(400);

        response = await request(app.getHttpServer())
            .post('/jobs')
            .send(data)
            .expect(201);

        expect(response.body).toHaveProperty('id');
    });

    it('Get jobs', async () => {
        const response = await request(app.getHttpServer())
            .get('/jobs')
            .expect(200);
        expect(response.body).toHaveProperty('items');
    });
});
