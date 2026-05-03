import { createClient } from 'redis';
import dotenv from 'dotenv';
dotenv.config();

const client = createClient({
  password: process.env.REDIS_PASSWORD,
  socket: {
    host: process.env.REDIS_HOST,
    port: process.env.REDIS_PORT,
    tls: true
  }
});

client.on('error', (err) => console.log('Redis Client Error', err));
await client.connect();

export const redisClient = client;
