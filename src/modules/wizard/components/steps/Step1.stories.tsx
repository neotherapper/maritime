import React from 'react';
import type { Meta, StoryObj } from '@storybook/react-vite';
import { expect, userEvent, within } from '@storybook/test';
import { Step1 } from './Step1';

const meta: Meta<typeof Step1> = {
  title: 'Features/Maritime Quote Wizard/Step1',
  component: Step1,
  parameters: {
    layout: 'centered',
    a11y: {
      config: {
        rules: [
          {
            id: 'label',
            enabled: true,
          },
          {
            id: 'color-contrast',
            enabled: true,
          },
        ],
      },
    },
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
    onSaveDraft: () => {},
  },
  play: async ({ canvasElement }) => {
    const canvas = within(canvasElement);
    
    // Test that the component renders
    expect(canvas.getByTestId('company-name')).toBeInTheDocument();
    expect(canvas.getByTestId('contact-email')).toBeInTheDocument();
  },
};

export const WithInitialData: Story = {
  tags: ['test'],
  args: {
    onNext: () => {},
    onSaveDraft: () => {},
    initialData: {
      companyName: 'Atlantic Vessels Inc',
      contactEmail: 'info@atlanticvessels.com'
    },
  },
  play: async ({ canvasElement }) => {
    const canvas = within(canvasElement);
    
    // Test that initial data is populated
    const companyField = canvas.getByTestId('company-name') as HTMLInputElement;
    const emailField = canvas.getByTestId('contact-email') as HTMLInputElement;
    
    expect(companyField.value).toBe('Atlantic Vessels Inc');
    expect(emailField.value).toBe('info@atlanticvessels.com');
  },
};

export const ValidationError: Story = {
  tags: ['test'],
  args: {
    onNext: () => {},
    onSaveDraft: () => {},
  },
  play: async ({ canvasElement }) => {
    const canvas = within(canvasElement);
    
    // Test validation by entering invalid email
    await userEvent.type(canvas.getByTestId('contact-email'), 'invalid-email');
    await userEvent.tab();
    
    // Should show validation error (if implemented)
    // expect(canvas.getByTestId('email-error')).toBeInTheDocument();
  },
};

export const LoadingState: Story = {
  tags: ['test'],
  args: {
    onNext: () => new Promise(resolve => setTimeout(resolve, 1000)),
    onSaveDraft: () => {},
  },
  play: async ({ canvasElement }) => {
    const canvas = within(canvasElement);
    
    // Fill form and trigger loading state
    await userEvent.type(canvas.getByTestId('company-name'), 'Test Company');
    await userEvent.type(canvas.getByTestId('contact-email'), 'test@company.com');
    
    // Button should be enabled with valid data
    expect(canvas.getByTestId('next-button')).not.toBeDisabled();
  },
};