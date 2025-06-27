You are a senior React developer specializing in test-driven development with TypeScript. Based on the following Gherkin stories, create comprehensive unit tests using Vitest.

GHERKIN STORIES:

1. Analyze the GitHub issue: $ARGUMENTS
2. Use `gh issue view` to get the issue details
3. There you can find the Gherkin stories

REQUIREMENTS:

1. Create unit tests for all scenarios tagged with @unit
2. Use TypeScript with proper type definitions
3. Follow AAA pattern (Arrange, Act, Assert)
4. Mock external dependencies and API calls
5. Test individual functions, hooks, and component logic in isolation
6. Use describe blocks to group related tests
7. Include edge cases and error handling
8. Use data-test-id attributes for element selection
9. Test both positive and negative scenarios
10. Ensure 100% coverage of business logic

CODE STRUCTURE:

import { describe, it, expect, vi, beforeEach, afterEach } from 'vitest';
import { render, screen, fireEvent, waitFor } from '@testing-library/react';
import userEvent from '@testing-library/user-event';

describe('Feature: [Feature Name]', () => {
describe('Scenario: [Scenario Name]', () => {
beforeEach(() => {
// Setup
});

    it('should [expected behavior] when [condition]', async () => {

// Given (Arrange)

// When (Act)

// Then (Assert)
});
});
});

Include custom hooks tests, utility function tests, and component unit tests separately.
Since we are using TDD do assume that component files do not exist yet.
