
import { test, expect } from './test';

test('should display mocked user data', async ({ page, worker }) => {
  await page.goto('/');
  await expect(page.getByText('John Doe')).toBeVisible();
});
