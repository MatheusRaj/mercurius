import * as http from 'http';
import { Server } from 'socket.io';

import app from './app';

export const httpServer = new http.Server(app);

export const io = new Server(httpServer, {
  path: '/',
  cors: { origin: '*', methods: ['GET', 'POST'] },
  transports: ['websocket', 'polling']
});
