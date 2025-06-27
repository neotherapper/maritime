import React from 'react';
import type { Meta, StoryObj } from '@storybook/react-vite';
import { expect, userEvent, within } from '@storybook/test';
import { Step2 } from './Step2';

const meta: Meta<typeof Step2> = {
  title: 'Features/Maritime Quote Wizard/Step2',
  component: Step2,
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
    onNext: () => {},
    onBack: () => {},
  },
  play: async ({ canvasElement }) => {
    const canvas = within(canvasElement);
    
    // Test that the component renders
    expect(canvas.getByTestId('vessel-name')).toBeInTheDocument();
    expect(canvas.getByTestId('vessel-type')).toBeInTheDocument();
  },
};

export const WithInitialData: Story = {
  tags: ['test'],
  args: {
    onNext: () => {},
    onBack: () => {},
    initialData: {
      vesselName: 'SS Cargo Master',
      vesselType: 'Container Ship'
    },
  },
  play: async ({ canvasElement }) => {
    const canvas = within(canvasElement);
    
    // Test that initial data is populated
    const vesselNameField = canvas.getByTestId('vessel-name') as HTMLInputElement;
    const vesselTypeField = canvas.getByTestId('vessel-type') as HTMLSelectElement;
    
    expect(vesselNameField.value).toBe('SS Cargo Master');
    expect(vesselTypeField.value).toBe('Container Ship');
  },
};

export const LoadingState: Story = {
  tags: ['test'],
  args: {
    onNext: () => new Promise(resolve => setTimeout(resolve, 1000)),
    onBack: () => {},
  },
  play: async ({ canvasElement }) => {
    const canvas = within(canvasElement);
    
    // Fill form data
    await userEvent.type(canvas.getByTestId('vessel-name'), 'Test Vessel');
    await userEvent.selectOptions(canvas.getByTestId('vessel-type'), 'Bulk Carrier');
    
    // Button should be enabled with valid data
    expect(canvas.getByTestId('next-button')).not.toBeDisabled();
  },
};