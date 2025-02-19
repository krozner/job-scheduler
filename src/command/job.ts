import { CommandFactory } from 'nest-commander';
import { JobModule } from '../job.module';

async function bootstrap() {
  await CommandFactory.run(JobModule);
}

bootstrap();
