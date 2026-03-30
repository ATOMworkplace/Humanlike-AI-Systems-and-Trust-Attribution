import fs from 'fs';
import path from 'path';

const LOG_PATH = path.join(process.cwd(), 'data', 'logs.json');

export async function POST(request) {
  const body = await request.json();
  const { participant_id, condition, decision, latency_ms } = body;

  if (!participant_id || !condition || !decision || latency_ms === undefined) {
    return Response.json({ error: 'Missing required fields' }, { status: 400 });
  }

  const entry = {
    participant_id,
    condition,
    decision,
    timestamp: new Date().toISOString(),
    latency_ms,
  };

  const existing = JSON.parse(fs.readFileSync(LOG_PATH, 'utf-8'));
  existing.push(entry);
  fs.writeFileSync(LOG_PATH, JSON.stringify(existing, null, 2));

  return Response.json({ ok: true });
}
