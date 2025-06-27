import { test } from 'vitest';
import { composeStories } from '@storybook/react';
import * as stories from './Review.stories';

// Compose all stories from the Review stories file
const { Default, LoadingState, ErrorState } = composeStories(stories);

test('Review Default story renders', async () => {
  await Default.run();
  // Story completed successfully - basic smoke test
});

test('Review LoadingState story shows loading indicator', async () => {
  await LoadingState.run();
  // The play function tests the loading state behavior
});

test('Review ErrorState story displays error message', async () => {
  await ErrorState.run();
  // The play function tests the error state behavior
});

test('Review Default story with custom args', async () => {
  const mockOnSubmit = vi.fn();
  const mockOnPrevious = vi.fn();
  const mockOnSaveDraft = vi.fn();
  
  await Default.run({
    args: {
      ...Default.args,
      onSubmit: mockOnSubmit,
      onPrevious: mockOnPrevious,
      onSaveDraft: mockOnSaveDraft,
    }
  });
  
  // Could add additional assertions here about the mocked functions
});