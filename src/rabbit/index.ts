import { Connection } from '@eduzz/rabbit';

import { getRabbitConnection } from '../config';

export const listenRabbitTopic = async (params: any, callback: (msg: any) => boolean) => {
  const rabbitConnection: Connection = getRabbitConnection();
  const { queue, topic } = params;

  await rabbitConnection
    .queue(queue)
    .topic(topic)
    .retryTimeout(60000)
    .listen<string>(async msg => {
      return callback(msg);
    });

  return true;
};

export const publishRabbitMessage = async (topic: string, payload: any) => {
  const rabbitConnection: Connection = getRabbitConnection();

  const publisher = rabbitConnection.topic(topic);

  publisher.send({ payload });
};

export default { listenRabbitTopic, publishRabbitMessage };
