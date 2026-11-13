import { Injectable, OnModuleDestroy, OnModuleInit } from '@nestjs/common';
import Redis from 'ioredis';

@Injectable()
export class RedisService implements OnModuleInit, OnModuleDestroy {
  private client: Redis;
  private memoryCache = new Map<string, { value: string; expiresAt?: number }>();
  private isConnected = false;

  onModuleInit() {
    const host = process.env.REDIS_HOST || '127.0.0.1';
    const port = Number(process.env.REDIS_PORT) || 6379;
    const password = process.env.REDIS_PASSWORD || undefined;

    this.client = new Redis({
      host,
      port,
      password,
      retryStrategy: (times) => {
        if (times > 3) {
          return null; // Stop retrying after 3 attempts
        }
        return Math.min(times * 100, 2000);
      },
    });

    this.client.on('connect', () => {
      this.isConnected = true;
      console.log('Redis connected successfully');
    });

    this.client.on('error', (err) => {
      this.isConnected = false;
      // Do not crash app if redis server is offline in development
    });
  }

  async set(key: string, value: string, ttlSeconds?: number): Promise<void> {
    if (this.isConnected) {
      try {
        if (ttlSeconds) {
          await this.client.set(key, value, 'EX', ttlSeconds);
        } else {
          await this.client.set(key, value);
        }
        return;
      } catch (err) {
        // Fallback to memory
      }
    }

    // Fallback in-memory storage
    const expiresAt = ttlSeconds ? Date.now() + ttlSeconds * 1000 : undefined;
    this.memoryCache.set(key, { value, expiresAt });
  }

  async get(key: string): Promise<string | null> {
    if (this.isConnected) {
      try {
        return await this.client.get(key);
      } catch (err) {
        // Fallback to memory
      }
    }

    const item = this.memoryCache.get(key);
    if (!item) return null;

    if (item.expiresAt && Date.now() > item.expiresAt) {
      this.memoryCache.delete(key);
      return null;
    }

    return item.value;
  }

  async del(key: string): Promise<void> {
    if (this.isConnected) {
      try {
        await this.client.del(key);
      } catch (err) {
        // Fallback to memory
      }
    }

    this.memoryCache.delete(key);
  }

  onModuleDestroy() {
    if (this.client) {
      this.client.disconnect();
    }
  }
}
