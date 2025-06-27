import { useReducer, useEffect } from 'react';
import type { ReactNode } from 'react';

export interface QuoteWizardState {
  currentStep: number;
  step1Data: { companyName: string; contactEmail: string };
  step2Data: { vesselName: string; vesselType: string };
  step3Data: { coverageLevel: string; cargoValue: number };
  isSubmitting: boolean;
  submitError: string | null;
  isSubmitted: boolean;
}

export type QuoteWizardAction =
  | { type: 'SET_CURRENT_STEP'; payload: number }
  | { type: 'UPDATE_STEP1_DATA'; payload: { companyName: string; contactEmail: string } }
  | { type: 'UPDATE_STEP2_DATA'; payload: { vesselName: string; vesselType: string } }
  | { type: 'UPDATE_STEP3_DATA'; payload: { coverageLevel: string; cargoValue: number } }
  | { type: 'SET_SUBMITTING'; payload: boolean }
  | { type: 'SET_SUBMIT_ERROR'; payload: string | null }
  | { type: 'SET_SUBMITTED'; payload: boolean }
  | { type: 'LOAD_DRAFT'; payload: Partial<QuoteWizardState> }
  | { type: 'RESET_WIZARD' };

const STORAGE_KEY = 'quoteDraft';

function getInitialState(): QuoteWizardState {
  const defaultState: QuoteWizardState = {
    currentStep: 1,
    step1Data: { companyName: '', contactEmail: '' },
    step2Data: { vesselName: '', vesselType: '' },
    step3Data: { coverageLevel: '', cargoValue: 0 },
    isSubmitting: false,
    submitError: null,
    isSubmitted: false
  };

  // Try to load from localStorage synchronously during initialization
  if (typeof window !== 'undefined') {
    try {
      const savedDraft = localStorage.getItem(STORAGE_KEY);
      if (savedDraft) {
        const draft = JSON.parse(savedDraft);
        
        if (draft.step1) {
          defaultState.step1Data = draft.step1;
        }
        
        if (draft.step2) {
          defaultState.step2Data = draft.step2;
        }
        
        if (draft.step3) {
          defaultState.step3Data = draft.step3;
        }
        
        // Determine which step to start on based on completed data
        if (draft.step3 && draft.step3.coverageLevel && draft.step3.cargoValue) {
          defaultState.currentStep = 3;
        } else if (draft.step2 && draft.step2.vesselName && draft.step2.vesselType) {
          defaultState.currentStep = 2;
        }
      }
    } catch (error) {
      console.error('Failed to parse saved draft:', error);
      if (typeof window !== 'undefined') {
        localStorage.removeItem(STORAGE_KEY);
      }
    }
  }

  return defaultState;
}

function quoteWizardReducer(state: QuoteWizardState, action: QuoteWizardAction): QuoteWizardState {
  switch (action.type) {
    case 'SET_CURRENT_STEP':
      return { ...state, currentStep: action.payload };
    case 'UPDATE_STEP1_DATA':
      return { ...state, step1Data: action.payload };
    case 'UPDATE_STEP2_DATA':
      return { ...state, step2Data: action.payload };
    case 'UPDATE_STEP3_DATA':
      return { ...state, step3Data: action.payload };
    case 'SET_SUBMITTING':
      return { ...state, isSubmitting: action.payload };
    case 'SET_SUBMIT_ERROR':
      return { ...state, submitError: action.payload };
    case 'SET_SUBMITTED':
      return { ...state, isSubmitted: action.payload };
    case 'LOAD_DRAFT':
      return { ...state, ...action.payload };
    case 'RESET_WIZARD':
      return getInitialState();
    default:
      return state;
  }
}

import { QuoteWizardContext } from './QuoteWizardContextTypes';

interface QuoteWizardProviderProps {
  children: ReactNode;
}

export function QuoteWizardProvider({ children }: QuoteWizardProviderProps) {
  const [state, dispatch] = useReducer(quoteWizardReducer, getInitialState());

  // Save to localStorage whenever relevant state changes
  useEffect(() => {
    const draft = {
      step1: state.step1Data,
      step2: state.step2Data,
      step3: state.step3Data
    };
    localStorage.setItem(STORAGE_KEY, JSON.stringify(draft));
  }, [state.step1Data, state.step2Data, state.step3Data]);

  // Clear localStorage on successful submission
  useEffect(() => {
    if (state.isSubmitted) {
      localStorage.removeItem(STORAGE_KEY);
    }
  }, [state.isSubmitted]);

  return (
    <QuoteWizardContext.Provider value={{ state, dispatch }}>
      {children}
    </QuoteWizardContext.Provider>
  );
}

