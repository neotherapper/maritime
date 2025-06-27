You are a senior React developer implementing features using TDD. Based on the following Gherkin stories, implement the feature ensuring all tests pass.

GHERKIN STORIES:

1. Analyze the GitHub issue: $ARGUMENTS
2. Use `gh issue view` to get the issue details
3. There you can find the Gherkin stories

UNIT TESTS:
STORYBOOK TESTS:
E2E TESTS:
already exist in their respective folder

REQUIREMENTS:

1. Use React 19 with TypeScript
2. Implement components using shadcn/ui components
3. Style with Tailwind CSS using cn() utility
4. Follow React best practices (hooks, composition, etc.)
5. Ensure all tests pass (unit, integration, E2E)
6. Use proper TypeScript types (no any)
7. Implement error boundaries where appropriate
8. Add loading and error states
9. Ensure accessibility (ARIA labels, keyboard navigation)
10. Follow SOLID principles and clean code practices
11. Add data-testid attributes matching test selectors
12. Optimize for performance (memoization where needed)

CODE STRUCTURE:

import React from 'react';
import { cn } from '@/lib/utils';
import { Button } from '@/components/ui/button';

interface [ComponentName]Props {
// Props definition
}

export const [ComponentName]: React.FC<[ComponentName]Props> = ({ ...props }) => {
// Implementation ensuring all tests pass

return (
<div data-testid="[component-name]">
{/_ Component JSX _/}
</div>
);
};

Include:

- Custom hooks for business logic
- Utility functions for data transformation
- Context providers if needed for state management
- Error boundaries for error handling
- Loading skeletons for async operations
