import { parse, DotenvParseOutput } from 'dotenv';
import { readFileSync } from 'node:fs';

export async function setEnVars(path: string): Promise<DotenvParseOutput> {
    try {
        const envConfig = parse(readFileSync(path));

        for (const [key, value] of Object.entries(envConfig)) {
            process.env[key] = value;
        }

        return envConfig;
    } catch (error) {
        console.error(error);

        return null;
    }
}
