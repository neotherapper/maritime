import React, { useState, useEffect } from 'react';
import { Step1 } from '../steps/Step1';
import { Step2 } from '../steps/Step2';
import { Step3 } from '../steps/Step3';
import { Review } from '../review/Review';
import type { QuoteRequest } from '../review/Review';
import { submitQuoteRequest } from '../../services/api';

interface QuoteWizardState {
  currentStep: number;
  step1Data: { companyName: string; contactEmail: string };
  step2Data: { vesselName: string; vesselType: string };
  step3Data: { coverageLevel: string; cargoValue: number };
  isSubmitting: boolean;
  submitError: string | null;
  isSubmitted: boolean;
}

const STORAGE_KEY = 'quoteDraft';

export const QuoteWizard: React.FC = () => {
  const [state, setState] = useState<QuoteWizardState>({
    currentStep: 1,
    step1Data: { companyName: '', contactEmail: '' },
    step2Data: { vesselName: '', vesselType: '' },
    step3Data: { coverageLevel: '', cargoValue: 0 },
    isSubmitting: false,
    submitError: null,
    isSubmitted: false
  });

  // Load draft from localStorage on mount
  useEffect(() => {
    const savedDraft = localStorage.getItem(STORAGE_KEY);
    if (savedDraft) {
      try {
        const draft = JSON.parse(savedDraft);
        const newState: Partial<QuoteWizardState> = {};
        
        if (draft.step1) {
          newState.step1Data = draft.step1;
        }
        
        if (draft.step2) {
          newState.step2Data = draft.step2;
        }
        
        if (draft.step3) {
          newState.step3Data = draft.step3;
        }
        
        // Determine which step to start on based on completed data
        if (draft.step3 && draft.step3.coverageLevel && draft.step3.cargoValue) {
          newState.currentStep = 3;
        } else if (draft.step2 && draft.step2.vesselName && draft.step2.vesselType) {
          newState.currentStep = 2;
        } else {
          newState.currentStep = 1;
        }
        
        setState(prev => ({ ...prev, ...newState }));
      } catch (error) {
        console.error('Failed to parse saved draft:', error);
        localStorage.removeItem(STORAGE_KEY);
      }
    }
  }, []);

  // Save to localStorage whenever state changes
  const saveDraft = (updates: Partial<QuoteWizardState>) => {
    const newState = { ...state, ...updates };
    const draft = {
      step1: newState.step1Data,
      step2: newState.step2Data,
      step3: newState.step3Data
    };
    localStorage.setItem(STORAGE_KEY, JSON.stringify(draft));
  };

  // Handle Step 1 next
  const handleStep1Next = (data: { companyName: string; contactEmail: string }) => {
    const updates = {
      step1Data: data,
      currentStep: 2
    };
    setState(prev => ({ ...prev, ...updates }));
    saveDraft(updates);
  };

  // Handle Step 1 save draft
  const handleStep1SaveDraft = (data: { companyName: string; contactEmail: string }) => {
    const updates = { step1Data: data };
    setState(prev => ({ ...prev, ...updates }));
    saveDraft(updates);
  };

  // Handle Step 1 field changes (real-time persistence)
  const handleStep1FieldChange = (data: { companyName: string; contactEmail: string }) => {
    const updates = { step1Data: data };
    setState(prev => ({ ...prev, ...updates }));
    saveDraft(updates);
  };

  // Handle Step 2 field changes (real-time persistence)
  const handleStep2FieldChange = (data: { vesselName: string; vesselType: string }) => {
    const updates = { step2Data: data };
    setState(prev => ({ ...prev, ...updates }));
    saveDraft(updates);
  };

  // Handle Step 3 field changes (real-time persistence)
  const handleStep3FieldChange = (data: { coverageLevel: string; cargoValue: number }) => {
    const updates = { step3Data: data };
    setState(prev => ({ ...prev, ...updates }));
    saveDraft(updates);
  };

  // Handle Step 2 next
  const handleStep2Next = (data: { vesselName: string; vesselType: string }) => {
    const updates = {
      step2Data: data,
      currentStep: 3
    };
    setState(prev => ({ ...prev, ...updates }));
    saveDraft(updates);
  };

  // Handle Step 2 back
  const handleStep2Back = () => {
    setState(prev => ({ ...prev, currentStep: 1 }));
  };

  // Handle Step 3 review
  const handleStep3Review = (data: { coverageLevel: string; cargoValue: number }) => {
    const updates = {
      step3Data: data,
      currentStep: 4
    };
    setState(prev => ({ ...prev, ...updates }));
    saveDraft(updates);
  };

  // Handle Step 3 back
  const handleStep3Back = () => {
    setState(prev => ({ ...prev, currentStep: 2 }));
  };

  // Handle review back
  const handleReviewBack = () => {
    setState(prev => ({ ...prev, currentStep: 3, submitError: null }));
  };

  // Handle submit
  const handleSubmit = async () => {
    setState(prev => ({ ...prev, isSubmitting: true, submitError: null }));

    const quoteRequest: QuoteRequest = {
      companyName: state.step1Data.companyName,
      contactEmail: state.step1Data.contactEmail,
      vesselName: state.step2Data.vesselName,
      vesselType: state.step2Data.vesselType,
      coverageLevel: state.step3Data.coverageLevel,
      cargoValue: state.step3Data.cargoValue
    };

    try {
      await submitQuoteRequest(quoteRequest);
      
      // Clear localStorage on successful submission
      localStorage.removeItem(STORAGE_KEY);
      
      setState(prev => ({ 
        ...prev, 
        isSubmitting: false, 
        isSubmitted: true,
        submitError: null
      }));
    } catch (error) {
      const errorMessage = error instanceof Error ? error.message : 'An unexpected error occurred';
      setState(prev => ({ 
        ...prev, 
        isSubmitting: false, 
        submitError: errorMessage
      }));
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

  // Render current step
  const renderCurrentStep = () => {
    switch (state.currentStep) {
      case 1:
        return (
          <Step1
            onNext={handleStep1Next}
            onSaveDraft={handleStep1SaveDraft}
            onFieldChange={handleStep1FieldChange}
            initialData={state.step1Data}
          />
        );
      case 2:
        return (
          <Step2
            onNext={handleStep2Next}
            onBack={handleStep2Back}
            onFieldChange={handleStep2FieldChange}
            initialData={state.step2Data}
          />
        );
      case 3:
        return (
          <Step3
            onReview={handleStep3Review}
            onBack={handleStep3Back}
            onFieldChange={handleStep3FieldChange}
            initialData={state.step3Data}
          />
        );
      case 4: {
        const reviewData: QuoteRequest = {
          companyName: state.step1Data.companyName,
          contactEmail: state.step1Data.contactEmail,
          vesselName: state.step2Data.vesselName,
          vesselType: state.step2Data.vesselType,
          coverageLevel: state.step3Data.coverageLevel,
          cargoValue: state.step3Data.cargoValue
        };
        return (
          <Review
            data={reviewData}
            onSubmit={handleSubmit}
            onBack={handleReviewBack}
            isSubmitting={state.isSubmitting}
            error={state.submitError ?? undefined}
          />
        );
      }
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