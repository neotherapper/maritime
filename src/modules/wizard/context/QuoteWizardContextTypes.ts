import { createContext } from 'react';
import type { QuoteWizardAction, QuoteWizardState } from './QuoteWizardContext';

export interface QuoteWizardContextType {
  state: QuoteWizardState;
  dispatch: React.Dispatch<QuoteWizardAction>;
}

export const QuoteWizardContext = createContext<QuoteWizardContextType | undefined>(undefined);
