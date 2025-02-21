export class CommandHelper {
    static prepare(command: string, vars: string[] = []) {
        return [...vars, command, '>> /usr/src/app/var/cron.log 2>&1'].join(' ');
    }
}
