import Redis from 'ioredis';

let redisClient;
let redisClientError;

const redisConnection = async function redisClientConnection() {
  try {
    if (redisClient === undefined) {
      redisClient = new Redis({
        port: process.env.REDIS_PORT,
        host: process.env.REDIS_HOST,
        lazyConnect: true,
        maxRetriesPerRequest: 1,
      });

      redisClient.on('error', (err) => {
        redisClientError = err.message;
      });

      await redisClient.connect();
      await redisClient.config('SET', 'maxmemory', process.env.REDIS_MAXMEMORY || 10485760);
      await redisClient.config('SET', 'maxmemory-policy', 'allkeys-lfu');
      await redisClient.config('SET', 'appendonly', 'yes');
      await redisClient.config('REWRITE');
    }
    return redisClient;
  } catch (error) {
    throw new Error(redisClientError || error.message);
  }
};

export default redisConnection;
