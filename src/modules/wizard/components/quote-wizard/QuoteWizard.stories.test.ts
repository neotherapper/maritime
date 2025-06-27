import { test } from 'vitest';
import { composeStories } from '@storybook/react';
import * as stories from './QuoteWizard.stories';

// Compose all stories from the QuoteWizard stories file
const { Default, WithDraftData, APIFailure } = composeStories(stories);

test('QuoteWizard Default story renders', async () => {
  await Default.run();
  // Story completed successfully - basic smoke test
});

test('QuoteWizard WithDraftData story handles draft data', async () => {
  await WithDraftData.run();
  // The play function tests the draft data loading behavior
});

test('QuoteWizard APIFailure story handles API failures', async () => {
  await APIFailure.run();
  // The play function tests the API failure scenario
});