import { Module } from '@nestjs/common';
import { createClient } from 'redis';

@Module({
    providers: [
        {
            provide: 'REDIS_CLIENT',
            useFactory: async () => {
                const client = createClient({
                    socket: {
                        host: 'localhost',
                        port: 6379
                    },
                    password: "root"
                });

                client.on('error', (err) => {
                    throw new Error('Redis Client Error', err);
                });

                await client.connect();
                return client;
            }
        }
    ],
    exports: ['REDIS_CLIENT']
})
export class RedisModule { }
