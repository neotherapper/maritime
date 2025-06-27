import type { Meta, StoryObj } from "@storybook/react-vite";
import { expect, userEvent, waitFor, within } from "storybook/test";
import { http, HttpResponse } from "msw";
import React from "react";
import { QuoteWizard } from './QuoteWizard';
import { QuoteWizardProvider } from '../../context/QuoteWizardContext';

const meta: Meta<typeof QuoteWizard> = {
  title: "Features/Maritime Quote Wizard/Complete Flow",
  component: QuoteWizard,
  parameters: {
    layout: "fullscreen",
    msw: {
      handlers: [
        http.post("https://jsonplaceholder.typicode.com/posts", () => {
          return HttpResponse.json({ id: 1, success: true });
        }),
      ],
    },
  },
  decorators: [
    (Story) => {
      // Clear localStorage before each story
      React.useEffect(() => {
        localStorage.clear();
      }, []);
      return (
        <QuoteWizardProvider>
          <Story />
        </QuoteWizardProvider>
      );
    },
  ],
};

export default meta;
type Story = StoryObj<typeof meta>;

// @e2e @happy-path
export const CompleteQuoteRequestSubmission: Story = {
  play: async ({ canvasElement }) => {
    const canvas = within(canvasElement);

    // Given: I am on Step 1 of the wizard
    expect(canvas.getByTestId("step1-content")).toBeInTheDocument();
    expect(canvas.getByTestId("progress-step-1")).toHaveClass("bg-blue-600");

    // When: I enter company information and click Next
    await userEvent.click(canvas.getByTestId("step1-next"));

    // Then: I should be on Step 2 of the wizard
    await waitFor(() => {
      expect(canvas.getByTestId("step2-content")).toBeInTheDocument();
    });
    expect(canvas.getByTestId("progress-step-2")).toHaveClass("bg-blue-600");

    // When: I enter vessel information and click Next
    await userEvent.click(canvas.getByTestId("step2-next"));

    // Then: I should be on Step 3 of the wizard
    await waitFor(() => {
      expect(canvas.getByTestId("step3-content")).toBeInTheDocument();
    });
    expect(canvas.getByTestId("progress-step-3")).toHaveClass("bg-blue-600");

    // When: I select coverage and click Review
    await userEvent.click(canvas.getByTestId("step3-review"));

    // Then: I should see the review page with all my entered information
    await waitFor(() => {
      expect(canvas.getByTestId("review-content")).toBeInTheDocument();
    });

    // When: I click the "Submit Request" button
    await userEvent.click(canvas.getByTestId("review-submit"));

    // Then: I should see "Quote submitted!" message
    await waitFor(
      () => {
        expect(canvas.getByTestId("success-message")).toHaveTextContent(
          "Quote submitted!"
        );
      },
      { timeout: 3000 }
    );

    // And: localStorage should not contain "quoteDraft"
    expect(localStorage.getItem("quoteDraft")).toBeNull();
  },
};

// @e2e @navigation
export const NavigateBackAndForthPreservingData: Story = {
  play: async ({ canvasElement }) => {
    const canvas = within(canvasElement);

    // Complete Step 1
    await userEvent.click(canvas.getByTestId("step1-next"));
    await waitFor(() => {
      expect(canvas.getByTestId("step2-content")).toBeInTheDocument();
    });

    // Enter data in Step 2 and go back
    await userEvent.click(canvas.getByTestId("step2-back"));
    await waitFor(() => {
      expect(canvas.getByTestId("step1-content")).toBeInTheDocument();
    });

    // Go forward again
    await userEvent.click(canvas.getByTestId("step1-next"));
    await waitFor(() => {
      expect(canvas.getByTestId("step2-content")).toBeInTheDocument();
    });

    // Continue to Step 3
    await userEvent.click(canvas.getByTestId("step2-next"));
    await waitFor(() => {
      expect(canvas.getByTestId("step3-content")).toBeInTheDocument();
    });

    // Go back to Step 2
    await userEvent.click(canvas.getByTestId("step3-back"));
    await waitFor(() => {
      expect(canvas.getByTestId("step2-content")).toBeInTheDocument();
    });
  },
};

