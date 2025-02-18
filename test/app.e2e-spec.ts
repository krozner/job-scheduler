import * as request from 'supertest';
import { Test } from '@nestjs/testing';
import { INestApplication } from '@nestjs/common';
import { JobModule } from '../src/job.module';

describe('JobController (e2e)', () => {
  let app: INestApplication;

  beforeAll(async () => {
    const moduleFixture = await Test.createTestingModule({
      imports: [JobModule],
    }).compile();

    app = moduleFixture.createNestApplication();
    await app.init();
  });

  it('Create job', async () => {
    let response = await request(app.getHttpServer())
      .post('/jobs')
      .send({
        name: 'Test Job',
        envVariables: [],
      })
      .expect(400);

    response = await request(app.getHttpServer())
      .post('/jobs')
      .send({
        name: 'Test Job',
        cron: '*/10 * * * * *',
        dockerImagePath: '/',
        envVariables: [],
      })
      .expect(200);

    expect(response.body).toHaveProperty('id');
  });

  it('Get jobs', async () => {
    const response = await request(app.getHttpServer())
      .get('/jobs')
      .expect(200);
    expect(response.body).toHaveProperty('items');
  });
});
