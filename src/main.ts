import { NestFactory } from '@nestjs/core';
import { JobModule } from './job.module';
import { setEnVars } from './envars';
import { ValidationPipe } from '@nestjs/common';
import * as process from 'process';

let server: { close: (arg0: (err: any) => void) => void };

async function bootstrap() {
  const port = process.env.PORT || 3000;

  const app = await NestFactory.create(JobModule);
  app.useGlobalPipes(new ValidationPipe());
  server = await app.listen(port);

  console.log('Application has started on ' + port);

  // Handle process kill signals
  process.on('SIGINT', shutdown);
  process.on('SIGTERM', shutdown);
}

function shutdown() {
  // Gracefully close outstanding HTTP connections
  server.close((err) => {
    if (err) {
      console.error(
        'An error occurred while closing the server. Forecefullly shutting down',
      );
      console.error(err);
      process.exit(1);
    }
    console.log('Http server closed.');
    process.exit(0);
  });
}

bootstrap();
