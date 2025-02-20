# Job Scheduler

### What is used:
- Framework: [Nest Js](https://github.com/nestjs/nest) 
- Database: SQLite

Ensure also that [Docker is installed](https://docs.docker.com/engine/install) on your work station

## Instalation and Running the app using docker

```bash
# development
$ docker-compose up -d
$ docker exec -it job-scheduler bash
$ npm i
$ npm run start:dev
```
## Testing

```bash
$ docker exec -it job-scheduler bash

# unit tests
$ npm run test

# e2e tests
$ npm run test:e2e

# test coverage
$ npm run test:cov
```
