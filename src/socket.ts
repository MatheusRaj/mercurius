export * from 'socket.io';
import { getIoConnection } from '.';

export const listenWebsocket = (event: string, callback: Function) => {
  const io = getIoConnection();

  io.on('connection', socket => {
    socket.on(event, (payload: any) => {
      callback(socket, payload);
    });
  });
};

export default { listenWebsocket };