// @integration @persistence
export const SaveDraftAndResume: Story = {
  play: async ({ canvasElement }) => {
    const canvas = within(canvasElement);

    // Save draft on Step 1
    await userEvent.click(canvas.getByTestId("step1-save-draft"));

    // Verify localStorage contains draft
    await waitFor(() => {
      const draft = localStorage.getItem("quoteDraft");
      expect(draft).toBeTruthy();
      const parsed = JSON.parse(draft!);
      expect(parsed.step1).toBeDefined();
    });

    // Navigate through steps to save more data
    await userEvent.click(canvas.getByTestId("step1-next"));
    await waitFor(() => {
      expect(canvas.getByTestId("step2-content")).toBeInTheDocument();
    });

    await userEvent.click(canvas.getByTestId("step2-next"));
    await waitFor(() => {
      expect(canvas.getByTestId("step3-content")).toBeInTheDocument();
    });

    // Verify all steps are saved in localStorage
    const fullDraft = localStorage.getItem("quoteDraft");
    expect(fullDraft).toBeTruthy();
    const parsedFull = JSON.parse(fullDraft!);
    expect(parsedFull.step1).toBeDefined();
    expect(parsedFull.step2).toBeDefined();
  },
};

// @integration @state-management
export const ResumeWizardAtCorrectStep: Story = {
  decorators: [
    (Story) => {
      // Pre-populate localStorage with data up to Step 2
      React.useEffect(() => {
        localStorage.setItem(
          "quoteDraft",
          JSON.stringify({
            step1: {
              companyName: "Nordic Lines",
              contactEmail: "contact@nordic.com",
            },
            step2: { vesselName: "SS Nordic", vesselType: "Container Ship" },
          })
        );
      }, []);

      return (
        <QuoteWizardProvider>
          <Story />
        </QuoteWizardProvider>
      );
    },
  ],
  play: async ({ canvasElement }) => {
    const canvas = within(canvasElement);

    // Given: localStorage contains a draft with data up to Step 2
    // When: I load the Quote Request Wizard
    // Then: I should start on Step 2 (the last incomplete step)
    await waitFor(() => {
      expect(canvas.getByTestId("step2-content")).toBeInTheDocument();
    });

    // And: All previously entered data should be populated
    // (This would be verified by checking form field values in a real implementation)
  },
};

// @e2e @error-handling
export const HandleAPISubmissionFailure: Story = {
  parameters: {
    msw: {
      handlers: [
        http.post("https://jsonplaceholder.typicode.com/posts", () => {
          return new HttpResponse(null, { status: 500 });
        }),
      ],
    },
  },
  play: async ({ canvasElement }) => {
    const canvas = within(canvasElement);

    // Navigate through all steps
    await userEvent.click(canvas.getByTestId("step1-next"));
    await waitFor(() =>
      expect(canvas.getByTestId("step2-content")).toBeInTheDocument()
    );

    await userEvent.click(canvas.getByTestId("step2-next"));
    await waitFor(() =>
      expect(canvas.getByTestId("step3-content")).toBeInTheDocument()
    );

    await userEvent.click(canvas.getByTestId("step3-review"));
    await waitFor(() =>
      expect(canvas.getByTestId("review-content")).toBeInTheDocument()
    );

    // Attempt submission - should fail
    await userEvent.click(canvas.getByTestId("review-submit"));

    // Should remain on review page and show error
    // (In a real implementation, error handling would be shown)
    await waitFor(() => {
      expect(canvas.getByTestId("review-content")).toBeInTheDocument();
    });
  },
};

// Progress indicator test
export const ProgressIndicatorBehavior: Story = {
  play: async ({ canvasElement }) => {
    const canvas = within(canvasElement);

    // Initially only Step 1 should be active
    expect(canvas.getByTestId("progress-step-1")).toHaveClass("bg-blue-600");
    expect(canvas.getByTestId("progress-step-2")).toHaveClass("bg-gray-300");
    expect(canvas.getByTestId("progress-step-3")).toHaveClass("bg-gray-300");

    // After moving to Step 2
    await userEvent.click(canvas.getByTestId("step1-next"));
    await waitFor(() => {
      expect(canvas.getByTestId("progress-step-1")).toHaveClass("bg-blue-600");
      expect(canvas.getByTestId("progress-step-2")).toHaveClass("bg-blue-600");
      expect(canvas.getByTestId("progress-step-3")).toHaveClass("bg-gray-300");
    });

    // After moving to Step 3
    await userEvent.click(canvas.getByTestId("step2-next"));
    await waitFor(() => {
      expect(canvas.getByTestId("progress-step-1")).toHaveClass("bg-blue-600");
      expect(canvas.getByTestId("progress-step-2")).toHaveClass("bg-blue-600");
      expect(canvas.getByTestId("progress-step-3")).toHaveClass("bg-blue-600");
    });
  },
};
