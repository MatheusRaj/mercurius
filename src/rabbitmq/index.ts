import { Connection } from '@eduzz/rabbit';

export const rabbitConnection = params => new Connection(params);

export const sendMessageToRabbit = ({ connection, topic, payload }) => {
  const publisher = connection.topic(topic).persistent();

  publisher.send(payload);
};
