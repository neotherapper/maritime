import React from 'react';
import type { Meta, StoryObj } from '@storybook/react-vite';
import { within, userEvent, expect, waitFor } from 'storybook/test';
import { Step3 } from './Step3';

const meta: Meta<typeof Step3> = {
  title: 'Features/Maritime Quote Wizard/Step3',
  component: Step3,
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
      // Setup localStorage with previous steps data
      React.useEffect(() => {
        localStorage.setItem('quoteDraft', JSON.stringify({
          step1: { companyName: 'Test Company', contactEmail: 'test@company.com' },
          step2: { vesselName: 'Test Vessel', vesselType: 'Bulk Carrier' }
        }));
      }, []);
      
      return <Story />;
    },
  ],
};

export default meta;
type Story = StoryObj<typeof meta>;

// @integration @persistence
export const ResumeFromStep3AfterReload: Story = {
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

    // Given: I have completed Steps 1 and 2 and am on Step 3
    // When: The browser automatically saves to localStorage (simulated by initialData)
    // Then: I should see the previously entered data
    const standardRadio = canvas.getByTestId('coverage-standard') as HTMLInputElement;
    const cargoValueField = canvas.getByTestId('cargo-value') as HTMLInputElement;
    
    expect(standardRadio.checked).toBe(true);
    expect(cargoValueField.value).toBe('2500000');

    // And: I should be able to navigate back to see all previously entered data
    await userEvent.click(canvas.getByTestId('back-button'));
    // Note: In real implementation, this would navigate back while preserving data
  },
};

// @integration @validation
export const CoverageSelectionRequired: Story = {
  args: {
    onReview: () => {},
    onBack: () => {},
  },
  play: async ({ canvasElement }) => {
    const canvas = within(canvasElement);

    // Given: I am on Step 3
    // When: I enter cargo value but don't select coverage level
    await userEvent.type(canvas.getByTestId('cargo-value'), '1500000');

    // Then: Review button should be disabled
    expect(canvas.getByTestId('review-button')).toBeDisabled();

    // When: I select coverage level
    await userEvent.click(canvas.getByTestId('coverage-premium'));

    // Then: Review button should be enabled
    expect(canvas.getByTestId('review-button')).not.toBeDisabled();
  },
};

// @integration @persistence
export const RealTimePersistenceStep3: Story = {
  args: {
    onReview: () => {},
    onBack: () => {},
  },
  play: async ({ canvasElement }) => {
    const canvas = within(canvasElement);

    // Given: I am on Step 3
    // When: I select coverage level
    await userEvent.click(canvas.getByTestId('coverage-standard'));
    
    // Then: localStorage should contain the selection
    let draftData = JSON.parse(localStorage.getItem('quoteDraft') || '{}');
    expect(draftData.step3.coverageLevel).toBe('Standard');

    // When: I enter cargo value
    await userEvent.type(canvas.getByTestId('cargo-value'), '3500000');
    
    // Then: localStorage should contain the cargo value
    await waitFor(() => {
      draftData = JSON.parse(localStorage.getItem('quoteDraft') || '{}');
      expect(draftData.step3.cargoValue).toBe('3500000');
    });
  },
};

// Validation scenarios
export const CargoValueValidation: Story = {
  args: {
    onReview: () => {},
    onBack: () => {},
  },
  play: async ({ canvasElement }) => {
    const canvas = within(canvasElement);

    // Test valid cargo value
    await userEvent.click(canvas.getByTestId('coverage-basic'));
    await userEvent.type(canvas.getByTestId('cargo-value'), '1000000');
    expect(canvas.getByTestId('review-button')).not.toBeDisabled();

    // Test invalid cargo value (0)
    await userEvent.clear(canvas.getByTestId('cargo-value'));
    await userEvent.type(canvas.getByTestId('cargo-value'), '0');
    expect(canvas.getByTestId('review-button')).toBeDisabled();
    await waitFor(() => {
      expect(canvas.getByTestId('cargo-value-error')).toBeInTheDocument();
    });

    // Test invalid cargo value (negative)
    await userEvent.clear(canvas.getByTestId('cargo-value'));
    await userEvent.type(canvas.getByTestId('cargo-value'), '-1000');
    expect(canvas.getByTestId('review-button')).toBeDisabled();
    
    // Test invalid cargo value (non-numeric)
    await userEvent.clear(canvas.getByTestId('cargo-value'));
    await userEvent.type(canvas.getByTestId('cargo-value'), 'abc');
    expect(canvas.getByTestId('review-button')).toBeDisabled();
  },
};

