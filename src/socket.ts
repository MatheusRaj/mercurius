export * from 'socket.io';
import { ISend } from './interfaces/ISend';
import { io } from './io';

export const listenWebsocket = (event: string, callback: Function) => {
  return io.on('connection', socket => {
    socket.on(event, (payload: ISend) => {
      callback(socket, payload);
    });
  });
};

export default { listenWebsocket };
