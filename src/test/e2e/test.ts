
import { test as base } from '@playwright/test';
import { createWorkerFixture, type WorkerFixture } from '@msw/playwright';
import { handlers } from './handlers';

interface Fixtures {
  worker: WorkerFixture;
}

export const test = base.extend<Fixtures>({
  worker: createWorkerFixture({
    initialHandlers: handlers,
  }),
});

export { expect } from '@playwright/test';
