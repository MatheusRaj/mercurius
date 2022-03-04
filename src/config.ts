import * as sentry from '@sentry/node';
import { Connection } from '@eduzz/rabbit';
import { mongoConnect } from './mongo';
import { BehaviorSubject } from 'rxjs';
import { createAdapter } from '@socket.io/redis-adapter';
import { createClient } from 'redis';
import * as http from 'http';
import { Server } from 'socket.io';
import cors from 'cors';
import express from 'express';
import { router } from './router';

const rabbitConnection = new BehaviorSubject<Connection>({} as Connection);

export const getRabbitConnection = () => rabbitConnection.getValue();

export const config = async (params: any) => {
  const { sentryKey, rabbitParams, mongoParams, port, redisUrl, corsOptions, ioOptions, routes } = params;

  const app = express();

  app.use(cors(corsOptions ? corsOptions : null));

  app.use('/', { router, ...routes });

  const httpServer = new http.Server(app);

  const io = new Server(httpServer, {
    path: '/',
    cors: { origin: '*', methods: ['GET', 'POST'] },
    transports: ['websocket', 'polling'],
    ...ioOptions
  });

  sentry.init({ dsn: sentryKey });

  rabbitConnection.next(new Connection(rabbitParams));

  await mongoConnect(mongoParams);

  const pubClient = createClient({ url: redisUrl });
  const subClient = pubClient.duplicate();
  io.adapter(createAdapter(pubClient, subClient));

  Promise.all([pubClient.connect(), subClient.connect()]).then(async () => {
    await httpServer.listen({ port });
    console.log('Server up with Redis and listening port: ', port);
  });
};
