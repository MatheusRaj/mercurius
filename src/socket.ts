export * from 'socket.io';
import { getIoConnection } from '.';
import { IConversation } from './interfaces/IConversation';

export const listenWebsocket = (event: string, callback: Function) => {
  console.log('listen called', event);

  const io = getIoConnection();

  io.on('connection', socket => {
    console.log('connection called');
    socket.on(event, (payload: IConversation) => {
      callback(socket, payload);
    });
  });
};

export default { listenWebsocket };
