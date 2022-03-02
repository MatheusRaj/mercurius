export * from 'socket.io';
import { ISend } from './interfaces/ISend';
import { io } from './io';

export const listenWebsocket = (event: string, callback: Function) => {
  console.log('listen called', event);

  io.on('connection', socket => {
    console.log('connection called');
    socket.on(event, (payload: ISend) => {
      console.log(event, ' called');
      callback(socket, payload);
    });
  });
};

export default { listenWebsocket };
