import { Redis } from '@upstash/redis';

const redis = new Redis({
  url: process.env.UPSTASH_REDIS_REST_URL || process.env.KV_REST_API_URL,
  token: process.env.UPSTASH_REDIS_REST_TOKEN || process.env.KV_REST_API_TOKEN,
});

export async function GET(request) {
  const { searchParams } = new URL(request.url);
  const key = searchParams.get('key');
  
  if (!key) {
    return Response.json({ error: 'Invalid key' }, { status: 400 });
  }

  try {
    const value = await redis.get(key);
    return Response.json(value || []);
  } catch (err) {
    console.error('KV GET error:', err);
    return Response.json([]);
  }
}

export async function POST(request) {
  try {
    const { key, value } = await request.json();
    
    if (!key) {
      return Response.json({ error: 'Invalid key' }, { status: 400 });
    }

    await redis.set(key, value);
    return Response.json({ ok: true });
  } catch (err) {
    console.error('KV POST error:', err);
    return Response.json({ error: 'Failed to save' }, { status: 500 });
  }
}
