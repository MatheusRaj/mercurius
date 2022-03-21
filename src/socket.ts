import { Socket } from 'socket.io';

import { getIoConnection } from '.';

export * from 'socket.io';

export const listenWebsocket = (event: string, callback: (socket: Socket, payload: any) => void) => {
  const io = getIoConnection();

  io.on('connection', socket => {
    socket.on(event, payload => {
      callback(socket, payload);
    });
  });
};

export default { listenWebsocket };
