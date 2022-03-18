import { EventEmitter } from 'events';

const emitter = new EventEmitter();

export const emit = (topic: string, payload: any): boolean => {
  return emitter.emit(topic, payload);
};

export const listen = <T>(topic: string, callback: (payload: T) => Promise<boolean>): EventEmitter => {
  return emitter.on(topic, function (payload) {
    callback(payload);
  });
};
