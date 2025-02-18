import { Test, TestingModule } from '@nestjs/testing';
import { JobController } from './job.controller';
import { JobSchedulerService } from './job-scheduler.service';

describe('AppController', () => {
  let app: TestingModule;

  beforeAll(async () => {
    app = await Test.createTestingModule({
      controllers: [JobController],
      providers: [JobSchedulerService],
    }).compile();
  });

  describe('getHello', () => {
    it('should return "Hello World!"', () => {
      const appController = app.get<JobController>(JobController);
      expect(appController.sayHello()).toBe('Hello World!');
    });
  });
});
