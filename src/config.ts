import * as sentry from '@sentry/node';
import { Connection } from '@eduzz/rabbit';
import { mongoConnect } from './mongo';
import { BehaviorSubject } from 'rxjs';
import { httpServer } from './io';

const rabbitConnection = new BehaviorSubject<Connection>({} as Connection);

export const getRabbitConnection = () => rabbitConnection.getValue();

export const config = async (params: any) => {
  const { sentryKey, rabbitParams, mongoParams, port } = params;

  sentry.init({ dsn: sentryKey });

  rabbitConnection.next(new Connection(rabbitParams));

  await mongoConnect(mongoParams);

  await httpServer.listen({ port });
  console.log('Server up and listening port: ', port);
};
