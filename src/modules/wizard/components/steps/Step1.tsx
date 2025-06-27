import React, { useState, useEffect } from 'react';
import { validateEmail, validateRequired } from '../../utils/validation';

export interface Step1Props {
  onNext: (data: { companyName: string; contactEmail: string }) => void;
  onSaveDraft: (data: { companyName: string; contactEmail: string }) => void;
  onFieldChange?: (data: { companyName: string; contactEmail: string }) => void;
  initialData?: { companyName: string; contactEmail: string };
}

export const Step1: React.FC<Step1Props> = ({ onNext, onSaveDraft, onFieldChange, initialData }) => {
  const [formData, setFormData] = useState({
    companyName: initialData?.companyName || '',
    contactEmail: initialData?.contactEmail || ''
  });
  const [errors, setErrors] = useState<{ companyName?: string; contactEmail?: string }>({});
  const [draftSaved, setDraftSaved] = useState(false);

  // Update form data when initialData changes
  useEffect(() => {
    if (initialData) {
      setFormData({
        companyName: initialData.companyName || '',
        contactEmail: initialData.contactEmail || ''
      });
    }
  }, [initialData]);

  // Validate company name
  const validateCompanyName = (value: string) => {
    const result = validateRequired(value);
    return result.error;
  };

  // Validate email
  const validateEmailField = (value: string) => {
    const result = validateEmail(value);
    return result.error;
  };

  // Handle company name change
  const handleCompanyNameChange = (e: React.ChangeEvent<HTMLInputElement>) => {
    const value = e.target.value;
    const newFormData = { ...formData, companyName: value };
    setFormData(newFormData);
    
    // Real-time persistence
    onFieldChange?.(newFormData);
    
    // Clear error if field becomes valid
    if (errors.companyName && value.trim()) {
      setErrors(prev => ({ ...prev, companyName: undefined }));
    }
  };

  // Handle email change
  const handleEmailChange = (e: React.ChangeEvent<HTMLInputElement>) => {
    const value = e.target.value;
    const newFormData = { ...formData, contactEmail: value };
    setFormData(newFormData);
    
    // Real-time persistence
    onFieldChange?.(newFormData);
    
    // Clear error if field becomes valid
    if (errors.contactEmail && validateEmail(value).isValid) {
      setErrors(prev => ({ ...prev, contactEmail: undefined }));
    }
  };

  // Handle email blur for validation
  const handleEmailBlur = () => {
    const error = validateEmailField(formData.contactEmail);
    setErrors(prev => ({ ...prev, contactEmail: error || undefined }));
  };

  // Handle company name blur for validation
  const handleCompanyNameBlur = () => {
    const error = validateCompanyName(formData.companyName);
    setErrors(prev => ({ ...prev, companyName: error || undefined }));
  };

  // Handle save draft
  const handleSaveDraft = () => {
    onSaveDraft(formData);
    setDraftSaved(true);
    setTimeout(() => setDraftSaved(false), 3000);
  };

  // Handle next
  const handleNext = () => {
    const companyError = validateCompanyName(formData.companyName);
    const emailError = validateEmailField(formData.contactEmail);
    
    if (companyError || emailError) {
      setErrors({
        companyName: companyError || undefined,
        contactEmail: emailError || undefined
      });
      return;
    }

    onNext(formData);
  };

  // Check if form is valid
  const isFormValid = () => {
    return (
      formData.companyName.trim() !== '' &&
      formData.contactEmail.trim() !== '' &&
      !errors.companyName &&
      !errors.contactEmail &&
      validateEmail(formData.contactEmail).isValid &&
      validateRequired(formData.companyName).isValid
    );
  };

  return (
    <div className="w-[90%] md:w-auto md:max-w-md mx-auto p-2 md:p-6 bg-white rounded-lg shadow-lg">
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
            onChange={handleCompanyNameChange}
            onBlur={handleCompanyNameBlur}
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
            onChange={handleEmailChange}
            onBlur={handleEmailBlur}
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

        <div className="flex justify-between pt-4">
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
            className={`px-4 py-2 rounded focus:outline-none focus:ring-2 transition-colors ${isFormValid() ? 'bg-blue-500 text-white hover:bg-blue-600 focus:ring-blue-500' : 'bg-gray-300 text-gray-500 cursor-not-allowed'}`}
            type="button"
          >
            Next
          </button>
        </div>
      </div>
    </div>
  );
};