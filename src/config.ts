import * as sentry from '@sentry/node';
import { Connection } from '@eduzz/rabbit';
import { mongoConnect } from './mongo';
import { BehaviorSubject } from 'rxjs';
import { io, httpServer } from './io';
import { createAdapter } from '@socket.io/redis-adapter';
import { createClient } from 'redis';

const rabbitConnection = new BehaviorSubject<Connection>({} as Connection);

export const getRabbitConnection = () => rabbitConnection.getValue();

export const config = async (params: any) => {
  const { sentryKey, rabbitParams, mongoParams, port, redisUrl } = params;

  const pubClient = createClient({ url: redisUrl });
  const subClient = pubClient.duplicate();
  io.adapter(createAdapter(pubClient, subClient));

  sentry.init({ dsn: sentryKey });

  rabbitConnection.next(new Connection(rabbitParams));

  await mongoConnect(mongoParams);

  Promise.all([pubClient.connect(), subClient.connect()]).then(async () => {
    await httpServer.listen({ port });
    console.log('Server up and listening port: ', port);
  });
};
