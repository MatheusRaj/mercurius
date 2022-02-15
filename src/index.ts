import 'source-map-support/register';

import * as sentry from '@sentry/node';

import './io';
import './socket';

export const initSentry = (sentryKey: string) => sentry.init({ dsn: sentryKey });
