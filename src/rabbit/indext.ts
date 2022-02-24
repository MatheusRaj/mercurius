import { Connection } from '@eduzz/rabbit';
import { getRabbitConnection } from '../config';

export const rabbitConnection: Connection = getRabbitConnection();

export const listenRabbitTopic = async (params: any, callback: Function) => {
  const { queue, topic } = params;

  await rabbitConnection
    .queue(queue)
    .topic(topic)
    .durable()
    .retryTimeout(60000)
    .listen<string>(async msg => {
      console.log(msg);
      return callback(msg);
    });
};

export const publishRabbitMessage = async (topic: string, payload: any) => {
  const publisher = rabbitConnection.topic(topic).persistent();

  publisher.send(payload);
};

export default { listenRabbitTopic, publishRabbitMessage, rabbitConnection };
