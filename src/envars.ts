import * as dotenv from 'dotenv';

export async function setEnVars(): Promise<dotenv.DotenvParseOutput> {
  try {
    const payloadBuf = Buffer.from('...');

    const envConfig = dotenv.parse(payloadBuf);

    for (const [key, value] of Object.entries(envConfig)) {
      process.env[key] = value;
    }

    return envConfig;
  } catch (error) {
    console.error(error);

    return null;
  }
}
