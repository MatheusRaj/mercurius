import { IConnectionOptions } from '@eduzz/rabbit/dist/interfaces/IConnectionOptions';
import { CorsOptions, CorsOptionsDelegate } from 'cors';
import { Router } from 'express';
import { ServerOptions } from 'socket.io';

export interface IConfig {
  sentryKey?: string;
  rabbitParams?: IConnectionOptions;
  mongoParams?: {
    mongoDatabase: string;
    mongoUrl: string;
  };
  port?: number;
  redisUrl?: string;
  corsOptions?: CorsOptions | CorsOptionsDelegate;
  ioOptions?: Partial<ServerOptions>;
  routerOptions?: Router;
}
