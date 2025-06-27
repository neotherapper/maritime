import { test, expect, Page } from '@playwright/test';

class QuoteWizardPage {
  constructor(private page: Page) {}

  // Step indicators
  private get stepIndicator() {
    return this.page.getByTestId('step-indicator');
  }

  // Step 1 - Company Information
  private get companyNameInput() {
    return this.page.getByTestId('company-name');
  }

  private get contactEmailInput() {
    return this.page.getByTestId('contact-email');
  }

  private get step1NextButton() {
    return this.page.getByTestId('step-1-next');
  }

  private get saveDraftButton() {
    return this.page.getByTestId('save-draft');
  }

  // Step 2 - Vessel Information
  private get vesselNameInput() {
    return this.page.getByTestId('vessel-name');
  }

  private get vesselTypeSelect() {
    return this.page.getByTestId('vessel-type');
  }

  private get step2NextButton() {
    return this.page.getByTestId('step-2-next');
  }

  private get step2BackButton() {
    return this.page.getByTestId('step-2-back');
  }

  // Step 3 - Coverage Information
  private get coverageLevelRadios() {
    return this.page.getByTestId('coverage-level');
  }

  private get cargoValueInput() {
    return this.page.getByTestId('cargo-value');
  }

  private get reviewButton() {
    return this.page.getByTestId('review-button');
  }

  private get step3BackButton() {
    return this.page.getByTestId('step-3-back');
  }

  // Review Page
  private get submitRequestButton() {
    return this.page.getByTestId('submit-request');
  }

  private get reviewSummary() {
    return this.page.getByTestId('review-summary');
  }

  // Messages and notifications
  private get successMessage() {
    return this.page.getByTestId('success-message');
  }

  private get errorMessage() {
    return this.page.getByTestId('error-message');
  }

  private get draftSavedMessage() {
    return this.page.getByTestId('draft-saved-message');
  }

  private get emailValidationError() {
    return this.page.getByTestId('email-validation-error');
  }

  private get cargoValueValidationError() {
    return this.page.getByTestId('cargo-value-validation-error');
  }

  // Actions
  async goto() {
    await this.page.goto('/quote-wizard');
  }

  async clearLocalStorage() {
    await this.page.evaluate(() => localStorage.clear());
  }

  async fillCompanyInformation(companyName: string, contactEmail: string) {
    await this.companyNameInput.fill(companyName);
    await this.contactEmailInput.fill(contactEmail);
  }

  async fillVesselInformation(vesselName: string, vesselType: string) {
    await this.vesselNameInput.fill(vesselName);
    await this.vesselTypeSelect.selectOption(vesselType);
  }

  async selectCoverageLevel(level: string) {
    await this.page.getByTestId(`coverage-${level.toLowerCase()}`).check();
  }

  async fillCargoValue(value: string) {
    await this.cargoValueInput.fill(value);
  }

  async completeStep1WithValidData() {
    await this.fillCompanyInformation('Pacific Shipping Ltd', 'john.smith@pacificshipping.com');
    await this.step1NextButton.click();
  }

  async completeStep2WithValidData() {
    await this.fillVesselInformation('MV Ocean Pioneer', 'Bulk Carrier');
    await this.step2NextButton.click();
  }

  async completeStep3WithValidData() {
    await this.selectCoverageLevel('Premium');
    await this.fillCargoValue('5000000');
    await this.reviewButton.click();
  }

  // Assertions
  async expectToBeOnStep(stepNumber: number) {
    await expect(this.stepIndicator).toContainText(`Step ${stepNumber} of 3`);
  }

  async expectButtonToBeDisabled(button: any) {
    await expect(button).toBeDisabled();
  }

  async expectButtonToBeEnabled(button: any) {
    await expect(button).toBeEnabled();
  }

  async expectValidationError(errorElement: any, shouldBeVisible: boolean) {
    if (shouldBeVisible) {
      await expect(errorElement).toBeVisible();
    } else {
      await expect(errorElement).not.toBeVisible();
    }
  }

