import * as http from 'http';

import express from 'express';

import { router } from '.';

async function init() {
  const app = express();
  const httpServer = new http.Server(app);
  const port = 3001;

  app.use('/', router);
  httpServer.listen(3001, () => console.log('Server dev up and listening port: ', port));
}

init();
