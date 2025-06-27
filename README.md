# Quote Request Wizard

## Overview

The Quote Request Wizard is a multi-step form component designed to collect maritime insurance quote requests from users. The wizard guides users through three distinct steps: company information, vessel details, and coverage requirements, culminating in a review screen before final submission. This business-critical component streamlines the quote collection process while providing a smooth user experience with draft persistence and comprehensive validation.

## Data Model

The core data structure for quote requests is defined by the `QuoteRequest` TypeScript interface:

```typescript
export interface QuoteRequest {
  companyName: string;
  contactEmail: string;
  vesselName: string;
  vesselType: string;
  coverageLevel: string;
  cargoValue: number;
}
```

This interface ensures type safety across all wizard steps and API interactions, with each field representing essential information for maritime insurance quote processing.

## State & Persistence

The wizard uses React's Context API with `useReducer` for centralized state management through `QuoteWizardContext`. The state includes form data for all three steps, current step tracking, submission status, and error handling. Data persistence is implemented through localStorage under the key `'quoteDraft'`, automatically saving user progress after each step completion. On page reload, the wizard intelligently rehydrates from localStorage and navigates users to their last completed step. Navigation between steps is handled through reducer actions that update the current step while maintaining form state integrity. Upon successful submission, localStorage is cleared to prevent stale draft data.

## Styling Choices

The component uses Tailwind CSS utility classes for consistent styling and responsive design. This approach provides rapid development, maintainable code, and seamless integration with the application's design system while ensuring mobile-first responsive behavior across all wizard steps.

## Mock API Behavior

The wizard integrates with a mock API using `jsonplaceholder.typicode.com/posts` for simulating quote submission requests. The API service includes comprehensive error handling, timeout management (3-second timeout), and custom error classes for different failure scenarios. This mock implementation allows for realistic testing of network conditions and error states while providing a foundation for future integration with actual maritime insurance APIs.

## Architecture

### Key Components

- **QuoteWizard.tsx**: Main orchestrator component managing step navigation and state
- **Step1-3.tsx**: Individual step components handling form input and validation
- **Review.tsx**: Final review screen displaying collected data before submission
- **QuoteWizardContext.tsx**: Context provider with reducer-based state management

### Hooks & Utilities

- **useQuoteWizard.ts**: Custom hook providing wizard state and navigation methods
- **validation.ts**: Comprehensive validation utilities for email, required fields, and numeric inputs
- **api.ts**: Service layer for API communication with error handling and timeout management

### Testing Strategy

The module includes comprehensive test coverage with unit tests for validation logic, component tests using Storybook, and integration tests for the complete wizard flow. Each step component includes dedicated test files ensuring form validation and user interaction reliability.
