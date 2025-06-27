---
feature:
  name: Quote Request Wizard
  version: 1.0.0
  module_path: src/modules/wizard
  dependencies:
    - react
    - typescript
    - tailwindcss
    - msw
    - vitest
    - playwright
  language: TypeScript
  environment: Node.js v18, React 19
---

# Claude.md - Quote Request Wizard

## Feature Overview

- **Purpose**: Handles multi-step maritime insurance quote requests with data persistence, validation, and API submission
- **Functionality**: 3-step wizard (Company Info → Vessel Info → Coverage Details → Review & Submit) with draft saving and form validation
- **Role in Project**: Core component for collecting and submitting maritime insurance quote requests from users

## Implementation Details

### Key Files:

- **`components/quote-wizard/QuoteWizard.tsx`**: Main wizard orchestrator component with state management and step navigation
- **`components/steps/Step1.tsx`**: Company information collection (name, email) with validation
- **`components/steps/Step2.tsx`**: Vessel information collection (name, type) with required field validation
- **`components/steps/Step3.tsx`**: Coverage details collection (level, cargo value) with number validation
- **`components/review/Review.tsx`**: Final review screen displaying all collected data before submission
- **`hooks/useQuoteWizard.ts`**: Custom hook for centralized wizard state management
- **`services/api.ts`**: API service for quote submission with error handling and timeout management
- **`utils/validation.ts`**: Validation utilities for email, required fields, and cargo values

### Utility Functions:

- **`validateEmail(email: string)`**: Email format validation with detailed error messages
- **`validateRequired(value: string)`**: Required field validation
- **`validateCargoValue(value: string | number)`**: Cargo value validation (must be > 0)
- **`formatNumber(value: number)`**: Number formatting with locale-specific commas
- **`submitQuoteRequest(quoteRequest: QuoteRequest)`**: API submission with timeout and error handling

### APIs/Database:

- **POST** to `https://jsonplaceholder.typicode.com/posts` for quote submission
- **localStorage** persistence under key `'quoteDraft'` for draft saving
- **QuoteRequest interface**: `{ companyName, contactEmail, vesselName, vesselType, coverageLevel, cargoValue }`
- **API Response**: `{ id: number, status: string }`
