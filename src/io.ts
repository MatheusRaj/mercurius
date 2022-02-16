import * as http from 'http';
import { Server } from 'socket.io';

import app from './app';

export const httpServer = new http.Server(app);

export const initServer = async (port: number) => {
  const server = await httpServer.listen({ port });

  return server;
};

export const getSocket = (server: http.Server): Server => {
  const io = new Server(server);

  return io;
};
