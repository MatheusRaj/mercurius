import 'source-map-support/register';

import * as sentry from '@sentry/node';

export * from './io';
export * from './socket';

export const initSentry = (sentryKey: string) => sentry.init({ dsn: sentryKey });
