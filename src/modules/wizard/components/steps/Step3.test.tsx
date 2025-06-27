import { describe, it, expect, vi, beforeEach } from 'vitest';
import { render, screen, waitFor } from '@testing-library/react';
import userEvent from '@testing-library/user-event';
import { Step3 } from './Step3';

describe('Feature: Maritime Insurance Quote Request Wizard Step 3 Component', () => {
  const mockOnReview = vi.fn();
  const mockOnBack = vi.fn();

  beforeEach(() => {
    vi.clearAllMocks();
  });

  describe('Scenario: Coverage level selection is required', () => {
    it('should disable Review button when coverage level is not selected', async () => {
      // Given (Arrange)
      const user = userEvent.setup();
      
      render(
        <Step3 
          onReview={mockOnReview} 
          onBack={mockOnBack}
        />
      );

      // When (Act)
      const cargoValueField = screen.getByTestId('cargo-value');
      const reviewButton = screen.getByTestId('review-button');

      await user.type(cargoValueField, '1500000');

      // Then (Assert)
      expect(reviewButton).toBeDisabled();
    });

    it('should enable Review button when coverage level is selected', async () => {
      // Given (Arrange)
      const user = userEvent.setup();
      
      render(
        <Step3 
          onReview={mockOnReview} 
          onBack={mockOnBack}
        />
      );

      // When (Act)
      const cargoValueField = screen.getByTestId('cargo-value');
      const premiumRadio = screen.getByTestId('coverage-premium');
      const reviewButton = screen.getByTestId('review-button');

      await user.type(cargoValueField, '1500000');
      await user.click(premiumRadio);

      // Then (Assert)
      expect(reviewButton).not.toBeDisabled();
    });
  });

  describe('Scenario: Verify all coverage level options are available', () => {
    it('should show exactly the required coverage level options', () => {
      // Given (Arrange)
      render(
        <Step3 
          onReview={mockOnReview} 
          onBack={mockOnBack}
        />
      );

      // When (Act)
      const basicRadio = screen.getByTestId('coverage-basic');
      const standardRadio = screen.getByTestId('coverage-standard');
      const premiumRadio = screen.getByTestId('coverage-premium');

      // Then (Assert)
      expect(basicRadio).toBeInTheDocument();
      expect(standardRadio).toBeInTheDocument();
      expect(premiumRadio).toBeInTheDocument();
      expect(basicRadio).toHaveAttribute('value', 'Basic');
      expect(standardRadio).toHaveAttribute('value', 'Standard');
      expect(premiumRadio).toHaveAttribute('value', 'Premium');
    });

    it('should not show any other coverage level options', () => {
      // Given (Arrange)
      render(
        <Step3 
          onReview={mockOnReview} 
          onBack={mockOnBack}
        />
      );

      // When (Act)
      // Then (Assert)
      expect(screen.queryByTestId('coverage-enterprise')).not.toBeInTheDocument();
      expect(screen.queryByTestId('coverage-deluxe')).not.toBeInTheDocument();
      expect(screen.queryByTestId('coverage-minimal')).not.toBeInTheDocument();
    });
  });

  describe('Scenario: Cargo value validation', () => {
    it('should enable Review button for valid positive number', async () => {
      // Given (Arrange)
      const user = userEvent.setup();
      
      render(
        <Step3 
          onReview={mockOnReview} 
          onBack={mockOnBack}
        />
      );

      // When (Act)
      const cargoValueField = screen.getByTestId('cargo-value');
      const basicRadio = screen.getByTestId('coverage-basic');
      const reviewButton = screen.getByTestId('review-button');

      await user.type(cargoValueField, '1000000');
      await user.click(basicRadio);

      // Then (Assert)
      expect(reviewButton).not.toBeDisabled();
      expect(screen.queryByTestId('cargo-value-error')).not.toBeInTheDocument();
    });

    it('should enable Review button for minimum value of 1', async () => {
      // Given (Arrange)
      const user = userEvent.setup();
      
      render(
        <Step3 
          onReview={mockOnReview} 
          onBack={mockOnBack}
        />
      );

      // When (Act)
      const cargoValueField = screen.getByTestId('cargo-value');
      const basicRadio = screen.getByTestId('coverage-basic');
      const reviewButton = screen.getByTestId('review-button');

      await user.type(cargoValueField, '1');
      await user.click(basicRadio);

      // Then (Assert)
      expect(reviewButton).not.toBeDisabled();
      expect(screen.queryByTestId('cargo-value-error')).not.toBeInTheDocument();
    });

    it('should disable Review button for zero value', async () => {
      // Given (Arrange)
      const user = userEvent.setup();
      
      render(
        <Step3 
          onReview={mockOnReview} 
          onBack={mockOnBack}
        />
      );

      // When (Act)
      const cargoValueField = screen.getByTestId('cargo-value');
      const basicRadio = screen.getByTestId('coverage-basic');
      const reviewButton = screen.getByTestId('review-button');

      await user.type(cargoValueField, '0');
      await user.click(basicRadio);
      await user.tab(); // Trigger validation

      // Then (Assert)
      expect(reviewButton).toBeDisabled();
      await waitFor(() => {
        expect(screen.getByTestId('cargo-value-error')).toBeInTheDocument();
      });
    });

    it('should disable Review button for negative value', async () => {
      // Given (Arrange)
      const user = userEvent.setup();
      
      render(
        <Step3 
          onReview={mockOnReview} 
          onBack={mockOnBack}
        />
      );

      // When (Act)
      const cargoValueField = screen.getByTestId('cargo-value');
      const basicRadio = screen.getByTestId('coverage-basic');
      const reviewButton = screen.getByTestId('review-button');

      await user.type(cargoValueField, '-1000');
      await user.click(basicRadio);
      await user.tab(); // Trigger validation

      // Then (Assert)
      expect(reviewButton).toBeDisabled();
      await waitFor(() => {
        expect(screen.getByTestId('cargo-value-error')).toBeInTheDocument();
      });
    });

    it('should disable Review button for non-numeric value', async () => {
      // Given (Arrange)
      const user = userEvent.setup();
      
      render(
        <Step3 
          onReview={mockOnReview} 
          onBack={mockOnBack}
        />
      );

      // When (Act)
      const cargoValueField = screen.getByTestId('cargo-value');
      const basicRadio = screen.getByTestId('coverage-basic');
      const reviewButton = screen.getByTestId('review-button');

      await user.type(cargoValueField, 'abc');
      await user.click(basicRadio);
      await user.tab(); // Trigger validation

      // Then (Assert)
      expect(reviewButton).toBeDisabled();
      await waitFor(() => {
        expect(screen.getByTestId('cargo-value-error')).toBeInTheDocument();
      });
    });

    it('should disable Review button for empty value', async () => {
      // Given (Arrange)
      const user = userEvent.setup();
      
      render(
        <Step3 
          onReview={mockOnReview} 
          onBack={mockOnBack}
        />
      );

      // When (Act)
      const basicRadio = screen.getByTestId('coverage-basic');
      const reviewButton = screen.getByTestId('review-button');

      await user.click(basicRadio);

      // Then (Assert)
      expect(reviewButton).toBeDisabled();
    });
  });

  describe('Scenario: Cargo value accepts valid number formats', () => {
    it('should parse and accept formatted number string', async () => {
      // Given (Arrange)
      const user = userEvent.setup();
      
      render(
        <Step3 
          onReview={mockOnReview} 
          onBack={mockOnBack}
        />
      );

      // When (Act)
      const cargoValueField = screen.getByTestId('cargo-value');
      const basicRadio = screen.getByTestId('coverage-basic');
      const reviewButton = screen.getByTestId('review-button');

      await user.type(cargoValueField, '1,500,000.50');
      await user.click(basicRadio);

      // Then (Assert)
      expect(reviewButton).not.toBeDisabled();
      expect(screen.queryByTestId('cargo-value-error')).not.toBeInTheDocument();
    });
  });

  describe('Scenario: Navigation and form submission', () => {
    it('should call onBack when Back button is clicked', async () => {
      // Given (Arrange)
      const user = userEvent.setup();
      
      render(
        <Step3 
          onReview={mockOnReview} 
          onBack={mockOnBack}
        />
      );

      // When (Act)
      const backButton = screen.getByTestId('back-button');
      await user.click(backButton);

      // Then (Assert)
      expect(mockOnBack).toHaveBeenCalledTimes(1);
    });

    it('should call onReview with correct data when Review button is clicked', async () => {
      // Given (Arrange)
      const user = userEvent.setup();
      
      render(
        <Step3 
          onReview={mockOnReview} 
          onBack={mockOnBack}
        />
      );

      // When (Act)
      const cargoValueField = screen.getByTestId('cargo-value');
      const standardRadio = screen.getByTestId('coverage-standard');
      const reviewButton = screen.getByTestId('review-button');

      await user.type(cargoValueField, '2500000');
      await user.click(standardRadio);
      await user.click(reviewButton);

      // Then (Assert)
      expect(mockOnReview).toHaveBeenCalledWith({
        coverageLevel: 'Standard',
        cargoValue: 2500000
      });
    });
  });

  describe('Scenario: Load initial data', () => {
    it('should populate fields with initial data when provided', () => {
      // Given (Arrange)
      const initialData = {
        coverageLevel: 'Standard',
        cargoValue: 2500000
      };

      // When (Act)
      render(
        <Step3 
          onReview={mockOnReview} 
          onBack={mockOnBack}
          initialData={initialData}
        />
      );

      // Then (Assert)
      const cargoValueField = screen.getByTestId('cargo-value') as HTMLInputElement;
      const standardRadio = screen.getByTestId('coverage-standard') as HTMLInputElement;
      
      expect(cargoValueField.value).toBe('2500000');
      expect(standardRadio.checked).toBe(true);
    });
  });

  describe('Scenario: Accessibility requirements', () => {
    it('should have associated labels for all input fields', () => {
      // Given (Arrange)
      render(
        <Step3 
          onReview={mockOnReview} 
          onBack={mockOnBack}
        />
      );

      // When (Act)
      const cargoValueField = screen.getByTestId('cargo-value');
      const basicRadio = screen.getByTestId('coverage-basic');
      const standardRadio = screen.getByTestId('coverage-standard');
      const premiumRadio = screen.getByTestId('coverage-premium');

      // Then (Assert)
      expect(cargoValueField).toHaveAccessibleName();
      expect(basicRadio).toHaveAccessibleName();
      expect(standardRadio).toHaveAccessibleName();
      expect(premiumRadio).toHaveAccessibleName();
    });

    it('should show current step indicator', () => {
      // Given (Arrange)
      render(
        <Step3 
          onReview={mockOnReview} 
          onBack={mockOnBack}
        />
      );

      // When (Act)
      const stepIndicator = screen.getByTestId('step-indicator');

      // Then (Assert)
      expect(stepIndicator).toHaveTextContent('Step 3 of 3');
    });

    it('should be keyboard navigable', async () => {
      // Given (Arrange)
      const user = userEvent.setup();
      
      render(
        <Step3 
          onReview={mockOnReview} 
          onBack={mockOnBack}
        />
      );

      // When (Act)
      // Radio button groups have different tab behavior - first radio gets focus, then use arrow keys
      await user.tab();
      expect(screen.getByTestId('coverage-basic')).toHaveFocus();
      
      // Radio buttons are navigated with arrow keys, not tab
      await user.keyboard('{ArrowDown}');
      expect(screen.getByTestId('coverage-standard')).toHaveFocus();
      
      await user.keyboard('{ArrowDown}');
      expect(screen.getByTestId('coverage-premium')).toHaveFocus();
      
      await user.tab();
      expect(screen.getByTestId('cargo-value')).toHaveFocus();
      
      await user.tab();
      expect(screen.getByTestId('back-button')).toHaveFocus();
      
      // Verify that with valid form data, review button can be focused
      await user.click(screen.getByTestId('coverage-basic'));
      await user.type(screen.getByTestId('cargo-value'), '1000000');
      await user.click(screen.getByTestId('review-button'));
      expect(screen.getByTestId('review-button')).toHaveFocus();

      // Then (Assert)
      // Focus flow is verified through the above expectations
    });

    it('should have visible hover states for buttons', async () => {
      // Given (Arrange)
      const user = userEvent.setup();
      
      render(
        <Step3 
          onReview={mockOnReview} 
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