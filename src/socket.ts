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
  console.log('Connection called');

  return io.on('connection', socket => {
    socket.on('connect_error', err => {
      console.log(`connect_error due to ${err.message}`);
    });
    console.log('CONNECTION');

    listener(socket);
  });
};

export const join = (io: Server, callback?: Function) =>
  connection(io, socket => {
    console.log('listener do join');
    socket.on('join', (payload: ISend) => {
      console.log('event do join');
      socket.join(String(payload.room));

      callback && callback(payload);
    });
  });

export const typing = (io: Server, callback?: Function) =>
  connection(io, socket => {
    console.log('listener do typing');

    socket.on('typing', (payload: ISend) => {
      console.log('event do typing');

      socket.to(String(payload.room)).emit('typing', payload);

      callback && callback(payload);
    });
  });

export const send = (io: Server, callback?: Function) =>
  connection(io, socket => {
    console.log('listener do send');

    socket.on('send', (payload: ISend) => {
      console.log('event do send');
      socket.to(String(payload.room)).emit('receive', payload);

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
