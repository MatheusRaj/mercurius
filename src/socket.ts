import * as sentry from '@sentry/node';

import { Server } from 'socket.io';
import { ISend } from './interfaces/ISend';
import { sendMessageToRabbit } from './rabbitmq';

export const persistData = async (params) => {
  try {
      await sendMessageToRabbit(params);
    } catch (error) {
      sentry.captureException(error);
    }
}

export const connection = (io: Server, listener: Function) => {
  io.on('connection', (socket) => {
    listener(socket);
  });
}

export const join = (io: Server, callback: Function) => connection(io, (socket) => {
  socket.on('join', async (payload: ISend) => {
      socket.join(String(payload.room));

      callback && callback(payload);
    });
});

export const typing = (io: Server, callback: Function) => connection(io, (socket) => {
  socket.on('typing', async (payload: ISend) => {
      io.to(String(payload.room)).emit('typing', payload);

      callback && callback(payload);
    });
});

export const send = (io: Server, callback: Function) => connection(io, (socket) => {
  socket.on('send', async (payload: ISend) => {
      io.to(String(payload.room)).emit('receive', payload.data);
      
      if (!!payload.persistData) {
        persistData({ connection: '', topic: '', payload: payload })
      }

      callback && callback(payload);
    });
});

export default { connection, join, send };