// Types for validation results
export interface ValidationResult {
  isValid: boolean;
  error: string | null;
}

// Email validation
export const validateEmail = (email: string): ValidationResult => {
  if (!email) {
    return {
      isValid: false,
      error: 'Email is required'
    };
  }

  if (email.includes(' ')) {
    return {
      isValid: false,
      error: 'Email cannot contain spaces'
    };
  }

  if (email.startsWith('@')) {
    return {
      isValid: false,
      error: 'Email must have local part'
    };
  }

  if (email.endsWith('@')) {
    return {
      isValid: false,
      error: 'Email must have domain'
    };
  }

  const emailRegex = /^[^\s@]+@[^\s@]+\.[^\s@]+$/;
  if (!emailRegex.test(email)) {
    return {
      isValid: false,
      error: 'Invalid email format'
    };
  }

  return {
    isValid: true,
    error: null
  };
};

// Required field validation
export const validateRequired = (value: string): ValidationResult => {
  if (!value || value.trim() === '') {
    return {
      isValid: false,
      error: 'This field is required'
    };
  }

  return {
    isValid: true,
    error: null
  };
};

// Cargo value validation
export const validateCargoValue = (value: string | number): ValidationResult => {
  if (value === '' || value === null || value === undefined) {
    return {
      isValid: false,
      error: 'Cargo value is required'
    };
  }

  let numValue: number;

  if (typeof value === 'string') {
    // Remove commas and parse
    const cleanValue = value.replace(/,/g, '');
    numValue = parseFloat(cleanValue);
    
    if (isNaN(numValue)) {
      return {
        isValid: false,
        error: 'Cargo value must be a valid number'
      };
    }
  } else {
    numValue = value;
  }

  if (numValue <= 0) {
    return {
      isValid: false,
      error: 'Cargo value must be greater than 0'
    };
  }

  return {
    isValid: true,
    error: null
  };
};

// Format number with commas
export const formatNumber = (value: number): string => {
  return value.toLocaleString();
};

// Parse formatted number string
export const parseFormattedNumber = (value: string): number => {
  return parseFloat(value.replace(/,/g, ''));
};