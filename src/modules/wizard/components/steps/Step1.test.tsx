import { describe, it, expect, vi, beforeEach } from 'vitest';
import { render, screen, waitFor } from '@testing-library/react';
import userEvent from '@testing-library/user-event';
import { Step1 } from './Step1';

describe('Feature: Maritime Insurance Quote Request Wizard Step 1 Component', () => {
  const mockOnNext = vi.fn();
  const mockOnSaveDraft = vi.fn();

  beforeEach(() => {
    vi.clearAllMocks();
  });

  describe('Scenario: Required field validation on Step 1', () => {
    it('should disable Next button when company name is empty', async () => {
      // Given (Arrange)
      const user = userEvent.setup();
      
      render(
        <Step1 
          onNext={mockOnNext} 
          onSaveDraft={mockOnSaveDraft}
          initialData={{ companyName: '', contactEmail: 'contact@company.com' }}
        />
      );

      // When (Act)
      const nextButton = screen.getByTestId('next-button');
      const companyField = screen.getByTestId('company-name');
      const emailField = screen.getByTestId('contact-email');

      await user.clear(companyField);
      await user.type(emailField, 'contact@company.com');

      // Then (Assert)
      expect(nextButton).toBeDisabled();
    });

    it('should disable Next button when email is cleared', async () => {
      // Given (Arrange)
      const user = userEvent.setup();
      
      render(
        <Step1 
          onNext={mockOnNext} 
          onSaveDraft={mockOnSaveDraft}
          initialData={{ companyName: 'My Company', contactEmail: '' }}
        />
      );

      // When (Act)
      const nextButton = screen.getByTestId('next-button');
      const companyField = screen.getByTestId('company-name');
      const emailField = screen.getByTestId('contact-email');

      await user.type(companyField, 'My Company');
      await user.clear(emailField);

      // Then (Assert)
      expect(nextButton).toBeDisabled();
    });

    it('should enable Next button when both fields are valid', async () => {
      // Given (Arrange)
      const user = userEvent.setup();
      
      render(
        <Step1 
          onNext={mockOnNext} 
          onSaveDraft={mockOnSaveDraft}
        />
      );

      // When (Act)
      const nextButton = screen.getByTestId('next-button');
      const companyField = screen.getByTestId('company-name');
      const emailField = screen.getByTestId('contact-email');

      await user.type(companyField, 'My Company');
      await user.type(emailField, 'contact@company.com');

      // Then (Assert)
      expect(nextButton).not.toBeDisabled();
    });
  });

  describe('Scenario: Email validation on Step 1', () => {
    it('should show error for invalid email format', async () => {
      // Given (Arrange)
      const user = userEvent.setup();
      
      render(
        <Step1 
          onNext={mockOnNext} 
          onSaveDraft={mockOnSaveDraft}
        />
      );

      // When (Act)
      const emailField = screen.getByTestId('contact-email');
      await user.type(emailField, 'invalid.email');
      await user.tab(); // Trigger blur event

      // Then (Assert)
      await waitFor(() => {
        expect(screen.getByTestId('email-error')).toBeInTheDocument();
      });
      expect(screen.getByTestId('next-button')).toBeDisabled();
    });

    it('should clear error when valid email is entered', async () => {
      // Given (Arrange)
      const user = userEvent.setup();
      
      render(
        <Step1 
          onNext={mockOnNext} 
          onSaveDraft={mockOnSaveDraft}
        />
      );

      // When (Act)
      const emailField = screen.getByTestId('contact-email');
      const companyField = screen.getByTestId('company-name');
      
      await user.type(emailField, 'invalid.email');
      await user.tab();
      await waitFor(() => {
        expect(screen.getByTestId('email-error')).toBeInTheDocument();
      });
      
      await user.clear(emailField);
      await user.type(emailField, 'valid@email.com');
      await user.type(companyField, 'Valid Company');
      await user.tab();

      // Then (Assert)
      await waitFor(() => {
        expect(screen.queryByTestId('email-error')).not.toBeInTheDocument();
      });
      expect(screen.getByTestId('next-button')).not.toBeDisabled();
    });
  });

  describe('Scenario: Save draft functionality', () => {
    it('should call onSaveDraft when Save Draft button is clicked', async () => {
      // Given (Arrange)
      const user = userEvent.setup();
      
      render(
        <Step1 
          onNext={mockOnNext} 
          onSaveDraft={mockOnSaveDraft}
        />
      );

      // When (Act)
      const companyField = screen.getByTestId('company-name');
      const emailField = screen.getByTestId('contact-email');
      const saveDraftButton = screen.getByTestId('save-draft-button');

      await user.type(companyField, 'Atlantic Vessels Inc');
      await user.type(emailField, 'info@atlanticvessels.com');
      await user.click(saveDraftButton);

      // Then (Assert)
      expect(mockOnSaveDraft).toHaveBeenCalledWith({
        companyName: 'Atlantic Vessels Inc',
        contactEmail: 'info@atlanticvessels.com'
      });
    });

    it('should show draft saved message after saving', async () => {
      // Given (Arrange)
      const user = userEvent.setup();
      
      render(
        <Step1 
          onNext={mockOnNext} 
          onSaveDraft={mockOnSaveDraft}
        />
      );

      // When (Act)
      const companyField = screen.getByTestId('company-name');
      const emailField = screen.getByTestId('contact-email');
      const saveDraftButton = screen.getByTestId('save-draft-button');

      await user.type(companyField, 'Atlantic Vessels Inc');
      await user.type(emailField, 'info@atlanticvessels.com');
      await user.click(saveDraftButton);

      // Then (Assert)
      await waitFor(() => {
        expect(screen.getByTestId('draft-saved-message')).toBeInTheDocument();
      });
    });
  });

  describe('Scenario: Load initial data', () => {
    it('should populate fields with initial data when provided', () => {
      // Given (Arrange)
      const initialData = {
        companyName: 'Atlantic Vessels Inc',
        contactEmail: 'info@atlanticvessels.com'
      };

      // When (Act)
      render(
        <Step1 
          onNext={mockOnNext} 
          onSaveDraft={mockOnSaveDraft}
          initialData={initialData}
        />
      );

      // Then (Assert)
      const companyField = screen.getByTestId('company-name') as HTMLInputElement;
      const emailField = screen.getByTestId('contact-email') as HTMLInputElement;
      
      expect(companyField.value).toBe('Atlantic Vessels Inc');
      expect(emailField.value).toBe('info@atlanticvessels.com');
    });
  });

  describe('Scenario: Field validation triggers on blur', () => {
    it('should validate email immediately on blur', async () => {
      // Given (Arrange)
      const user = userEvent.setup();
      
      render(
        <Step1 
          onNext={mockOnNext} 
          onSaveDraft={mockOnSaveDraft}
        />
      );

      // When (Act)
      const emailField = screen.getByTestId('contact-email');
      
      await user.click(emailField);
      await user.type(emailField, 'invalid-email');
      await user.tab();

      // Then (Assert)
      await waitFor(() => {
        expect(screen.getByTestId('email-error')).toBeInTheDocument();
      });
    });

    it('should clear validation error when field becomes valid', async () => {
      // Given (Arrange)
      const user = userEvent.setup();
      
      render(
        <Step1 
          onNext={mockOnNext} 
          onSaveDraft={mockOnSaveDraft}
        />
      );

      // When (Act)
      const emailField = screen.getByTestId('contact-email');
      
      await user.click(emailField);
      await user.type(emailField, 'invalid-email');
      await user.tab();
      
      await waitFor(() => {
        expect(screen.getByTestId('email-error')).toBeInTheDocument();
      });
      
      await user.click(emailField);
      await user.clear(emailField);
      await user.type(emailField, 'valid@email.com');
      await user.tab();

      // Then (Assert)
      await waitFor(() => {
        expect(screen.queryByTestId('email-error')).not.toBeInTheDocument();
      });
    });
  });

  describe('Scenario: Accessibility requirements', () => {
    it('should have associated labels for all input fields', () => {
      // Given (Arrange)
      render(
        <Step1 
          onNext={mockOnNext} 
          onSaveDraft={mockOnSaveDraft}
        />
      );

      // When (Act)
      const companyField = screen.getByTestId('company-name');
      const emailField = screen.getByTestId('contact-email');

      // Then (Assert)
      expect(companyField).toHaveAccessibleName();
      expect(emailField).toHaveAccessibleName();
    });

    it('should show current step indicator', () => {
      // Given (Arrange)
      render(
        <Step1 
          onNext={mockOnNext} 
          onSaveDraft={mockOnSaveDraft}
        />
      );

      // When (Act)
      const stepIndicator = screen.getByTestId('step-indicator');

      // Then (Assert)
      expect(stepIndicator).toHaveTextContent('Step 1 of 3');
    });

    it('should have visible hover states for buttons', async () => {
      // Given (Arrange)
      const user = userEvent.setup();
      
      render(
        <Step1 
          onNext={mockOnNext} 
          onSaveDraft={mockOnSaveDraft}
        />
      );

      // When (Act)
      const saveDraftButton = screen.getByTestId('save-draft-button');
      await user.hover(saveDraftButton);

      // Then (Assert)
      expect(saveDraftButton).toHaveClass('hover:bg-gray-200');
    });

    it('should be keyboard navigable', async () => {
      // Given (Arrange)
      const user = userEvent.setup();
      
      render(
        <Step1 
          onNext={mockOnNext} 
          onSaveDraft={mockOnSaveDraft}
        />
      );

      // When (Act)
      await user.tab();
      expect(screen.getByTestId('company-name')).toHaveFocus();
      
      await user.tab();
      expect(screen.getByTestId('contact-email')).toHaveFocus();
      
      await user.tab();
      expect(screen.getByTestId('save-draft-button')).toHaveFocus();
      
      // Note: Disabled buttons are not focusable, so we test with valid form data
      await user.type(screen.getByTestId('company-name'), 'Test Company');
      await user.type(screen.getByTestId('contact-email'), 'test@company.com');
      
      // Re-focus on company name and test again
      await user.click(screen.getByTestId('company-name'));
      await user.tab();
      await user.tab();
      await user.tab();
      
      // Now the next button should be focusable since form is valid
      expect(screen.getByTestId('next-button')).toHaveFocus();

      // Then (Assert)
      // Focus flow is verified through the above expectations
    });
  });
});