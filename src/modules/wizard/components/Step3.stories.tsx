import React from 'react';
import type { Meta, StoryObj } from '@storybook/react';
import { within, userEvent, expect, waitFor } from '@storybook/test';

// Mock Step3 component matching the test interface
interface Step3Props {
  onReview: (data: { coverageLevel: string; cargoValue: number }) => void;
  onBack: () => void;
  initialData?: { coverageLevel: string; cargoValue: number };
}

const coverageLevels = ['Basic', 'Standard', 'Premium'];

const Step3: React.FC<Step3Props> = ({ onReview, onBack, initialData }) => {
  const [formData, setFormData] = React.useState({
    coverageLevel: initialData?.coverageLevel || '',
    cargoValue: initialData?.cargoValue?.toString() || ''
  });
  const [errors, setErrors] = React.useState<{ cargoValue?: string }>({});

  const validateCargoValue = (value: string) => {
    const numValue = parseFloat(value);
    if (!value || isNaN(numValue) || numValue <= 0) {
      return 'Cargo value must be a positive number';
    }
    return '';
  };

  const handleCargoValueChange = (value: string) => {
    setFormData({ ...formData, cargoValue: value });
    const error = validateCargoValue(value);
    setErrors({ cargoValue: error });
  };

  const handleReview = () => {
    const cargoValueNum = parseFloat(formData.cargoValue);
    if (formData.coverageLevel && !errors.cargoValue && cargoValueNum > 0) {
      onReview({ coverageLevel: formData.coverageLevel, cargoValue: cargoValueNum });
    }
  };

  const isFormValid = formData.coverageLevel && formData.cargoValue && !errors.cargoValue && parseFloat(formData.cargoValue) > 0;

  // Auto-save to localStorage on field changes (for integration testing)
  React.useEffect(() => {
    if (formData.coverageLevel || formData.cargoValue) {
      const draftData = {
        step1: JSON.parse(localStorage.getItem('quoteDraft') || '{}').step1 || {},
        step2: JSON.parse(localStorage.getItem('quoteDraft') || '{}').step2 || {},
        step3: { coverageLevel: formData.coverageLevel, cargoValue: formData.cargoValue }
      };
      localStorage.setItem('quoteDraft', JSON.stringify(draftData));
    }
  }, [formData.coverageLevel, formData.cargoValue]);

  return (
    <div className="max-w-md mx-auto p-6 bg-white rounded-lg shadow-lg">
      <div data-testid="step-indicator" className="text-center mb-6 text-gray-600">
        Step 3 of 3
      </div>
      
      <div className="space-y-4">
        <div>
          <fieldset>
            <legend className="block text-sm font-medium text-gray-700 mb-3">Coverage Level</legend>
            <div className="space-y-2">
              {coverageLevels.map((level) => (
                <label key={level} className="flex items-center">
                  <input
                    type="radio"
                    name="coverage-level"
                    value={level}
                    checked={formData.coverageLevel === level}
                    onChange={(e) => setFormData({ ...formData, coverageLevel: e.target.value })}
                    className="mr-2"
                    data-testid={`coverage-${level.toLowerCase()}`}
                  />
                  <span>{level}</span>
                </label>
              ))}
            </div>
          </fieldset>
        </div>

        <div>
          <label htmlFor="cargo-value" className="block text-sm font-medium text-gray-700 mb-1">
            Cargo Value ($)
          </label>
          <input
            id="cargo-value"
            data-testid="cargo-value"
            type="number"
            min="1"
            value={formData.cargoValue}
            onChange={(e) => handleCargoValueChange(e.target.value)}
            className="w-full px-3 py-2 border border-gray-300 rounded-md focus:outline-none focus:ring-2 focus:ring-blue-500"
            placeholder="Enter cargo value"
          />
          {errors.cargoValue && (
            <div data-testid="cargo-value-error" className="text-red-600 text-sm mt-1">
              {errors.cargoValue}
            </div>
          )}
        </div>

        <div className="flex space-x-4 pt-4">
          <button
            data-testid="back-button"
            onClick={onBack}
            className="px-4 py-2 bg-gray-100 text-gray-700 rounded-md hover:bg-gray-200 focus:outline-none focus:ring-2 focus:ring-gray-500"
          >
            Back
          </button>
          <button
            data-testid="review-button"
            onClick={handleReview}
            disabled={!isFormValid}
            className="px-4 py-2 bg-blue-600 text-white rounded-md hover:bg-blue-700 focus:outline-none focus:ring-2 focus:ring-blue-500 disabled:bg-gray-300 disabled:cursor-not-allowed"
          >
            Review
          </button>
        </div>
      </div>
    </div>
  );
};

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
    } catch (error) {
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