import { useContext } from 'react';
import { QuoteWizardContext } from '../context/QuoteWizardContext';

export function useQuoteWizardContext() {
  const context = useContext(QuoteWizardContext);
  if (context === undefined) {
    throw new Error('useQuoteWizardContext must be used within a QuoteWizardProvider');
  }
  return context;
}