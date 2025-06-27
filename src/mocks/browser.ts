import { setupWorker } from 'msw/browser';
import { handlers } from '../test/e2e/handlers';

export const worker = setupWorker(...handlers);
