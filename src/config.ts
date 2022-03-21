import * as sentry from '@sentry/node';
import { createAdapter } from '@socket.io/redis-adapter';
import { createClient } from 'redis';
import { BehaviorSubject } from 'rxjs';
import { Server } from 'socket.io';

import { Connection } from '@eduzz/rabbit';

import { IConfig } from './interfaces/IConfig';
import { mongoConnect } from './mongo';

const rabbitConnection = new BehaviorSubject<Connection>({} as Connection);
const ioConnection = new BehaviorSubject<Server>({} as Server);

export const getRabbitConnection = () => rabbitConnection.getValue();
export const getIoConnection = () => ioConnection.getValue();

export const config = async (params: IConfig): Promise<void> => {
  const { sentryKey, rabbitParams, mongoParams, redisUrl, ioOptions, httpServer } = params;

  await ioConnection.next(
    new Server(httpServer, {
      path: '/',
      cors: { origin: '*', methods: ['GET', 'POST'] },
      transports: ['websocket', 'polling'],
      ...ioOptions
    })
  );

  sentryKey && sentry.init({ dsn: sentryKey });

  rabbitParams && rabbitConnection.next(new Connection(rabbitParams));

  mongoParams && (await mongoConnect(mongoParams));

  if (redisUrl) {
    const pubClient = createClient({ url: redisUrl });
    const subClient = pubClient.duplicate();

    const engine = getIoConnection();

    engine.adapter(createAdapter(pubClient, subClient));

    await Promise.all([pubClient.connect(), subClient.connect()]);
  }
};