  async expectLocalStorageToContain(key: string, expectedValue?: any) {
    const stored = await this.page.evaluate((k) => localStorage.getItem(k), key);
    expect(stored).toBeTruthy();
    
    if (expectedValue) {
      const parsed = JSON.parse(stored!);
      expect(parsed).toMatchObject(expectedValue);
    }
  }

  async expectLocalStorageNotToContain(key: string) {
    const stored = await this.page.evaluate((k) => localStorage.getItem(k), key);
    expect(stored).toBeNull();
  }

  async expectFieldValue(field: any, expectedValue: string) {
    await expect(field).toHaveValue(expectedValue);
  }

  async expectReviewSummaryToContain(data: Record<string, string>) {
    for (const [field, value] of Object.entries(data)) {
      await expect(this.reviewSummary.getByTestId(`review-${field}`)).toContainText(value);
    }
  }
}

test.describe('Feature: Maritime Insurance Quote Request Wizard', () => {
  let page: Page;
  let wizardPage: QuoteWizardPage;

  test.beforeEach(async ({ page: p }) => {
    page = p;
    wizardPage = new QuoteWizardPage(page);
    await wizardPage.goto();
    await wizardPage.clearLocalStorage();
  });

  test.describe('Happy Path Flow', () => {
    test('Complete quote request submission through all steps @e2e @happy-path', async () => {
      // Given I am on Step 1 of the wizard
      await wizardPage.expectToBeOnStep(1);

      // When I enter company information and proceed
      await wizardPage.fillCompanyInformation('Pacific Shipping Ltd', 'john.smith@pacificshipping.com');
      await wizardPage.step1NextButton.click();

      // Then I should be on Step 2
      await wizardPage.expectToBeOnStep(2);

      // When I enter vessel information and proceed
      await wizardPage.fillVesselInformation('MV Ocean Pioneer', 'Bulk Carrier');
      await wizardPage.step2NextButton.click();

      // Then I should be on Step 3
      await wizardPage.expectToBeOnStep(3);

      // When I enter coverage information and proceed to review
      await wizardPage.selectCoverageLevel('Premium');
      await wizardPage.fillCargoValue('5000000');
      await wizardPage.reviewButton.click();

      // Then I should see the review page with all information
      await expect(wizardPage.reviewSummary).toBeVisible();
      await wizardPage.expectReviewSummaryToContain({
        'company-name': 'Pacific Shipping Ltd',
        'contact-email': 'john.smith@pacificshipping.com',
        'vessel-name': 'MV Ocean Pioneer',
        'vessel-type': 'Bulk Carrier',
        'coverage-level': 'Premium',
        'cargo-value': '5,000,000'
      });

      // When I submit the request
      await wizardPage.submitRequestButton.click();

      // Then I should see success message and localStorage should be cleared
      await expect(wizardPage.successMessage).toContainText('Quote submitted!');
      await wizardPage.expectLocalStorageNotToContain('quoteDraft');
    });
  });

  test.describe('Email Validation', () => {
    test.beforeEach(async () => {
      await wizardPage.fillCompanyInformation('Global Marine Corp', '');
    });

    [
      { email: 'valid@email.com', shouldBeEnabled: true, shouldShowError: false },
      { email: 'another.valid@company.co.uk', shouldBeEnabled: true, shouldShowError: false },
      { email: 'invalid.email', shouldBeEnabled: false, shouldShowError: true },
      { email: '@missing-local.com', shouldBeEnabled: false, shouldShowError: true },
      { email: 'missing-domain@', shouldBeEnabled: false, shouldShowError: true },
      { email: 'spaces in@email.com', shouldBeEnabled: false, shouldShowError: true }
    ].forEach(({ email, shouldBeEnabled, shouldShowError }) => {
      test(`Email validation: ${email} @unit @validation`, async () => {
        await wizardPage.contactEmailInput.fill(email);
        await wizardPage.contactEmailInput.blur();

        if (shouldBeEnabled) {
          await wizardPage.expectButtonToBeEnabled(wizardPage.step1NextButton);
        } else {
          await wizardPage.expectButtonToBeDisabled(wizardPage.step1NextButton);
        }

        await wizardPage.expectValidationError(wizardPage.emailValidationError, shouldShowError);
      });
    });
  });

  test.describe('Required Field Validation', () => {
    test('Required field validation on Step 1 @unit @validation', async () => {
      // When company name is empty
      await wizardPage.contactEmailInput.fill('contact@company.com');
      await wizardPage.expectButtonToBeDisabled(wizardPage.step1NextButton);

      // When email is empty
      await wizardPage.companyNameInput.fill('My Company');
      await wizardPage.contactEmailInput.clear();
      await wizardPage.expectButtonToBeDisabled(wizardPage.step1NextButton);

      // When both are filled
      await wizardPage.contactEmailInput.fill('contact@company.com');
      await wizardPage.expectButtonToBeEnabled(wizardPage.step1NextButton);
    });

    test('Vessel type selection is required @unit @validation', async () => {
      await wizardPage.completeStep1WithValidData();
      await wizardPage.expectToBeOnStep(2);

      await wizardPage.vesselNameInput.fill('MV Trade Wind');
      await wizardPage.expectButtonToBeDisabled(wizardPage.step2NextButton);

      await wizardPage.vesselTypeSelect.selectOption('Oil Tanker');
      await wizardPage.expectButtonToBeEnabled(wizardPage.step2NextButton);
    });

    test('Coverage level selection is required @integration @validation', async () => {
      await wizardPage.completeStep1WithValidData();
      await wizardPage.completeStep2WithValidData();
      await wizardPage.expectToBeOnStep(3);

      await wizardPage.fillCargoValue('1500000');
      await wizardPage.expectButtonToBeDisabled(wizardPage.reviewButton);

      await wizardPage.selectCoverageLevel('Premium');
      await wizardPage.expectButtonToBeEnabled(wizardPage.reviewButton);
    });
  });

  test.describe('Cargo Value Validation', () => {
    test.beforeEach(async () => {
      await wizardPage.completeStep1WithValidData();
      await wizardPage.completeStep2WithValidData();
      await wizardPage.selectCoverageLevel('Basic');
    });

    [
      { value: '1000000', shouldBeEnabled: true, shouldShowError: false },
      { value: '1', shouldBeEnabled: true, shouldShowError: false },
      { value: '0', shouldBeEnabled: false, shouldShowError: true },
      { value: '-1000', shouldBeEnabled: false, shouldShowError: true },
      { value: 'abc', shouldBeEnabled: false, shouldShowError: true },
      { value: '', shouldBeEnabled: false, shouldShowError: true }
    ].forEach(({ value, shouldBeEnabled, shouldShowError }) => {
      test(`Cargo value validation: "${value}" @unit @validation`, async () => {
        await wizardPage.fillCargoValue(value);
        await wizardPage.cargoValueInput.blur();

        if (shouldBeEnabled) {
          await wizardPage.expectButtonToBeEnabled(wizardPage.reviewButton);
        } else {
          await wizardPage.expectButtonToBeDisabled(wizardPage.reviewButton);
        }

        await wizardPage.expectValidationError(wizardPage.cargoValueValidationError, shouldShowError);
      });
    });

    test('Cargo value accepts valid number formats @unit @validation', async () => {
      await wizardPage.fillCargoValue('1,500,000.50');
      await wizardPage.expectButtonToBeEnabled(wizardPage.reviewButton);
      await wizardPage.expectFieldValue(wizardPage.cargoValueInput, '1500000.50');
    });
  });

  test.describe('Draft Persistence', () => {
    test('Save draft functionality on Step 1 @integration @persistence', async () => {
      await wizardPage.fillCompanyInformation('Atlantic Vessels Inc', 'info@atlanticvessels.com');
      await wizardPage.saveDraftButton.click();

      await expect(wizardPage.draftSavedMessage).toContainText('Draft saved');
      await wizardPage.expectLocalStorageToContain('quoteDraft', {
        companyName: 'Atlantic Vessels Inc',
        contactEmail: 'info@atlanticvessels.com'
      });

      await page.reload();
      await wizardPage.expectToBeOnStep(1);
      await wizardPage.expectFieldValue(wizardPage.companyNameInput, 'Atlantic Vessels Inc');
      await wizardPage.expectFieldValue(wizardPage.contactEmailInput, 'info@atlanticvessels.com');
    });

    test('Real-time draft persistence on field changes @integration @persistence', async () => {
      await wizardPage.companyNameInput.fill('Nordic Lines');
      await wizardPage.expectLocalStorageToContain('quoteDraft', { companyName: 'Nordic Lines' });

      await wizardPage.contactEmailInput.fill('contact@');
      await wizardPage.expectLocalStorageToContain('quoteDraft', { contactEmail: 'contact@' });

      await wizardPage.contactEmailInput.fill('contact@nordic.com');
      await wizardPage.expectLocalStorageToContain('quoteDraft', { contactEmail: 'contact@nordic.com' });
    });

    test('Resume from Step 3 after page reload @integration @persistence', async () => {
      await wizardPage.completeStep1WithValidData();
      await wizardPage.completeStep2WithValidData();
      await wizardPage.selectCoverageLevel('Standard');
      await wizardPage.fillCargoValue('2500000');

      await page.reload();
      await wizardPage.expectToBeOnStep(3);
      await expect(wizardPage.page.getByTestId('coverage-standard')).toBeChecked();
      await wizardPage.expectFieldValue(wizardPage.cargoValueInput, '2500000');
    });
  });

  test.describe('Navigation', () => {
    test('Navigate back and forth between steps preserving data @e2e @navigation', async () => {
      // Complete Step 1
      await wizardPage.fillCompanyInformation('Test Company', 'test@company.com');
      await wizardPage.step1NextButton.click();

      // On Step 2, enter data and go back
      await wizardPage.fillVesselInformation('SS Cargo Master', 'Container Ship');
      await wizardPage.step2BackButton.click();

      // Verify Step 1 data is preserved
      await wizardPage.expectToBeOnStep(1);
      await wizardPage.expectFieldValue(wizardPage.companyNameInput, 'Test Company');
      await wizardPage.expectFieldValue(wizardPage.contactEmailInput, 'test@company.com');

      // Go forward and verify Step 2 data is preserved
      await wizardPage.step1NextButton.click();
      await wizardPage.expectToBeOnStep(2);
      await wizardPage.expectFieldValue(wizardPage.vesselNameInput, 'SS Cargo Master');
      await expect(wizardPage.vesselTypeSelect).toHaveValue('Container Ship');
    });
  });

  test.describe('Error Handling', () => {
    test('Handle API submission failure @e2e @error-handling', async () => {
      // Mock API to return error
      await page.route('**/api/quote-requests', route => {
        route.fulfill({
          status: 500,
          contentType: 'application/json',
          body: JSON.stringify({ error: 'Server error' })
        });
      });

      await wizardPage.completeStep1WithValidData();
      await wizardPage.completeStep2WithValidData();
      await wizardPage.completeStep3WithValidData();

      await wizardPage.submitRequestButton.click();

      await expect(wizardPage.errorMessage).toBeVisible();
      await wizardPage.expectLocalStorageToContain('quoteDraft');
    });

    test('Handle API submission timeout @e2e @error-handling', async () => {
      // Mock API to timeout
      await page.route('**/api/quote-requests', route => {
        // Don't fulfill the route to simulate timeout
        setTimeout(() => route.abort(), 5000);
      });

      await wizardPage.completeStep1WithValidData();
      await wizardPage.completeStep2WithValidData();
      await wizardPage.completeStep3WithValidData();

      await wizardPage.submitRequestButton.click();

      await expect(wizardPage.errorMessage).toContainText('timeout');
      await wizardPage.expectLocalStorageToContain('quoteDraft');
    });

    test('Retry submission after network failure @e2e @error-recovery', async () => {
      let requestCount = 0;
      
      await page.route('**/api/quote-requests', route => {
        requestCount++;
        if (requestCount === 1) {
          route.fulfill({ status: 500 });
        } else {
          route.fulfill({
            status: 200,
            contentType: 'application/json',
            body: JSON.stringify({ id: 123, status: 'submitted' })
          });
        }
      });

      await wizardPage.completeStep1WithValidData();
      await wizardPage.completeStep2WithValidData();
      await wizardPage.completeStep3WithValidData();

      // First attempt fails
      await wizardPage.submitRequestButton.click();
      await expect(wizardPage.errorMessage).toBeVisible();

      // Retry succeeds
      await wizardPage.submitRequestButton.click();
      await expect(wizardPage.successMessage).toContainText('Quote submitted!');
      await wizardPage.expectLocalStorageNotToContain('quoteDraft');
    });
  });

  test.describe('Data Integrity', () => {
    test('Review page displays all collected information correctly @e2e @data-integrity', async () => {
      const testData = {
        companyName: 'Mediterranean Shipping',
        contactEmail: 'ops@medshipping.com',
        vesselName: 'MV Horizon',
        vesselType: 'Bulk Carrier',
        coverageLevel: 'Standard',
        cargoValue: '3500000'
      };

      await wizardPage.fillCompanyInformation(testData.companyName, testData.contactEmail);
      await wizardPage.step1NextButton.click();

      await wizardPage.fillVesselInformation(testData.vesselName, testData.vesselType);
      await wizardPage.step2NextButton.click();

      await wizardPage.selectCoverageLevel(testData.coverageLevel);
      await wizardPage.fillCargoValue(testData.cargoValue);
      await wizardPage.reviewButton.click();

      await wizardPage.expectReviewSummaryToContain({
        'company-name': testData.companyName,
        'contact-email': testData.contactEmail,
        'vessel-name': testData.vesselName,
        'vessel-type': testData.vesselType,
        'coverage-level': testData.coverageLevel,
        'cargo-value': '3,500,000' // Formatted with commas
      });
    });

    test('Submit to correct mock API endpoint @integration @api', async () => {
      let capturedRequest: any;

      await page.route('https://jsonplaceholder.typicode.com/posts', route => {
        capturedRequest = route.request();
        route.fulfill({
          status: 200,
          contentType: 'application/json',
          body: JSON.stringify({ id: 1 })
        });
      });

      await wizardPage.completeStep1WithValidData();
      await wizardPage.completeStep2WithValidData();
      await wizardPage.completeStep3WithValidData();
      await wizardPage.submitRequestButton.click();

      expect(capturedRequest.url()).toBe('https://jsonplaceholder.typicode.com/posts');
      expect(capturedRequest.method()).toBe('POST');

      const requestBody = JSON.parse(capturedRequest.postData());
      expect(requestBody).toHaveProperty('companyName');
      expect(requestBody).toHaveProperty('contactEmail');
      expect(requestBody).toHaveProperty('vesselName');
      expect(requestBody).toHaveProperty('vesselType');
      expect(requestBody).toHaveProperty('coverageLevel');
      expect(requestBody).toHaveProperty('cargoValue');
    });
  });

  test.describe('UI Elements', () => {
    test('Verify all vessel type options are available @unit @ui-elements', async () => {
      await wizardPage.completeStep1WithValidData();
      
      const expectedOptions = ['Bulk Carrier', 'Oil Tanker', 'Container Ship'];
      
      for (const option of expectedOptions) {
        await expect(wizardPage.vesselTypeSelect.locator(`option[value="${option}"]`)).toBeVisible();
      }
      
      const allOptions = await wizardPage.vesselTypeSelect.locator('option').count();
      expect(allOptions).toBe(expectedOptions.length + 1); // +1 for placeholder option
    });

    test('Verify all coverage level options are available @unit @ui-elements', async () => {
      await wizardPage.completeStep1WithValidData();
      await wizardPage.completeStep2WithValidData();

      const expectedLevels = ['Basic', 'Standard', 'Premium'];
      
      for (const level of expectedLevels) {
        await expect(wizardPage.page.getByTestId(`coverage-${level.toLowerCase()}`)).toBeVisible();
      }
    });
  });
});

