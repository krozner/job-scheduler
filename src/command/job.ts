import { CommandFactory } from 'nest-commander';
import { JobCommandModule } from './job.command..module';

async function bootstrap() {
    await CommandFactory.run(JobCommandModule);
}

bootstrap();
