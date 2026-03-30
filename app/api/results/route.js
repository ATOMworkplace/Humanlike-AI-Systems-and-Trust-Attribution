import fs from 'fs';
import path from 'path';

const LOG_PATH = path.join(process.cwd(), 'data', 'logs.json');

export async function GET() {
  const entries = JSON.parse(fs.readFileSync(LOG_PATH, 'utf-8'));
  return Response.json(entries);
}
