import * as sentry from '@sentry/node';

import { Server } from 'socket.io';
import { ISend } from './interfaces/ISend';
import { sendMessageToRabbit } from './rabbitmq';

export const persistData = async params => {
  try {
    await sendMessageToRabbit(params);
  } catch (error) {
    sentry.captureException(error);
  }
};

export const connection = (io: Server, listener: Function) => {
  io.on('connection', socket => {
    listener(socket);
  });
};

export const join = (io: Server, callback?: Function) =>
  connection(io, socket => {
    socket.on('join', (payload: ISend) => {
      socket.join(String(payload.room));

      callback && callback(payload);
    });
  });

export const typing = (io: Server, callback?: Function) =>
  connection(io, socket => {
    socket.on('typing', (payload: ISend) => {
      socket.to(String(payload.room)).emit('typing', payload);

      callback && callback(payload);
    });
  });

export const send = (io: Server, callback?: Function) =>
  connection(io, socket => {
    socket.on('send', (payload: ISend) => {
      socket.to(String(payload.room)).emit('receive', payload.data);

      if (!!payload.persistData) {
        persistData({ ...payload.persistData, payload: payload.data });
      }

      callback && callback(payload);
    });
  });

export const disconnect = (io: Server, callback?: Function) =>
  connection(io, socket => {
    socket.on('disconnect', (payload: ISend) => {
      socket.to(String(payload.room)).emit('disconnect', payload);

      callback && callback(payload);
    });
  });

export default { connection, join, send, typing, disconnect };
