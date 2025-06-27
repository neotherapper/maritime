import React from 'react';
import type { Meta, StoryObj } from '@storybook/react-vite';
import { expect, userEvent, within } from '@storybook/test';
import { Step3 } from './Step3';

const meta: Meta<typeof Step3> = {
  title: 'Features/Maritime Quote Wizard/Step3',
  component: Step3,
  parameters: {
    layout: 'centered',
  },
  decorators: [
    (Story) => {
      React.useEffect(() => {
        localStorage.clear();
      }, []);
      return <Story />;
    },
  ],
};

export default meta;
type Story = StoryObj<typeof meta>;

export const Default: Story = {
  tags: ['test'],
  args: {
    onReview: () => {},
    onBack: () => {},
  },
  play: async ({ canvasElement }) => {
    const canvas = within(canvasElement);
    
    // Test that the component renders
    expect(canvas.getByTestId('coverage-basic')).toBeInTheDocument();
    expect(canvas.getByTestId('coverage-standard')).toBeInTheDocument();
    expect(canvas.getByTestId('coverage-premium')).toBeInTheDocument();
    expect(canvas.getByTestId('cargo-value')).toBeInTheDocument();
  },
};

export const WithInitialData: Story = {
  tags: ['test'],
  args: {
    onReview: () => {},
    onBack: () => {},
    initialData: {
      coverageLevel: 'Standard',
      cargoValue: 2500000
    },
  },
  play: async ({ canvasElement }) => {
    const canvas = within(canvasElement);
    
    // Test that initial data is populated
    const standardRadio = canvas.getByTestId('coverage-standard') as HTMLInputElement;
    const cargoValueField = canvas.getByTestId('cargo-value') as HTMLInputElement;
    
    expect(standardRadio.checked).toBe(true);
    expect(cargoValueField.value).toBe('2500000');
  },
};

export const LoadingState: Story = {
  tags: ['test'],
  args: {
    onReview: () => new Promise(resolve => setTimeout(resolve, 1000)),
    onBack: () => {},
  },
  play: async ({ canvasElement }) => {
    const canvas = within(canvasElement);
    
    // Fill form data
    await userEvent.click(canvas.getByTestId('coverage-standard'));
    await userEvent.type(canvas.getByTestId('cargo-value'), '2000000');
    
    // Button should be enabled with valid data
    expect(canvas.getByTestId('review-button')).not.toBeDisabled();
  },
};