import { useState, useCallback } from 'react';
import { validateEmail, validateRequired, validateCargoValue } from '../utils/validation';

export interface ValidationErrors {
  [key: string]: string | undefined;
}

export const useFormValidation = <T extends Record<string, unknown>>(
  initialData: T,
  validators: { [K in keyof T]?: (value: T[K]) => string | null }
) => {
  const [formData, setFormData] = useState<T>(initialData);
  const [errors, setErrors] = useState<ValidationErrors>({});

  const validateField = useCallback((fieldName: keyof T, value: T[keyof T]) => {
    const validator = validators[fieldName];
    if (validator) {
      return validator(value);
    }
    return null;
  }, [validators]);

  const updateField = useCallback((fieldName: keyof T, value: T[keyof T]) => {
    setFormData(prev => ({ ...prev, [fieldName]: value }));
    
    // Clear error if field becomes valid
    const error = validateField(fieldName, value);
    if (errors[fieldName as string] && !error) {
      setErrors(prev => ({ ...prev, [fieldName as string]: undefined }));
    }
  }, [validateField, errors]);

  const validateOnBlur = useCallback((fieldName: keyof T) => {
    const value = formData[fieldName];
    const error = validateField(fieldName, value);
    setErrors(prev => ({ ...prev, [fieldName as string]: error || undefined }));
  }, [formData, validateField]);

  const validateAll = useCallback((): boolean => {
    const newErrors: ValidationErrors = {};
    let isValid = true;

    for (const [fieldName, validator] of Object.entries(validators)) {
      if (validator) {
        const value = formData[fieldName as keyof T];
        const error = validator(value);
        if (error) {
          newErrors[fieldName] = error;
          isValid = false;
        }
      }
    }

    setErrors(newErrors);
    return isValid;
  }, [formData, validators]);

  const isFormValid = useCallback((): boolean => {
    for (const [fieldName, validator] of Object.entries(validators)) {
      if (validator) {
        const value = formData[fieldName as keyof T];
        const error = validator(value);
        if (error) {
          return false;
        }
      }
    }
    return true;
  }, [formData, validators]);

  return {
    formData,
    errors,
    updateField,
    validateOnBlur,
    validateAll,
    isFormValid,
    setFormData
  };
};

// Pre-configured validation hooks for each step
export const useStep1Validation = (initialData: { companyName: string; contactEmail: string }) => {
  return useFormValidation(initialData, {
    companyName: (value: string) => validateRequired(value).error,
    contactEmail: (value: string) => validateEmail(value).error
  });
};

export const useStep2Validation = (initialData: { vesselName: string; vesselType: string }) => {
  return useFormValidation(initialData, {
    vesselName: (value: string) => validateRequired(value).error,
    vesselType: (value: string) => validateRequired(value).error
  });
};

export const useStep3Validation = (initialData: { coverageLevel: string; cargoValue: number }) => {
  return useFormValidation(initialData, {
    coverageLevel: (value: string) => validateRequired(value).error,
    cargoValue: (value: number) => validateCargoValue(value).error
  });
};