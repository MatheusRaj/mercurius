import { ISend } from './interfaces/ISend';
import { io } from './io';

export const dispatch = (event: string, callback: Function) => {
  return io.on('connection', socket => {
    socket.on(event, (payload: ISend) => {
      callback(io, payload);
    });
  });
};

export const sendMessageToRabbit = ({ connection, topic, payload }) => {
  const publisher = connection.topic(topic).persistent();

  publisher.send(payload);
};

export default { dispatch, sendMessageToRabbit };
