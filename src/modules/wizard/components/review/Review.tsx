import React from 'react';
import { formatNumber } from '../../utils/validation';

export interface QuoteRequest {
  companyName: string;
  contactEmail: string;
  vesselName: string;
  vesselType: string;
  coverageLevel: string;
  cargoValue: number;
}

export interface ReviewProps {
  data: QuoteRequest;
  onSubmit: () => void;
  onBack: () => void;
  isSubmitting?: boolean;
  error?: string;
}

export const Review: React.FC<ReviewProps> = ({ 
  data, 
  onSubmit, 
  onBack, 
  isSubmitting = false,
  error 
}) => {
  const handleSubmit = () => {
    if (!isSubmitting) {
      onSubmit();
    }
  };

  const formatCargoValue = (value: number) => {
    return formatNumber(value);
  };

  return (
    <div className="w-[90%] md:w-auto md:max-w-md mx-auto p-2 md:p-6 bg-white rounded-lg shadow-lg">
      <div className="text-center mb-6">
        <h2 className="text-xl font-semibold text-gray-800 mb-2">Review Your Quote Request</h2>
        <p className="text-gray-600">Please review the information below before submitting</p>
      </div>
      
      <div data-testid="review-summary" className="space-y-4 mb-6">
        <div className="bg-gray-50 p-4 rounded-lg space-y-3">
          <h3 className="font-medium text-gray-800 border-b border-gray-200 pb-2">Company Information</h3>
          
          <div className="grid grid-cols-1 gap-2">
            <div>
              <span className="text-sm text-gray-600">Company Name:</span>
              <div data-testid="review-company-name" className="font-medium text-gray-800">
                {data.companyName}
              </div>
            </div>
            
            <div>
              <span className="text-sm text-gray-600">Contact Email:</span>
              <div data-testid="review-contact-email" className="font-medium text-gray-800">
                {data.contactEmail}
              </div>
            </div>
          </div>
        </div>

        <div className="bg-gray-50 p-4 rounded-lg space-y-3">
          <h3 className="font-medium text-gray-800 border-b border-gray-200 pb-2">Vessel Information</h3>
          
          <div className="grid grid-cols-1 gap-2">
            <div>
              <span className="text-sm text-gray-600">Vessel Name:</span>
              <div data-testid="review-vessel-name" className="font-medium text-gray-800">
                {data.vesselName}
              </div>
            </div>
            
            <div>
              <span className="text-sm text-gray-600">Vessel Type:</span>
              <div data-testid="review-vessel-type" className="font-medium text-gray-800">
                {data.vesselType}
              </div>
            </div>
          </div>
        </div>

        <div className="bg-gray-50 p-4 rounded-lg space-y-3">
          <h3 className="font-medium text-gray-800 border-b border-gray-200 pb-2">Coverage Information</h3>
          
          <div className="grid grid-cols-1 gap-2">
            <div>
              <span className="text-sm text-gray-600">Coverage Level:</span>
              <div data-testid="review-coverage-level" className="font-medium text-gray-800">
                {data.coverageLevel}
              </div>
            </div>
            
            <div>
              <span className="text-sm text-gray-600">Cargo Value:</span>
              <div data-testid="review-cargo-value" className="font-medium text-gray-800">
                {formatCargoValue(data.cargoValue)}
              </div>
            </div>
          </div>
        </div>
      </div>

      {error && (
        <div 
          data-testid="error-message" 
          className="bg-red-100 border border-red-400 text-red-700 px-4 py-3 rounded mb-4"
          role="alert"
        >
          <div className="font-medium">Submission Failed</div>
          <div className="text-sm">{error}</div>
        </div>
      )}

      <div className="flex space-x-4">
        <button
          data-testid="back-button"
          onClick={onBack}
          disabled={isSubmitting}
          className="px-4 py-2 bg-gray-100 text-gray-700 rounded-md hover:bg-gray-200 focus:outline-none focus:ring-2 focus:ring-gray-500 disabled:opacity-50 disabled:cursor-not-allowed transition-colors"
          type="button"
        >
          Back
        </button>
        <button
          data-testid="submit-request"
          onClick={handleSubmit}
          disabled={isSubmitting}
          className="flex-1 px-4 py-2 bg-green-600 text-white rounded-md hover:bg-green-700 focus:outline-none focus:ring-2 focus:ring-green-500 disabled:bg-gray-300 disabled:cursor-not-allowed transition-colors flex items-center justify-center"
          type="button"
        >
          {isSubmitting ? (
            <>
              <svg className="animate-spin -ml-1 mr-3 h-5 w-5 text-white" xmlns="http://www.w3.org/2000/svg" fill="none" viewBox="0 0 24 24">
                <circle className="opacity-25" cx="12" cy="12" r="10" stroke="currentColor" strokeWidth="4"></circle>
                <path className="opacity-75" fill="currentColor" d="M4 12a8 8 0 018-8V0C5.373 0 0 5.373 0 12h4zm2 5.291A7.962 7.962 0 014 12H0c0 3.042 1.135 5.824 3 7.938l3-2.647z"></path>
              </svg>
              Submitting...
            </>
          ) : (
            'Submit Request'
          )}
        </button>
      </div>
    </div>
  );
};