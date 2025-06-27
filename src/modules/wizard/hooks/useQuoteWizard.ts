import { useState, useEffect } from 'react';
import type { QuoteRequest } from '../components/review/Review';

export interface QuoteWizardState {
  currentStep: number;
  step1Data: { companyName: string; contactEmail: string };
  step2Data: { vesselName: string; vesselType: string };
  step3Data: { coverageLevel: string; cargoValue: number };
  isSubmitting: boolean;
  submitError: string | null;
  isSubmitted: boolean;
}

const STORAGE_KEY = 'quoteDraft';

const initialState: QuoteWizardState = {
  currentStep: 1,
  step1Data: { companyName: '', contactEmail: '' },
  step2Data: { vesselName: '', vesselType: '' },
  step3Data: { coverageLevel: '', cargoValue: 0 },
  isSubmitting: false,
  submitError: null,
  isSubmitted: false
};

export const useQuoteWizard = () => {
  const [state, setState] = useState<QuoteWizardState>(initialState);

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

  const updateState = (updates: Partial<QuoteWizardState>) => {
    setState(prev => ({ ...prev, ...updates }));
    saveDraft(updates);
  };

  const clearDraft = () => {
    localStorage.removeItem(STORAGE_KEY);
  };

  const getQuoteRequest = (): QuoteRequest => ({
    companyName: state.step1Data.companyName,
    contactEmail: state.step1Data.contactEmail,
    vesselName: state.step2Data.vesselName,
    vesselType: state.step2Data.vesselType,
    coverageLevel: state.step3Data.coverageLevel,
    cargoValue: state.step3Data.cargoValue
  });

  return {
    state,
    updateState,
    saveDraft,
    clearDraft,
    getQuoteRequest
  };
};