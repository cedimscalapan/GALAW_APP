import Fastify from 'fastify';
import cors from '@fastify/cors';
import { Pool } from 'pg';
import { z } from 'zod';

const app = Fastify({ logger: true, bodyLimit: 2 * 1024 * 1024 });
const pool = new Pool({ connectionString: process.env.DATABASE_URL });
const syncSchema = z.object({
  clientId: z.string().min(8).max(120),
  state: z.object({ routines: z.array(z.unknown()), exercises: z.array(z.unknown()), workouts: z.array(z.unknown()), foods: z.array(z.unknown()), measurements: z.array(z.unknown()) }).passthrough(),
});

await app.register(cors, { origin: process.env.CORS_ORIGIN?.split(',') ?? true });
app.get('/health', async () => ({ ok: true, service: 'tams-api', database: Boolean(process.env.DATABASE_URL) }));

app.post('/sync', async (request, reply) => {
  const parsed = syncSchema.safeParse(request.body);
  if (!parsed.success) return reply.code(400).send({ error: 'Invalid TAMS sync payload', details: parsed.error.flatten() });
  const { clientId, state } = parsed.data;
  try {
    await pool.query(
      `insert into tams_sync_snapshots (client_id, payload, updated_at)
       values ($1, $2::jsonb, now())
       on conflict (client_id) do update
       set payload = excluded.payload, updated_at = excluded.updated_at`,
      [clientId, JSON.stringify(state)],
    );
    return { synced: true, serverTime: new Date().toISOString() };
  } catch (error) {
    request.log.error(error);
    return reply.code(503).send({ error: 'Unable to save sync data. Local data remains on this device.' });
  }
});

const port = Number(process.env.PORT ?? 4000);
await app.listen({ port, host: '0.0.0.0' });
