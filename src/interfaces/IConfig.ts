import { Server } from 'http';

import { CorsOptions, CorsOptionsDelegate } from 'cors';
import { Router } from 'express';
import { ServerOptions } from 'socket.io';

import { IConnectionOptions } from '@eduzz/rabbit/dist/interfaces/IConnectionOptions';

export interface IConfig {
  sentryKey?: string;
  httpServer: Server;
  rabbitParams?: IConnectionOptions;
  mongoParams?: {
    mongoDatabase: string;
    mongoUrl: string;
  };
  port?: number | string;
  redisUrl?: string;
  corsOptions?: CorsOptions | CorsOptionsDelegate;
  ioOptions?: Partial<ServerOptions>;
  routerOptions?: Router;
}
