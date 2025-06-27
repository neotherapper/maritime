You are a technical lead reviewing a feature implementation for a project. Based on the provided Feature Request document, verify that all tests pass, suggest refactoring improvements, and create a Claude.md file or update it in the feature folder to document the module feature implementation for Claude to understand and interact with effectively.

FEATURE REQUEST:

1. Analyze the GitHub issue: $ARGUMENTS
2. Use `gh issue view` to get the issue details
3. There you can find the Feature request

CHECKLIST:

Test Verification:

1. Ensure all unit tests pass with code coverage > 90%.
2. Confirm Storybook stories render without errors
3. Ensure end-to-end (E2E) tests pass in CI environment

Code Quality:

1. Check TypeScript has no errors
2. Validate accessibility (no violations)
3. Review performance (no unnecessary re-renders)
4. Ensure code follows DRY principle

User Experience:

1. Check error handling is comprehensive
2. Verify comprehensive error handling with meaningful error messages.
3. Confirm loading states are smooth and user-friendly.
4. Validate responsive design across mobile, tablet, and desktop breakpoints.

Documentation:

Create a Claude.md file in the feature folder to help Claude understand the module feature implementation if this does not exist or update it otherwise. The file should include:

---

feature:
name: [Feature Name, e.g., User Authentication Module]
version: [Feature Version, e.g., 1.0.0]
module_path: [Relative Path, e.g., src/features/user-auth]
dependencies: - [List dependencies, e.g., react, axios]
language: [e.g., TypeScript, JavaScript]
environment: [e.g., Node.js v18, React 18]

---

# Claude.md - [Feature Name]

## Feature Overview

- **Purpose**: [Describe the feature’s purpose, e.g., Handles user login and registration with JWT-based authentication]
- **Functionality**: [Summarize key functions, e.g., Login, signup, password reset]
- **Role in Project**: [Explain its role, e.g., Core component for user access control]

## Implementation Details

- **Key Files**:
  - [List files, e.g., `src/features/user-auth/components/LoginForm.tsx`]
  - [Describe purpose of each file]
- **Utility Functions**:
  - [List functions, e.g., `authenticateUser(username, password)`]
  - [Describe their purpose and inputs/outputs]
- **APIs/Database**:
  - [Detail APIs or schemas, e.g., POST /api/login, User schema with fields id, email]
- **Coding Standards**:
  - [Specify standards, e.g., ESLint rules, TypeScript strict mode]

## Claude’s Role

- **Tasks**: [e.g., Review code for TypeScript errors, suggest refactoring for performance]
- **Context**: [e.g., Use this file to understand feature logic before generating suggestions]
- **Instructions**: [e.g., Check for DRY principle violations, validate API responses]

## Testing Instructions

- **Unit Tests**: [e.g., Run `npm test src/features/user-auth`]
- **Expected Inputs/Outputs**: [e.g., Login API returns 200 with valid credentials]
- **Success Criteria**: [e.g., 90% test coverage, no accessibility violations]

## Constraints and Limitations

- [e.g., Supports only JWT authentication, no OAuth]
- [e.g., Designed for browsers with ES6+ support]

## Logging

- **Implementation Logs**: Save logs in `_docs/` as `yyyy-mm-dd_feature-name.md`
- **Format**: Include date, changes made, and test results

Ensure the Claude.md file is committed to the feature folder in the repository.

After feature implementation, create a log file in \_docs/ (e.g., 2025-06-27_feature-name.md) with implementation details and test results, as Claude will reference it.

REFACTORING SUGGESTIONS:

- Extract complex logic into reusable custom React hooks (e.g., useFeatureLogic).
- Abstract repeated code into utility functions or components.
- Optimize expensive computations using memoization (e.g., useMemo, useCallback).
- Enhance type safety with stricter TypeScript types (e.g., avoid any types).
- Improve error messages to be user-friendly and actionable.
- Implement performance optimizations (e.g., lazy loading, code splitting).
- Enhance code readability with consistent formatting and clear variable names.

OUTPUT:

1. Test Execution Summary: Provide a concise summary of unit, Storybook, and E2E test results, including pass/fail status and any errors.
2. Coverage Report: Detail code coverage percentage and highlight areas below 90%.
3. Performance Metrics: Include metrics like render times, bundle size, or Lighthouse scores.
4. Refactored Code: Provide refactored code snippets with explanations of changes and benefits.
5. Additional Test Cases: Suggest new test cases to address any identified coverage gaps.

Confirmation of Claude.md: Confirm the creation and contents of the Claude.md file in the feature folder, including a summary of its key sections.

Implementation Log: Confirm the creation of the log file in \_docs/ with the specified format.

ADDITIONAL INSTRUCTIONS:

- Use clear, concise language in all outputs.
- Prioritize actionable suggestions with measurable impact (e.g., reduced render time by X%).
- If accessing GitHub issue details fails, provide fallback instructions (e.g., manually input feature details).
- If the feature name or version is unknown, use placeholders in Claude.md and note they should be updated.
  Ensure Claude references the Claude.md file automatically when processing the feature (e.g., for code review or refactoring).-