// Mobile and Desktop specific tests
test.describe('Responsive Design', () => {
  test('Mobile layout behavior @unit @responsive', async ({ browser }) => {
    const context = await browser.newContext({
      viewport: { width: 375, height: 667 } // iPhone SE
    });
    const page = await context.newPage();
    const wizardPage = new QuoteWizardPage(page);
    
    await wizardPage.goto();
    
    const form = page.locator('form');
    const formBox = await form.boundingBox();
    const viewportWidth = 375;
    
    expect(formBox!.width / viewportWidth).toBeGreaterThan(0.85); // ~90% width
    
    await context.close();
  });

  test('Desktop layout behavior @unit @responsive', async ({ browser }) => {
    const context = await browser.newContext({
      viewport: { width: 1920, height: 1080 }
    });
    const page = await context.newPage();
    const wizardPage = new QuoteWizardPage(page);
    
    await wizardPage.goto();
    
    const form = page.locator('form');
    const formBox = await form.boundingBox();
    
    expect(formBox!.width).toBeLessThanOrEqual(480); // Maximum 480px
    
    await context.close();
  });
});

// Accessibility tests
test.describe('Accessibility', () => {
  test('Form accessibility requirements @unit @accessibility', async () => {
    const wizardPage = new QuoteWizardPage(page);
    await wizardPage.goto();

    // Check that all input fields have associated labels
    const inputs = await page.locator('input[type="text"], input[type="email"], select').all();
    for (const input of inputs) {
      const id = await input.getAttribute('id');
      const label = page.locator(`label[for="${id}"]`);
      await expect(label).toBeVisible();
    }

    // Check step indicator
    await expect(wizardPage.stepIndicator).toContainText('Step 1 of 3');

    // Check keyboard navigation
    await page.keyboard.press('Tab');
    await expect(wizardPage.companyNameInput).toBeFocused();
  });

  test('Complete wizard using only keyboard @accessibility @keyboard-navigation', async () => {
    const wizardPage = new QuoteWizardPage(page);
    await wizardPage.goto();

    // Step 1
    await page.keyboard.press('Tab'); // Focus company name
    await page.keyboard.type('Keyboard Navigation Inc');
    await page.keyboard.press('Tab'); // Focus email
    await page.keyboard.type('test@keyboard.com');
    await page.keyboard.press('Tab'); // Focus Next button
    await page.keyboard.press('Enter');

    await wizardPage.expectToBeOnStep(2);

    // Step 2
    await page.keyboard.press('Tab'); // Focus vessel name
    await page.keyboard.type('KB Navigation Vessel');
    await page.keyboard.press('Tab'); // Focus vessel type
    await page.keyboard.press('ArrowDown'); // Select first option
    await page.keyboard.press('Tab'); // Focus Next button
    await page.keyboard.press('Enter');

    await wizardPage.expectToBeOnStep(3);

    // Step 3
    await page.keyboard.press('Tab'); // Focus first coverage option
    await page.keyboard.press('Space'); // Select coverage
    await page.keyboard.press('Tab'); // Focus cargo value
    await page.keyboard.type('1000000');
    await page.keyboard.press('Tab'); // Focus Review button
    await page.keyboard.press('Enter');

    await expect(wizardPage.reviewSummary).toBeVisible();
  });
});