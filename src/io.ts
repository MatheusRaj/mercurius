import * as http from 'http';
import { Server } from 'socket.io';

import app from './app';

export const httpServer = new http.Server(app);

export const initServer = async (port: number) => {
  const server = await httpServer.listen({ port });

  console.log('Server up and listening port: ', port);

  return server;
};

export const getSocket = (server: http.Server): Server => {
  const io = new Server(server, { path: '/', cors: { origin: '*', credentials: false } });

  return io;
};
