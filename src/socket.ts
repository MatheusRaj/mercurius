export * from 'socket.io';
import { getIoConnection } from '.';

export const listenWebsocket = (event: string, callback: Function) => {
  console.log('listen called', event);

  const io = getIoConnection();

  io.on('connection', socket => {
    console.log('connection called');
    socket.on(event, (payload: any) => {
      callback(socket, payload);
    });
  });
};

export default { listenWebsocket };
