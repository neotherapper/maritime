import React from 'react';
import { Step1 } from '../steps/Step1';
import { Step2 } from '../steps/Step2';
import { Step3 } from '../steps/Step3';
import { Review } from '../review/Review';
import { useQuoteWizard } from '../../hooks/useQuoteWizard';
import { submitQuoteRequest } from '../../services/api';

export const QuoteWizardRefactored: React.FC = () => {
  const { state, updateState, clearDraft, getQuoteRequest } = useQuoteWizard();

  const handleStep1Next = (data: { companyName: string; contactEmail: string }) => {
    updateState({
      step1Data: data,
      currentStep: 2
    });
  };

  const handleStep1SaveDraft = (data: { companyName: string; contactEmail: string }) => {
    updateState({ step1Data: data });
  };

  const handleStep2Next = (data: { vesselName: string; vesselType: string }) => {
    updateState({
      step2Data: data,
      currentStep: 3
    });
  };

  const handleStep2Back = () => {
    updateState({ currentStep: 1 });
  };

  const handleStep3Review = (data: { coverageLevel: string; cargoValue: number }) => {
    updateState({
      step3Data: data,
      currentStep: 4
    });
  };

  const handleStep3Back = () => {
    updateState({ currentStep: 2 });
  };

  const handleReviewBack = () => {
    updateState({ currentStep: 3, submitError: null });
  };

  const handleSubmit = async () => {
    updateState({ isSubmitting: true, submitError: null });

    const quoteRequest = getQuoteRequest();

    try {
      await submitQuoteRequest(quoteRequest);
      clearDraft();
      updateState({ 
        isSubmitting: false, 
        isSubmitted: true,
        submitError: null
      });
    } catch (error) {
      const errorMessage = error instanceof Error ? error.message : 'An unexpected error occurred';
      updateState({ 
        isSubmitting: false, 
        submitError: errorMessage
      });
    }
  };

  // Success screen
  if (state.isSubmitted) {
    return (
      <div className="max-w-md mx-auto p-6 bg-white rounded-lg shadow-lg text-center">
        <div className="mb-4">
          <div className="w-16 h-16 bg-green-100 rounded-full flex items-center justify-center mx-auto mb-4">
            <svg className="w-8 h-8 text-green-600" fill="none" stroke="currentColor" viewBox="0 0 24 24">
              <path strokeLinecap="round" strokeLinejoin="round" strokeWidth="2" d="M5 13l4 4L19 7"></path>
            </svg>
          </div>
          <h2 data-testid="success-message" className="text-xl font-semibold text-gray-800 mb-2">
            Quote submitted!
          </h2>
          <p className="text-gray-600">
            Your quote request has been submitted successfully. You will receive a response via email shortly.
          </p>
        </div>
      </div>
    );
  }

  const renderCurrentStep = () => {
    switch (state.currentStep) {
      case 1:
        return (
          <Step1
            onNext={handleStep1Next}
            onSaveDraft={handleStep1SaveDraft}
            initialData={state.step1Data}
          />
        );
      case 2:
        return (
          <Step2
            onNext={handleStep2Next}
            onBack={handleStep2Back}
            initialData={state.step2Data}
          />
        );
      case 3:
        return (
          <Step3
            onReview={handleStep3Review}
            onBack={handleStep3Back}
            initialData={state.step3Data}
          />
        );
      case 4:
        return (
          <Review
            data={getQuoteRequest()}
            onSubmit={handleSubmit}
            onBack={handleReviewBack}
            isSubmitting={state.isSubmitting}
            error={state.submitError ?? undefined}
          />
        );
      default:
        return null;
    }
  };

  return (
    <div className="min-h-screen bg-gray-100 py-8">
      <div className="container mx-auto px-4">
        <div className="text-center mb-8">
          <h1 className="text-3xl font-bold text-gray-800 mb-2">
            Maritime Insurance Quote Request
          </h1>
          <p className="text-gray-600">
            Get your vessel insurance quote in just a few steps
          </p>
        </div>
        
        {renderCurrentStep()}
      </div>
    </div>
  );
};