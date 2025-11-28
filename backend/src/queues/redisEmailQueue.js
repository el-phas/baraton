import Queue from 'bull';

// Build redis connection options from env
const redisOpts = process.env.REDIS_URL
  ? { url: process.env.REDIS_URL }
  : {
      host: process.env.REDIS_HOST || '127.0.0.1',
      port: Number(process.env.REDIS_PORT || 6379),
      password: process.env.REDIS_PASSWORD || undefined,
    };

let emailQueue;
try {
  emailQueue = new Queue('emailQueue', { redis: redisOpts });
} catch (err) {
  console.error('✉️ [RedisQueue] Failed to create Bull queue', err.message || err);
}

export async function enqueueEmailRedis(payload) {
  if (!emailQueue) throw new Error('Redis email queue not initialized');
  return emailQueue.add(payload, {
    attempts: Number(process.env.EMAIL_MAX_ATTEMPTS || 5),
    backoff: { type: 'exponential', delay: 1000 }
  });
}

export function processEmailRedis(handler) {
  if (!emailQueue) throw new Error('Redis email queue not initialized');
  emailQueue.process(async (job) => {
    try {
      await handler(job.data);
      return Promise.resolve();
    } catch (err) {
      console.error('✉️ [RedisQueue] Job handler error:', err.message || err);
      throw err;
    }
  });

  emailQueue.on('failed', (job, err) => {
    console.error(`✉️ [RedisQueue] Job ${job.id} failed:`, err.message || err);
  });

  emailQueue.on('completed', (job) => {
    console.log(`✉️ [RedisQueue] Job ${job.id} completed`);
  });
}

export { emailQueue };
