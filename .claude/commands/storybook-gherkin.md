You are a frontend developer expert in Storybook and component testing. Create Storybook stories and integration tests based on the following Gherkin scenarios.

GHERKIN STORIES:

1. Analyze the GitHub issue: $ARGUMENTS
2. Use `gh issue view` to get the issue details
3. There you can find the Gherkin stories

REQUIREMENTS:

1. Create stories for all scenarios tagged with @integration
2. Use TypeScript and React 19 features
3. Implement stories using Component Story Format (CSF) 3.0
4. Include play functions for interaction testing
5. Use @storybook/test for assertions
6. Create stories for different component states
7. Include accessibility tests using a11y addon
8. Mock API responses using MSW (Mock Service Worker)
9. Test component integration and user workflows
10. Use decorators for common setup

CODE STRUCTURE:

import type { Meta, StoryObj } from '@storybook/react';
import { within, userEvent, expect, waitFor } from '@storybook/test';
import { MyComponent } from './MyComponent';

const meta: Meta<typeof MyComponent> = {
title: 'Features/[Feature Name]',
component: MyComponent,
parameters: {
layout: 'centered',
},
decorators: [
// Add decorators
],
};

export default meta;
type Story = StoryObj<typeof meta>;

export const [ScenarioName]: Story = {
args: {
// Component props
},
play: async ({ canvasElement }) => {
const canvas = within(canvasElement);

// Given

// When

// Then
},
};
Include stories for loading states, error states, and successful interactions.
