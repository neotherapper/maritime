import React, { useState, useEffect } from 'react';
import { useStep1Validation } from '../../hooks/useFormValidation';

export interface Step1RefactoredProps {
  onNext: (data: { companyName: string; contactEmail: string }) => void;
  onSaveDraft: (data: { companyName: string; contactEmail: string }) => void;
  initialData?: { companyName: string; contactEmail: string };
}

export const Step1Refactored: React.FC<Step1RefactoredProps> = ({ 
  onNext, 
  onSaveDraft, 
  initialData = { companyName: '', contactEmail: '' }
}) => {
  const {
    formData,
    errors,
    updateField,
    validateOnBlur,
    validateAll,
    isFormValid,
    setFormData
  } = useStep1Validation(initialData);

  const [draftSaved, setDraftSaved] = useState(false);

  // Update form data when initialData changes
  useEffect(() => {
    if (initialData) {
      setFormData(initialData);
    }
  }, [initialData, setFormData]);

  const handleSaveDraft = () => {
    onSaveDraft(formData);
    setDraftSaved(true);
    setTimeout(() => setDraftSaved(false), 3000);
  };

  const handleNext = () => {
    if (validateAll()) {
      onNext(formData);
    }
  };

  return (
    <div className="max-w-md mx-auto p-6 bg-white rounded-lg shadow-lg">
      <div data-testid="step-indicator" className="text-center mb-6 text-gray-600 text-lg font-medium">
        Step 1 of 3
      </div>
      
      <div className="space-y-4">
        <div>
          <label 
            htmlFor="company-name" 
            className="block text-sm font-medium text-gray-700 mb-1"
          >
            Company Name
          </label>
          <input
            id="company-name"
            data-testid="company-name"
            type="text"
            value={formData.companyName}
            onChange={(e) => updateField('companyName', e.target.value)}
            onBlur={() => validateOnBlur('companyName')}
            className="w-full px-3 py-2 border border-gray-300 rounded-md focus:outline-none focus:ring-2 focus:ring-blue-500 focus:border-blue-500"
            placeholder="Enter company name"
            aria-invalid={!!errors.companyName}
            aria-describedby={errors.companyName ? "company-name-error" : undefined}
          />
          {errors.companyName && (
            <div 
              id="company-name-error"
              data-testid="company-name-error" 
              className="text-red-600 text-sm mt-1"
              role="alert"
            >
              {errors.companyName}
            </div>
          )}
        </div>

        <div>
          <label 
            htmlFor="contact-email" 
            className="block text-sm font-medium text-gray-700 mb-1"
          >
            Contact Email
          </label>
          <input
            id="contact-email"
            data-testid="contact-email"
            type="email"
            value={formData.contactEmail}
            onChange={(e) => updateField('contactEmail', e.target.value)}
            onBlur={() => validateOnBlur('contactEmail')}
            className="w-full px-3 py-2 border border-gray-300 rounded-md focus:outline-none focus:ring-2 focus:ring-blue-500 focus:border-blue-500"
            placeholder="Enter contact email"
            aria-invalid={!!errors.contactEmail}
            aria-describedby={errors.contactEmail ? "contact-email-error" : undefined}
          />
          {errors.contactEmail && (
            <div 
              id="contact-email-error"
              data-testid="email-error" 
              className="text-red-600 text-sm mt-1"
              role="alert"
            >
              {errors.contactEmail}
            </div>
          )}
        </div>

        {draftSaved && (
          <div 
            data-testid="draft-saved-message" 
            className="bg-green-100 border border-green-400 text-green-700 px-4 py-3 rounded"
            role="alert"
          >
            Draft saved successfully!
          </div>
        )}

        <div className="flex space-x-4 pt-4">
          <button
            data-testid="save-draft-button"
            onClick={handleSaveDraft}
            className="px-4 py-2 bg-gray-100 text-gray-700 rounded-md hover:bg-gray-200 focus:outline-none focus:ring-2 focus:ring-gray-500 transition-colors"
            type="button"
          >
            Save Draft
          </button>
          <button
            data-testid="next-button"
            onClick={handleNext}
            disabled={!isFormValid()}
            className="px-4 py-2 bg-blue-600 text-white rounded-md hover:bg-blue-700 focus:outline-none focus:ring-2 focus:ring-blue-500 disabled:bg-gray-300 disabled:cursor-not-allowed transition-colors"
            type="button"
          >
            Next
          </button>
        </div>
      </div>
    </div>
  );
};