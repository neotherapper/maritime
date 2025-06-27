You are a QA automation engineer expert in Playwright. Create end-to-end tests based on the following Gherkin scenarios.

GHERKIN STORIES:

1. Analyze the GitHub issue: $ARGUMENTS
2. Use `gh issue view` to get the issue details
3. There you can find the Gherkin stories

REQUIREMENTS:

1. Create E2E tests for all scenarios tagged with @e2e
2. Use TypeScript with Page Object Model pattern
3. Implement proper wait strategies and assertions
4. Handle dynamic content and async operations
5. Use data-testid selectors for reliability
6. Include screenshots on failure
7. Test across

- Mobile (< 768 px).
- Desktop (≥ 768 px).

8. Mock external APIs when necessary
9. Test complete user journeys
10. Include performance assertions where relevant

CODE STRUCTURE:

import { test, expect, Page } from '@playwright/test';

class [FeatureName]Page {
constructor(private page: Page) {}

// Locators
private get [elementName]() {
return this.page.getByTestId('[test-id]');
}

// Actions
async [actionName]() {
// Implementation
}

// Assertions
async [assertionName]() {
// Implementation
}
}

test.describe('Feature: [Feature Name]', () => {
let page: Page;
let featurePage: [FeatureName]Page;

test.beforeEach(async ({ page: p }) => {
page = p;
featurePage = new [FeatureName]Page(page);
await page.goto('/path');
});

test('Scenario: [Scenario Name]', async () => {
// Given

// When

// Then
});
});

Include tests for critical user paths, form validations, and error recovery.
