import { NestFactory } from '@nestjs/core';
import { JobModule } from './job.module';
import { setEnVars } from './utils/envars';
import { ValidationPipe } from '@nestjs/common';
import * as process from 'process';
import { DocumentBuilder, SwaggerModule } from '@nestjs/swagger';
import * as fs from 'node:fs';

let server: { close: (arg0: (err: any) => void) => void };

async function bootstrap() {
    await setEnVars('/usr/src/app/.env');
    const port = process.env.PORT || 3000;

    const app = await NestFactory.create(JobModule);
    app.useGlobalPipes(new ValidationPipe());

    const config = new DocumentBuilder()
        .setTitle('Job Scheduler')
        .setVersion('1.0')
        .build();
    const documentFactory = () => SwaggerModule.createDocument(app, config);
    SwaggerModule.setup('api-doc', app, documentFactory);

    server = await app.listen(port);

    console.log('Application has started on ' + port);

    process.on('STDOUT', async (data) => {
        console.log('stdout', data);
        await fs.writeFileSync(data, '/usr/src/app/var/stdout.log');
    });

    // Handle process kill signals
    process.on('SIGINT', shutdown);
    process.on('SIGTERM', shutdown);
}

function shutdown() {
    // Gracefully close outstanding HTTP connections
    server.close((err) => {
        if (err) {
            console.error('An error occurred while closing the server. Forecefullly shutting down');
            console.error(err);
            process.exit(1);
        }
        console.log('Http server closed.');
        process.exit(0);
    });
}

bootstrap();
