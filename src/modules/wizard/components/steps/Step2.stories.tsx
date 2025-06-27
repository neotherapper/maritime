import React from 'react';
import type { Meta, StoryObj } from '@storybook/react-vite';
import { within, userEvent, expect } from 'storybook/test';
import { Step2 } from './Step2';

const meta: Meta<typeof Step2> = {
  title: 'Features/Maritime Quote Wizard/Step2',
  component: Step2,
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
      // Clear localStorage before each story
      React.useEffect(() => {
        localStorage.clear();
      }, []);
      return <Story />;
    },
  ],
};

export default meta;
type Story = StoryObj<typeof meta>;

// @integration @navigation
export const NavigateBackPreservingData: Story = {
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

    // Given: I am on Step 2 with previously entered data
    // When: I view the form
    const vesselNameField = canvas.getByTestId('vessel-name') as HTMLInputElement;
    const vesselTypeField = canvas.getByTestId('vessel-type') as HTMLSelectElement;
    
    // Then: Previously entered data should be preserved
    expect(vesselNameField.value).toBe('SS Cargo Master');
    expect(vesselTypeField.value).toBe('Container Ship');

    // When: I click the Back button
    await userEvent.click(canvas.getByTestId('back-button'));
    
    // Note: In a real implementation, this would navigate back to Step 1
    // while preserving the Step 2 data in the wizard state
  },
};

// @integration @persistence
export const PersistDataOnFieldChange: Story = {
  args: {
    onNext: () => {},
    onBack: () => {},
  },
  play: async ({ canvasElement }) => {
    const canvas = within(canvasElement);

    // Given: I am on Step 2 of the wizard
    // When: I enter vessel information
    await userEvent.type(canvas.getByTestId('vessel-name'), 'MV Ocean Pioneer');
    await userEvent.selectOptions(canvas.getByTestId('vessel-type'), 'Bulk Carrier');

    // Then: Data should be entered correctly
    const vesselNameField = canvas.getByTestId('vessel-name') as HTMLInputElement;
    const vesselTypeField = canvas.getByTestId('vessel-type') as HTMLSelectElement;
    
    expect(vesselNameField.value).toBe('MV Ocean Pioneer');
    expect(vesselTypeField.value).toBe('Bulk Carrier');
    expect(canvas.getByTestId('next-button')).not.toBeDisabled();
  },
};

// Validation scenarios
export const VesselTypeRequired: Story = {
  args: {
    onNext: () => {},
    onBack: () => {},
  },
  play: async ({ canvasElement }) => {
    const canvas = within(canvasElement);

    // Given: I am on Step 2
    // When: I enter vessel name but don't select vessel type
    await userEvent.type(canvas.getByTestId('vessel-name'), 'MV Trade Wind');

    // Then: Next button should be disabled
    expect(canvas.getByTestId('next-button')).toBeDisabled();

    // When: I select vessel type
    await userEvent.selectOptions(canvas.getByTestId('vessel-type'), 'Oil Tanker');

    // Then: Next button should be enabled
    expect(canvas.getByTestId('next-button')).not.toBeDisabled();
  },
};

// UI Elements verification
export const VerifyVesselTypeOptions: Story = {
  args: {
    onNext: () => {},
    onBack: () => {},
  },
  play: async ({ canvasElement }) => {
    const canvas = within(canvasElement);

    // Given: I am on Step 2
    // When: I check the vessel type dropdown
    const vesselTypeSelect = canvas.getByTestId('vessel-type') as HTMLSelectElement;
    const options = Array.from(vesselTypeSelect.options).map(option => option.text);

    // Then: I should see exactly these options
    expect(options).toEqual(['Select vessel type', 'Bulk Carrier', 'Oil Tanker', 'Container Ship']);
  },
};

// Loading state
export const LoadingState: Story = {
  args: {
    onNext: () => new Promise(resolve => setTimeout(resolve, 2000)),
    onBack: () => {},
  },
  play: async ({ canvasElement }) => {
    const canvas = within(canvasElement);

    // Fill valid data
    await userEvent.type(canvas.getByTestId('vessel-name'), 'Test Vessel');
    await userEvent.selectOptions(canvas.getByTestId('vessel-type'), 'Bulk Carrier');
    
    // Click next to trigger loading state
    await userEvent.click(canvas.getByTestId('next-button'));
    
    // In a real implementation, this would show a loading spinner
  },
};

// Error state
export const ErrorState: Story = {
  args: {
    onNext: () => {
      throw new Error('Failed to proceed to next step');
    },
    onBack: () => {},
  },
  play: async ({ canvasElement }) => {
    const canvas = within(canvasElement);

    // Fill valid data
    await userEvent.type(canvas.getByTestId('vessel-name'), 'Test Vessel');
    await userEvent.selectOptions(canvas.getByTestId('vessel-type'), 'Bulk Carrier');
    
    // Try to proceed - would show error in real implementation
    try {
      await userEvent.click(canvas.getByTestId('next-button'));
    } catch {
      // Expected error for demo purposes
    }
  },
};

// Accessibility test
export const AccessibilityValidation: Story = {
  args: {
    onNext: () => {},
    onBack: () => {},
  },
  play: async ({ canvasElement }) => {
    const canvas = within(canvasElement);

    // Verify all input fields have associated labels
    const vesselNameField = canvas.getByTestId('vessel-name');
    const vesselTypeField = canvas.getByTestId('vessel-type');

    expect(vesselNameField).toHaveAccessibleName('Vessel Name');
    expect(vesselTypeField).toHaveAccessibleName('Vessel Type');

    // Verify step indicator is present
    expect(canvas.getByTestId('step-indicator')).toHaveTextContent('Step 2 of 3');

    // Test keyboard navigation
    await userEvent.tab();
    expect(vesselNameField).toHaveFocus();
    
    await userEvent.tab();
    expect(vesselTypeField).toHaveFocus();
    
    await userEvent.tab();
    expect(canvas.getByTestId('back-button')).toHaveFocus();
    
    await userEvent.tab();
    expect(canvas.getByTestId('next-button')).toHaveFocus();
  },
};