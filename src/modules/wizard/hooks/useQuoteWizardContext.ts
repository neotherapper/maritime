import { useContext } from 'react';
import { QuoteWizardContext } from '../context/QuoteWizardContextTypes';

export function useQuoteWizardContext() {
  const context = useContext(QuoteWizardContext);
  if (context === undefined) {
    throw new Error('useQuoteWizardContext must be used within a QuoteWizardProvider');
  }
  return context;
}