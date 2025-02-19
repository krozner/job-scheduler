import { Command, CommandRunner } from 'nest-commander';
import * as process from 'process';

@Command({
    name: 'JobCommand',
    options: {
        isDefault: true,
    },
})
export class JobCommand extends CommandRunner {
    async run(): Promise<void> {
        console.log('Running job command...', process.env);
    }
}
