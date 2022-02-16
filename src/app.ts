import cors, { CorsOptions } from 'cors';
import express from 'express';

import { router } from './router';

const app = express();

export const useCors = (options: CorsOptions) => app.use(cors(options));

app.use('/', router);

export default app;
