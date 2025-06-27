import { test, vi } from 'vitest';
import { composeStories } from '@storybook/react';
import * as stories from './Step2.stories';

// Compose all stories from the Step2 stories file
const { Default, WithInitialData, LoadingState } = composeStories(stories);

test('Step2 Default story renders', async () => {
  await Default.run();
  // Story completed successfully - basic smoke test
});

test('Step2 WithInitialData story populates fields correctly', async () => {
  await WithInitialData.run();
  // The play function in the story already tests the initial data population
});

test('Step2 LoadingState story handles loading state', async () => {
  await LoadingState.run();
  // The play function tests the loading state behavior
});

test('Step2 Default story with custom args', async () => {
  const mockOnNext = vi.fn();
  const mockOnPrevious = vi.fn();
  const mockOnSaveDraft = vi.fn();
  
  await Default.run({
    args: {
      ...Default.args,
      onNext: mockOnNext,
      onPrevious: mockOnPrevious,
      onSaveDraft: mockOnSaveDraft,
    }
  });
  
  // Could add additional assertions here about the mocked functions
});