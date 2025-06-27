import React, { useState, useEffect } from 'react';
import { validateCargoValue, parseFormattedNumber } from '../../utils/validation';

export interface Step3Props {
  onReview: (data: { coverageLevel: string; cargoValue: number }) => void;
  onBack: () => void;
  onFieldChange?: (data: { coverageLevel: string; cargoValue: number }) => void;
  initialData?: { coverageLevel: string; cargoValue: number };
}

const COVERAGE_LEVELS = [
  'Basic',
  'Standard',
  'Premium'
] as const;

export const Step3: React.FC<Step3Props> = ({ onReview, onBack, onFieldChange, initialData }) => {
  const [formData, setFormData] = useState({
    coverageLevel: initialData?.coverageLevel || '',
    cargoValue: initialData?.cargoValue?.toString() || ''
  });
  const [errors, setErrors] = useState<{ coverageLevel?: string; cargoValue?: string }>({});

  // Update form data when initialData changes
  useEffect(() => {
    if (initialData) {
      setFormData({
        coverageLevel: initialData.coverageLevel || '',
        cargoValue: initialData.cargoValue?.toString() || ''
      });
    }
  }, [initialData]);

  // Validate coverage level
  const validateCoverageLevel = (value: string) => {
    if (!value) {
      return 'Coverage level is required';
    }
    return null;
  };

  // Validate cargo value field
  const validateCargoValueField = (value: string) => {
    const result = validateCargoValue(value);
    return result.error;
  };

  // Handle coverage level change
  const handleCoverageLevelChange = (e: React.ChangeEvent<HTMLInputElement>) => {
    const value = e.target.value;
    const newFormData = { ...formData, coverageLevel: value };
    setFormData(newFormData);
    
    // Real-time persistence (convert cargoValue to number for the callback)
    const cargoValueNum = parseFloat(newFormData.cargoValue) || 0;
    onFieldChange?.({ coverageLevel: value, cargoValue: cargoValueNum });
    
    // Clear error if field becomes valid
    if (errors.coverageLevel && value) {
      setErrors(prev => ({ ...prev, coverageLevel: undefined }));
    }
  };

  // Handle cargo value change
  const handleCargoValueChange = (e: React.ChangeEvent<HTMLInputElement>) => {
    const value = e.target.value;
    // Remove commas and non-numeric characters except dots for decimals and minus sign
    const cleanValue = value.replace(/[^0-9.-]/g, '');
    const newFormData = { ...formData, cargoValue: cleanValue };
    setFormData(newFormData);
    
    // Real-time persistence (convert cargoValue to number for the callback)
    const cargoValueNum = parseFloat(cleanValue) || 0;
    onFieldChange?.({ coverageLevel: newFormData.coverageLevel, cargoValue: cargoValueNum });
    
    // Clear error if field becomes valid
    if (errors.cargoValue && validateCargoValue(cleanValue).isValid) {
      setErrors(prev => ({ ...prev, cargoValue: undefined }));
    }
  };

  // Handle cargo value blur
  const handleCargoValueBlur = () => {
    const error = validateCargoValueField(formData.cargoValue);
    setErrors(prev => ({ ...prev, cargoValue: error || undefined }));
  };

  // Handle review
  const handleReview = () => {
    const coverageLevelError = validateCoverageLevel(formData.coverageLevel);
    const cargoValueError = validateCargoValueField(formData.cargoValue);
    
    if (coverageLevelError || cargoValueError) {
      setErrors({
        coverageLevel: coverageLevelError || undefined,
        cargoValue: cargoValueError || undefined
      });
      return;
    }

    // Parse cargo value to number
    const cargoValueNum = typeof formData.cargoValue === 'string' 
      ? parseFormattedNumber(formData.cargoValue)
      : parseFloat(formData.cargoValue);

    onReview({
      coverageLevel: formData.coverageLevel,
      cargoValue: cargoValueNum
    });
  };

  // Check if form is valid
  const isFormValid = () => {
    return (
      formData.coverageLevel !== '' &&
      formData.cargoValue !== '' &&
      !errors.coverageLevel &&
      !errors.cargoValue &&
      validateCargoValue(formData.cargoValue).isValid
    );
  };

  return (
    <div className="w-[90%] md:w-auto md:max-w-md mx-auto p-2 md:p-6 bg-white rounded-lg shadow-lg">
      <div data-testid="step-indicator" className="text-center mb-6 text-gray-600 text-lg font-medium">
        Step 3 of 3
      </div>
      
      <div className="space-y-4">
        <div>
          <fieldset>
            <legend className="block text-sm font-medium text-gray-700 mb-3">
              Coverage Level
            </legend>
            <div className="space-y-2">
              {COVERAGE_LEVELS.map((level) => (
                <div key={level} className="flex items-center">
                  <input
                    id={`coverage-${level.toLowerCase()}`}
                    data-testid={`coverage-${level.toLowerCase()}`}
                    type="radio"
                    name="coverageLevel"
                    value={level}
                    checked={formData.coverageLevel === level}
                    onChange={handleCoverageLevelChange}
                    className="h-4 w-4 text-blue-600 focus:ring-blue-500 border-gray-300"
                    aria-describedby={errors.coverageLevel ? "coverage-level-error" : undefined}
                  />
                  <label 
                    htmlFor={`coverage-${level.toLowerCase()}`}
                    className="ml-2 block text-sm text-gray-900"
                  >
                    {level}
                  </label>
                </div>
              ))}
            </div>
            {errors.coverageLevel && (
              <div 
                id="coverage-level-error"
                data-testid="coverage-level-error" 
                className="text-red-600 text-sm mt-1"
                role="alert"
              >
                {errors.coverageLevel}
              </div>
            )}
          </fieldset>
        </div>

        <div>
          <label 
            htmlFor="cargo-value" 
            className="block text-sm font-medium text-gray-700 mb-1"
          >
            Cargo Value
          </label>
          <input
            id="cargo-value"
            data-testid="cargo-value"
            type="text"
            value={formData.cargoValue}
            onChange={handleCargoValueChange}
            onBlur={handleCargoValueBlur}
            className="w-full px-3 py-2 border border-gray-300 rounded-md focus:outline-none focus:ring-2 focus:ring-blue-500 focus:border-blue-500"
            placeholder="Enter cargo value"
            aria-invalid={!!errors.cargoValue}
            aria-describedby={errors.cargoValue ? "cargo-value-error" : undefined}
          />
          {errors.cargoValue && (
            <div 
              id="cargo-value-error"
              data-testid="cargo-value-error" 
              className="text-red-600 text-sm mt-1"
              role="alert"
            >
              {errors.cargoValue}
            </div>
          )}
        </div>

        <div className="flex justify-between pt-4">
          <button
            data-testid="back-button"
            onClick={onBack}
            className="px-4 py-2 bg-gray-100 text-gray-700 rounded-md hover:bg-gray-200 focus:outline-none focus:ring-2 focus:ring-gray-500 transition-colors"
            type="button"
          >
            Back
          </button>
          <button
            data-testid="review-button"
            onClick={handleReview}
            disabled={!isFormValid()}
            className={`px-4 py-2 rounded focus:outline-none focus:ring-2 transition-colors ${isFormValid() ? 'bg-blue-500 text-white hover:bg-blue-600 focus:ring-blue-500' : 'bg-gray-300 text-gray-500 cursor-not-allowed'}`}
            type="button"
          >
            Review
          </button>
        </div>
      </div>
    </div>
  );
};