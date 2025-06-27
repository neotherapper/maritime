import React, { useState, useEffect } from 'react';
import { validateRequired } from '../../utils/validation';

export interface Step2Props {
  onNext: (data: { vesselName: string; vesselType: string }) => void;
  onBack: () => void;
  onFieldChange?: (data: { vesselName: string; vesselType: string }) => void;
  initialData?: { vesselName: string; vesselType: string };
}

const VESSEL_TYPES = [
  'Bulk Carrier',
  'Oil Tanker',
  'Container Ship'
] as const;

export const Step2: React.FC<Step2Props> = ({ onNext, onBack, onFieldChange, initialData }) => {
  const [formData, setFormData] = useState({
    vesselName: initialData?.vesselName || '',
    vesselType: initialData?.vesselType || ''
  });
  const [errors, setErrors] = useState<{ vesselName?: string; vesselType?: string }>({});

  // Update form data when initialData changes
  useEffect(() => {
    if (initialData) {
      setFormData({
        vesselName: initialData.vesselName || '',
        vesselType: initialData.vesselType || ''
      });
    }
  }, [initialData]);

  // Validate vessel name
  const validateVesselName = (value: string) => {
    const result = validateRequired(value);
    return result.error;
  };

  // Validate vessel type
  const validateVesselType = (value: string) => {
    if (!value) {
      return 'Vessel type is required';
    }
    return null;
  };

  // Handle vessel name change
  const handleVesselNameChange = (e: React.ChangeEvent<HTMLInputElement>) => {
    const value = e.target.value;
    const newFormData = { ...formData, vesselName: value };
    setFormData(newFormData);
    
    // Real-time persistence
    onFieldChange?.(newFormData);
    
    // Clear error if field becomes valid
    if (errors.vesselName && value.trim()) {
      setErrors(prev => ({ ...prev, vesselName: undefined }));
    }
  };

  // Handle vessel type change
  const handleVesselTypeChange = (e: React.ChangeEvent<HTMLSelectElement>) => {
    const value = e.target.value;
    const newFormData = { ...formData, vesselType: value };
    setFormData(newFormData);
    
    // Real-time persistence
    onFieldChange?.(newFormData);
    
    // Clear error if field becomes valid
    if (errors.vesselType && value) {
      setErrors(prev => ({ ...prev, vesselType: undefined }));
    }
  };

  // Handle vessel name blur
  const handleVesselNameBlur = () => {
    const error = validateVesselName(formData.vesselName);
    setErrors(prev => ({ ...prev, vesselName: error || undefined }));
  };

  // Handle next
  const handleNext = () => {
    const vesselNameError = validateVesselName(formData.vesselName);
    const vesselTypeError = validateVesselType(formData.vesselType);
    
    if (vesselNameError || vesselTypeError) {
      setErrors({
        vesselName: vesselNameError || undefined,
        vesselType: vesselTypeError || undefined
      });
      return;
    }

    onNext(formData);
  };

  // Check if form is valid
  const isFormValid = () => {
    return (
      formData.vesselName.trim() !== '' &&
      formData.vesselType !== '' &&
      !errors.vesselName &&
      !errors.vesselType
    );
  };

  return (
    <div className="w-[90%] sm:w-auto sm:max-w-xl mx-auto p-2 sm:p-6 bg-white rounded-lg shadow-lg">
      <div data-testid="step-indicator" className="text-center mb-6 text-gray-600 text-lg font-medium">
        Step 2 of 3
      </div>
      
      <div className="space-y-4">
        <div>
          <label 
            htmlFor="vessel-name" 
            className="block text-sm font-medium text-gray-700 mb-1"
          >
            Vessel Name
          </label>
          <input
            id="vessel-name"
            data-testid="vessel-name"
            type="text"
            value={formData.vesselName}
            onChange={handleVesselNameChange}
            onBlur={handleVesselNameBlur}
            className="w-full px-3 py-2 border border-gray-300 rounded-md focus:outline-none focus:ring-2 focus:ring-blue-500 focus:border-blue-500"
            placeholder="Enter vessel name"
            aria-invalid={!!errors.vesselName}
            aria-describedby={errors.vesselName ? "vessel-name-error" : undefined}
          />
          {errors.vesselName && (
            <div 
              id="vessel-name-error"
              data-testid="vessel-name-error" 
              className="text-red-600 text-sm mt-1"
              role="alert"
            >
              {errors.vesselName}
            </div>
          )}
        </div>

        <div>
          <label 
            htmlFor="vessel-type" 
            className="block text-sm font-medium text-gray-700 mb-1"
          >
            Vessel Type
          </label>
          <select
            id="vessel-type"
            data-testid="vessel-type"
            value={formData.vesselType}
            onChange={handleVesselTypeChange}
            className="w-full px-3 py-2 border border-gray-300 rounded-md focus:outline-none focus:ring-2 focus:ring-blue-500 focus:border-blue-500"
            aria-invalid={!!errors.vesselType}
            aria-describedby={errors.vesselType ? "vessel-type-error" : undefined}
          >
            <option value="">Select vessel type</option>
            {VESSEL_TYPES.map((type) => (
              <option 
                key={type} 
                value={type}
                data-testid={`vessel-type-option-${type.toLowerCase().replace(' ', '-')}`}
              >
                {type}
              </option>
            ))}
          </select>
          {errors.vesselType && (
            <div 
              id="vessel-type-error"
              data-testid="vessel-type-error" 
              className="text-red-600 text-sm mt-1"
              role="alert"
            >
              {errors.vesselType}
            </div>
          )}
        </div>

        <div className="flex space-x-4 pt-4">
          <button
            data-testid="back-button"
            onClick={onBack}
            className="px-4 py-2 bg-gray-100 text-gray-700 rounded-md hover:bg-gray-200 focus:outline-none focus:ring-2 focus:ring-gray-500 transition-colors"
            type="button"
          >
            Back
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