import * as sentry from '@sentry/node';
import { Connection } from '@eduzz/rabbit';
import { mongoConnect } from './mongo';
import { BehaviorSubject } from 'rxjs';
import { createAdapter } from '@socket.io/redis-adapter';
import { createClient } from 'redis';
import * as http from 'http';
import { Server, ServerOptions } from 'socket.io';
import cors, { CorsOptions, CorsOptionsDelegate } from 'cors';
import express, { Router } from 'express';
import { router } from './router';
import { IConnectionOptions } from '@eduzz/rabbit/dist/interfaces/IConnectionOptions';

interface IConfig {
  sentryKey?: string;
  rabbitParams?: IConnectionOptions;
  mongoParams?: {
    mongoDatabase: string;
    mongoUrl: string;
  };
  port: number;
  redisUrl: string;
  corsOptions: CorsOptions | CorsOptionsDelegate;
  ioOptions: Partial<ServerOptions>;
  routerOptions: Router;
}

const rabbitConnection = new BehaviorSubject<Connection>({} as Connection);
const io = new BehaviorSubject<Server>({} as Server);

export const getRabbitConnection = () => rabbitConnection.getValue();
export const getIoConnection = () => io.getValue();

export const config = async (params: IConfig) => {
  const { sentryKey, rabbitParams, mongoParams, port, redisUrl, corsOptions, ioOptions, routerOptions } = params;

  const app = express();

  app.use(cors(corsOptions ? corsOptions : null));

  app.use('/', routerOptions ? routerOptions : router);

  const httpServer = new http.Server(app);

  await io.next(
    new Server(httpServer, {
      path: '/',
      cors: { origin: '*', methods: ['GET', 'POST'] },
      transports: ['websocket', 'polling'],
      ...ioOptions
    })
  );

  sentry.init({ dsn: sentryKey });

  rabbitConnection.next(new Connection(rabbitParams));

  await mongoConnect(mongoParams);

  const pubClient = createClient({ url: redisUrl });
  const subClient = pubClient.duplicate();

  const engine = getIoConnection();

  engine.adapter(createAdapter(pubClient, subClient));

  Promise.all([pubClient.connect(), subClient.connect()]).then(async () => {
    await httpServer.listen({ port });
    console.log('Server up with Redis and listening port: ', port);
  });
};
