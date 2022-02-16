import * as http from 'http';
import { Server } from 'socket.io';

import app from './app';

export const server = new http.Server(app);

export const initServer = (port: number) => server.listen(port);

export const getSocket = (): Server => {
  const io = new Server(server);

  return io;
};
