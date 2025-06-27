import { describe, it, expect, vi, beforeEach } from 'vitest';
import { render, screen } from '@testing-library/react';
import userEvent from '@testing-library/user-event';
import { Step2 } from './Step2';

describe('Feature: Maritime Insurance Quote Request Wizard Step 2 Component', () => {
  const mockOnNext = vi.fn();
  const mockOnBack = vi.fn();

  beforeEach(() => {
    vi.clearAllMocks();
  });

  describe('Scenario: Vessel type selection is required', () => {
    it('should disable Next button when vessel type is not selected', async () => {
      // Given (Arrange)
      const user = userEvent.setup();
      
      render(
        <Step2 
          onNext={mockOnNext} 
          onBack={mockOnBack}
        />
      );

      // When (Act)
      const vesselNameField = screen.getByTestId('vessel-name');
      const nextButton = screen.getByTestId('next-button');

      await user.type(vesselNameField, 'MV Trade Wind');

      // Then (Assert)
      expect(nextButton).toBeDisabled();
    });

    it('should enable Next button when vessel type is selected', async () => {
      // Given (Arrange)
      const user = userEvent.setup();
      
      render(
        <Step2 
          onNext={mockOnNext} 
          onBack={mockOnBack}
        />
      );

      // When (Act)
      const vesselNameField = screen.getByTestId('vessel-name');
      const vesselTypeSelect = screen.getByTestId('vessel-type');
      const nextButton = screen.getByTestId('next-button');

      await user.type(vesselNameField, 'MV Trade Wind');
      await user.selectOptions(vesselTypeSelect, 'Oil Tanker');

      // Then (Assert)
      expect(nextButton).not.toBeDisabled();
    });
  });

  describe('Scenario: Verify all vessel type options are available', () => {
    it('should show exactly the required vessel type options', () => {
      // Given (Arrange)
      render(
        <Step2 
          onNext={mockOnNext} 
          onBack={mockOnBack}
        />
      );

      // When (Act)
      const options = screen.getAllByTestId(/vessel-type-option-/);

      // Then (Assert)
      expect(options).toHaveLength(3);
      expect(screen.getByTestId('vessel-type-option-bulk-carrier')).toHaveTextContent('Bulk Carrier');
      expect(screen.getByTestId('vessel-type-option-oil-tanker')).toHaveTextContent('Oil Tanker');
      expect(screen.getByTestId('vessel-type-option-container-ship')).toHaveTextContent('Container Ship');
    });

    it('should not show any other vessel type options', () => {
      // Given (Arrange)
      render(
        <Step2 
          onNext={mockOnNext} 
          onBack={mockOnBack}
        />
      );

      // When (Act)
      // Then (Assert)
      expect(screen.queryByTestId('vessel-type-option-cruise-ship')).not.toBeInTheDocument();
      expect(screen.queryByTestId('vessel-type-option-yacht')).not.toBeInTheDocument();
      expect(screen.queryByTestId('vessel-type-option-fishing-vessel')).not.toBeInTheDocument();
    });
  });

  describe('Scenario: Navigation back preserves data', () => {
    it('should call onBack when Back button is clicked', async () => {
      // Given (Arrange)
      const user = userEvent.setup();
      
      render(
        <Step2 
          onNext={mockOnNext} 
          onBack={mockOnBack}
        />
      );

      // When (Act)
      const backButton = screen.getByTestId('back-button');
      await user.click(backButton);

      // Then (Assert)
      expect(mockOnBack).toHaveBeenCalledTimes(1);
    });

    it('should preserve entered data when navigating back and forth', () => {
      // Given (Arrange)
      const initialData = {
        vesselName: 'SS Cargo Master',
        vesselType: 'Container Ship'
      };

      // When (Act)
      render(
        <Step2 
          onNext={mockOnNext} 
          onBack={mockOnBack}
          initialData={initialData}
        />
      );

      // Then (Assert)
      const vesselNameField = screen.getByTestId('vessel-name') as HTMLInputElement;
      const vesselTypeSelect = screen.getByTestId('vessel-type') as HTMLSelectElement;
      
      expect(vesselNameField.value).toBe('SS Cargo Master');
      expect(vesselTypeSelect.value).toBe('Container Ship');
    });
  });

  describe('Scenario: Required vessel name validation', () => {
    it('should disable Next button when vessel name is empty', async () => {
      // Given (Arrange)
      const user = userEvent.setup();
      
      render(
        <Step2 
          onNext={mockOnNext} 
          onBack={mockOnBack}
        />
      );

      // When (Act)
      const vesselTypeSelect = screen.getByTestId('vessel-type');
      const nextButton = screen.getByTestId('next-button');

      await user.selectOptions(vesselTypeSelect, 'Oil Tanker');

      // Then (Assert)
      expect(nextButton).toBeDisabled();
    });

    it('should enable Next button when both vessel name and type are provided', async () => {
      // Given (Arrange)
      const user = userEvent.setup();
      
      render(
        <Step2 
          onNext={mockOnNext} 
          onBack={mockOnBack}
        />
      );

      // When (Act)
      const vesselNameField = screen.getByTestId('vessel-name');
      const vesselTypeSelect = screen.getByTestId('vessel-type');
      const nextButton = screen.getByTestId('next-button');

      await user.type(vesselNameField, 'MV Ocean Explorer');
      await user.selectOptions(vesselTypeSelect, 'Bulk Carrier');

      // Then (Assert)
      expect(nextButton).not.toBeDisabled();
    });
  });

  describe('Scenario: Form submission', () => {
    it('should call onNext with correct data when Next button is clicked', async () => {
      // Given (Arrange)
      const user = userEvent.setup();
      
      render(
        <Step2 
          onNext={mockOnNext} 
          onBack={mockOnBack}
        />
      );

      // When (Act)
      const vesselNameField = screen.getByTestId('vessel-name');
      const vesselTypeSelect = screen.getByTestId('vessel-type');
      const nextButton = screen.getByTestId('next-button');

      await user.type(vesselNameField, 'MV Ocean Pioneer');
      await user.selectOptions(vesselTypeSelect, 'Bulk Carrier');
      await user.click(nextButton);

      // Then (Assert)
      expect(mockOnNext).toHaveBeenCalledWith({
        vesselName: 'MV Ocean Pioneer',
        vesselType: 'Bulk Carrier'
      });
    });
  });

  describe('Scenario: Accessibility requirements', () => {
    it('should have associated labels for all input fields', () => {
      // Given (Arrange)
      render(
        <Step2 
          onNext={mockOnNext} 
          onBack={mockOnBack}
        />
      );

      // When (Act)
      const vesselNameField = screen.getByTestId('vessel-name');
      const vesselTypeSelect = screen.getByTestId('vessel-type');

      // Then (Assert)
      expect(vesselNameField).toHaveAccessibleName();
      expect(vesselTypeSelect).toHaveAccessibleName();
    });

    it('should show current step indicator', () => {
      // Given (Arrange)
      render(
        <Step2 
          onNext={mockOnNext} 
          onBack={mockOnBack}
        />
      );

      // When (Act)
      const stepIndicator = screen.getByTestId('step-indicator');

      // Then (Assert)
      expect(stepIndicator).toHaveTextContent('Step 2 of 3');
    });

    it('should be keyboard navigable', async () => {
      // Given (Arrange)
      const user = userEvent.setup();
      
      render(
        <Step2 
          onNext={mockOnNext} 
          onBack={mockOnBack}
        />
      );

      // When (Act)
      await user.tab();
      expect(screen.getByTestId('vessel-name')).toHaveFocus();
      
      await user.tab();
      expect(screen.getByTestId('vessel-type')).toHaveFocus();
      
      await user.tab();
      expect(screen.getByTestId('back-button')).toHaveFocus();
      
      // Verify that with valid form data, next button can be focused
      await user.type(screen.getByTestId('vessel-name'), 'Test Vessel');
      await user.selectOptions(screen.getByTestId('vessel-type'), 'Bulk Carrier');
      await user.click(screen.getByTestId('next-button'));
      expect(screen.getByTestId('next-button')).toHaveFocus();

      // Then (Assert)
      // Focus flow is verified through the above expectations
    });

    it('should have visible hover states for buttons', async () => {
      // Given (Arrange)
      const user = userEvent.setup();
      
      render(
        <Step2 
          onNext={mockOnNext} 
          onBack={mockOnBack}
        />
      );

      // When (Act)
      const backButton = screen.getByTestId('back-button');
      await user.hover(backButton);

      // Then (Assert)
      expect(backButton).toHaveClass('hover:bg-gray-200');
    });
  });
});