// UI Elements verification
export const VerifyCoverageLevelOptions: Story = {
  args: {
    onReview: () => {},
    onBack: () => {},
  },
  play: async ({ canvasElement }) => {
    const canvas = within(canvasElement);

    // Given: I am on Step 3
    // Then: I should see exactly these radio options
    expect(canvas.getByTestId('coverage-basic')).toBeInTheDocument();
    expect(canvas.getByTestId('coverage-standard')).toBeInTheDocument();
    expect(canvas.getByTestId('coverage-premium')).toBeInTheDocument();
    
    // Verify they are radio buttons (only one can be selected)
    await userEvent.click(canvas.getByTestId('coverage-basic'));
    expect(canvas.getByTestId('coverage-basic')).toBeChecked();
    
    await userEvent.click(canvas.getByTestId('coverage-standard'));
    expect(canvas.getByTestId('coverage-standard')).toBeChecked();
    expect(canvas.getByTestId('coverage-basic')).not.toBeChecked();
  },
};

// Number format acceptance
export const CargoValueNumberFormats: Story = {
  args: {
    onReview: () => {},
    onBack: () => {},
  },
  play: async ({ canvasElement }) => {
    const canvas = within(canvasElement);

    // Given: I am on Step 3 with coverage selected
    await userEvent.click(canvas.getByTestId('coverage-basic'));

    // When: I enter formatted number
    await userEvent.type(canvas.getByTestId('cargo-value'), '1500000.50');
    
    // Then: The field should accept it and Review button should be enabled
    const cargoField = canvas.getByTestId('cargo-value') as HTMLInputElement;
    expect(cargoField.value).toBe('1500000.50');
    expect(canvas.getByTestId('review-button')).not.toBeDisabled();
  },
};

// Loading state
export const LoadingState: Story = {
  args: {
    onReview: () => new Promise(resolve => setTimeout(resolve, 2000)),
    onBack: () => {},
  },
  play: async ({ canvasElement }) => {
    const canvas = within(canvasElement);

    // Fill valid data
    await userEvent.click(canvas.getByTestId('coverage-standard'));
    await userEvent.type(canvas.getByTestId('cargo-value'), '2000000');
    
    // Click review to trigger loading state
    await userEvent.click(canvas.getByTestId('review-button'));
    
    // In a real implementation, this would show a loading spinner
  },
};

// Error state
export const ErrorState: Story = {
  args: {
    onReview: () => {
      throw new Error('Failed to proceed to review');
    },
    onBack: () => {},
  },
  play: async ({ canvasElement }) => {
    const canvas = within(canvasElement);

    // Fill valid data
    await userEvent.click(canvas.getByTestId('coverage-premium'));
    await userEvent.type(canvas.getByTestId('cargo-value'), '5000000');
    
    // Try to proceed - would show error in real implementation
    try {
      await userEvent.click(canvas.getByTestId('review-button'));
    } catch {
      // Expected error for demo purposes
    }
  },
};

// Accessibility test
export const AccessibilityValidation: Story = {
  args: {
    onReview: () => {},
    onBack: () => {},
  },
  play: async ({ canvasElement }) => {
    const canvas = within(canvasElement);

    // Verify fieldset has proper structure
    const coverageFieldset = canvas.getByRole('radiogroup', { name: /coverage level/i });
    expect(coverageFieldset).toBeInTheDocument();

    // Verify cargo value field has label
    const cargoValueField = canvas.getByTestId('cargo-value');
    expect(cargoValueField).toHaveAccessibleName('Cargo Value ($)');

    // Verify step indicator is present
    expect(canvas.getByTestId('step-indicator')).toHaveTextContent('Step 3 of 3');

    // Test keyboard navigation through radio buttons
    const basicRadio = canvas.getByTestId('coverage-basic');
    const standardRadio = canvas.getByTestId('coverage-standard');
    const premiumRadio = canvas.getByTestId('coverage-premium');

    await userEvent.tab();
    expect(basicRadio).toHaveFocus();
    
    // Arrow keys should navigate between radio buttons
    await userEvent.keyboard('{ArrowDown}');
    expect(standardRadio).toHaveFocus();
    
    await userEvent.keyboard('{ArrowDown}');
    expect(premiumRadio).toHaveFocus();
  },
};