import { test, vi } from 'vitest';
import { composeStories } from '@storybook/react';
import * as stories from './Step1.stories';

// Compose all stories from the Step1 stories file
const { Default, WithInitialData, ValidationError, LoadingState } = composeStories(stories);

test('Step1 Default story renders', async () => {
  await Default.run();
  // Story completed successfully - basic smoke test
});

test('Step1 WithInitialData story populates fields correctly', async () => {
  await WithInitialData.run();
  // The play function in the story already tests the initial data population
});

test('Step1 ValidationError story handles invalid input', async () => {
  await ValidationError.run();
  // The play function tests validation behavior
});

test('Step1 LoadingState story enables button with valid data', async () => {
  await LoadingState.run();
  // The play function tests the loading state behavior
});

test('Step1 Default story with custom args', async () => {
  const mockOnNext = vi.fn();
  const mockOnSaveDraft = vi.fn();
  
  await Default.run({
    args: {
      ...Default.args,
      onNext: mockOnNext,
      onSaveDraft: mockOnSaveDraft,
    }
  });
  
  // Could add additional assertions here about the mocked functions
});