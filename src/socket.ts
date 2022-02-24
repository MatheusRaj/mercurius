import { Socket } from 'socket.io';
import { ISend } from './interfaces/ISend';
import { io } from './io';

export const listen = (event: string, callback: Function) => {
  return io.on('connection', socket => {
    socket.on(event, (payload: ISend) => {
      callback(socket, payload);
    });
  });
};

export const dispatch = (socket: Socket, event: string, callback: Function) => {
  return socket.emit(event, (payload: ISend) => {
    callback(io, payload);
  });
};

export default { listen, dispatch };
