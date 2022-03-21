import * as http from 'http';

import express from 'express';

import { config, router } from '.';

async function init() {
  const app = express();
  const httpServer = new http.Server(app);
  const port = 3001;
  await config({ port, httpServer });

  app.use('/mercurius', router);
  httpServer.listen(3001, () => console.log('Server up and listening port: ', port));
}

init();
