import fs from 'fs';
import path from 'path';

const LOG_PATH = path.join(process.cwd(), 'data', 'logs.json');

export async function GET() {
  const entries = JSON.parse(fs.readFileSync(LOG_PATH, 'utf-8'));

  const header = 'participant_id,condition,decision,timestamp,latency_ms';
  const rows = entries.map(e =>
    `${e.participant_id},${e.condition},${e.decision},${e.timestamp},${e.latency_ms}`
  );
  const csv = [header, ...rows].join('\n');

  return new Response(csv, {
    headers: {
      'Content-Type': 'text/csv',
      'Content-Disposition': 'attachment; filename="logs.csv"',
    },
  });
}
