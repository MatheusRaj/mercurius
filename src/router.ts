import { Request, Response, Router } from 'express';

export const router = Router();

router.get('/welcome', (_: Request, res: Response) => res.status(200).send('Welcome to Mercurius'));
