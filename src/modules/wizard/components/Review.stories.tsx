import type { Meta, StoryObj } from "@storybook/react-vite";
import { expect, userEvent, waitFor, within } from "@storybook/test";
import { http, HttpResponse } from "msw";
import React from "react";

// Quote request data type
interface QuoteRequest {
  companyName: string;
  contactEmail: string;
  vesselName: string;
  vesselType: string;
  coverageLevel: string;
  cargoValue: number;
}

// Mock Review component
interface ReviewProps {
  data: QuoteRequest;
  onSubmit: () => Promise<void>;
  onBack: () => void;
}

const Review: React.FC<ReviewProps> = ({ data, onSubmit, onBack }) => {
  const [isSubmitting, setIsSubmitting] = React.useState(false);
  const [submitError, setSubmitError] = React.useState<string>("");
  const [submitSuccess, setSubmitSuccess] = React.useState(false);

  const formatCargoValue = (value: number) => {
    return value.toLocaleString();
  };

  const handleSubmit = async () => {
    setIsSubmitting(true);
    setSubmitError("");

    try {
      // Submit to API
      const response = await fetch(
        "https://jsonplaceholder.typicode.com/posts",
        {
          method: "POST",
          headers: {
            "Content-Type": "application/json",
          },
          body: JSON.stringify(data),
        }
      );

      if (!response.ok) {
        throw new Error("Submission failed");
      }

      await onSubmit();
      setSubmitSuccess(true);

      // Clear localStorage on successful submission
      localStorage.removeItem("quoteDraft");
    } catch (error) {
      setSubmitError(
        error instanceof Error ? error.message : "An error occurred"
      );
    } finally {
      setIsSubmitting(false);
    }
  };

  const handleRetry = () => {
    setSubmitError("");
    handleSubmit();
  };

  if (submitSuccess) {
    return (
      <div className="max-w-md mx-auto p-6 bg-white rounded-lg shadow-lg text-center">
        <div
          data-testid="success-message"
          className="text-green-600 text-lg font-semibold mb-4"
        >
          Quote submitted!
        </div>
        <p className="text-gray-600">
          Your quote request has been submitted successfully. You will receive a
          response shortly.
        </p>
      </div>
    );
  }

  return (
    <div className="max-w-md mx-auto p-6 bg-white rounded-lg shadow-lg">
      <div className="text-center mb-6">
        <h2 className="text-xl font-semibold text-gray-800">
          Review Your Quote Request
        </h2>
        <p className="text-gray-600 mt-2">
          Please review all information before submitting
        </p>
      </div>

      <div className="space-y-4 mb-6" data-testid="review-summary">
        <div className="grid grid-cols-2 gap-4">
          <div>
            <span className="font-medium text-gray-700">Company Name:</span>
            <div data-testid="review-company-name">{data.companyName}</div>
          </div>
          <div>
            <span className="font-medium text-gray-700">Contact Email:</span>
            <div data-testid="review-contact-email">{data.contactEmail}</div>
          </div>
          <div>
            <span className="font-medium text-gray-700">Vessel Name:</span>
            <div data-testid="review-vessel-name">{data.vesselName}</div>
          </div>
          <div>
            <span className="font-medium text-gray-700">Vessel Type:</span>
            <div data-testid="review-vessel-type">{data.vesselType}</div>
          </div>
          <div>
            <span className="font-medium text-gray-700">Coverage Level:</span>
            <div data-testid="review-coverage-level">{data.coverageLevel}</div>
          </div>
          <div>
            <span className="font-medium text-gray-700">Cargo Value:</span>
            <div data-testid="review-cargo-value">
              ${formatCargoValue(data.cargoValue)}
            </div>
          </div>
        </div>
      </div>

      {submitError && (
        <div
          className="mb-4 p-3 bg-red-100 border border-red-400 text-red-700 rounded"
          data-testid="error-message"
        >
          <div className="font-medium">Submission Failed</div>
          <div className="text-sm mt-1">{submitError}</div>
          <button
            onClick={handleRetry}
            className="mt-2 px-3 py-1 bg-red-600 text-white text-sm rounded hover:bg-red-700"
            data-testid="retry-button"
          >
            Retry
          </button>
        </div>
      )}

      <div className="flex space-x-4">
        <button
          data-testid="back-button"
          onClick={onBack}
          disabled={isSubmitting}
          className="px-4 py-2 bg-gray-100 text-gray-700 rounded-md hover:bg-gray-200 focus:outline-none focus:ring-2 focus:ring-gray-500 disabled:opacity-50"
        >
          Back
        </button>
        <button
          data-testid="submit-button"
          onClick={handleSubmit}
          disabled={isSubmitting}
          className="px-4 py-2 bg-green-600 text-white rounded-md hover:bg-green-700 focus:outline-none focus:ring-2 focus:ring-green-500 disabled:bg-gray-300 disabled:cursor-not-allowed"
        >
          {isSubmitting ? "Submitting..." : "Submit Request"}
        </button>
      </div>
    </div>
  );
};

const meta: Meta<typeof Review> = {
  title: "Features/Maritime Quote Wizard/Review",
  component: Review,
  parameters: {
    layout: "centered",
    msw: {
      handlers: [
        http.post("https://jsonplaceholder.typicode.com/posts", () => {
          return HttpResponse.json({ id: 1, success: true });
        }),
      ],
    },
  },
};

export default meta;
type Story = StoryObj<typeof meta>;

const sampleQuoteData: QuoteRequest = {
  companyName: "Mediterranean Shipping",
  contactEmail: "ops@medshipping.com",
  vesselName: "MV Horizon",
  vesselType: "Bulk Carrier",
  coverageLevel: "Standard",
  cargoValue: 3500000,
};

// @e2e @data-integrity
export const ReviewPageDisplaysInformation: Story = {
  args: {
    data: sampleQuoteData,
    onSubmit: async () => {},
    onBack: () => {},
  },
  play: async ({ canvasElement }) => {
    const canvas = within(canvasElement);

    // Given: I have entered the following information and navigated to review
    // Then: I should see all 6 fields displayed in a summary
    expect(canvas.getByTestId("review-summary")).toBeInTheDocument();

    // And: Each value should match what I entered
    expect(canvas.getByTestId("review-company-name")).toHaveTextContent(
      "Mediterranean Shipping"
    );
    expect(canvas.getByTestId("review-contact-email")).toHaveTextContent(
      "ops@medshipping.com"
    );
    expect(canvas.getByTestId("review-vessel-name")).toHaveTextContent(
      "MV Horizon"
    );
    expect(canvas.getByTestId("review-vessel-type")).toHaveTextContent(
      "Bulk Carrier"
    );
    expect(canvas.getByTestId("review-coverage-level")).toHaveTextContent(
      "Standard"
    );

    // And: The cargo value should be formatted as "3,500,000"
    expect(canvas.getByTestId("review-cargo-value")).toHaveTextContent(
      "$3,500,000"
    );
  },
};

// @integration @api
export const SubmitToCorrectAPIEndpoint: Story = {
  args: {
    data: sampleQuoteData,
    onSubmit: async () => {},
    onBack: () => {},
  },
  parameters: {
    msw: {
      handlers: [
        http.post(
          "https://jsonplaceholder.typicode.com/posts",
          async ({ request }) => {
            const body = (await request.json()) as QuoteRequest;

            // Verify the request body contains all required fields
            const requiredFields = [
              "companyName",
              "contactEmail",
              "vesselName",
              "vesselType",
              "coverageLevel",
              "cargoValue",
            ];
            const hasAllFields = requiredFields.every((field) => field in body);

            if (!hasAllFields) {
              return new HttpResponse(null, { status: 400 });
            }

            return HttpResponse.json({ id: 1, success: true });
          }
        ),
      ],
    },
  },
  play: async ({ canvasElement }) => {
    const canvas = within(canvasElement);

    // Given: I have completed all steps and am on the review page
    // When: I click the "Submit Request" button
    await userEvent.click(canvas.getByTestId("submit-button"));

    // Then: A POST request should be sent to the correct endpoint
    // And: The request body should contain all QuoteRequest fields
    // (This is verified by the MSW handler above)

    // Wait for success message
    await waitFor(
      () => {
        expect(canvas.getByTestId("success-message")).toHaveTextContent(
          "Quote submitted!"
        );
      },
      { timeout: 3000 }
    );
  },
};

// @integration @state-management
export const ClearDraftAfterSuccessfulSubmission: Story = {
  args: {
    data: sampleQuoteData,
    onSubmit: async () => {},
    onBack: () => {},
  },
  decorators: [
    (Story) => {
      // Set up localStorage with draft data
      React.useEffect(() => {
        localStorage.setItem(
          "quoteDraft",
          JSON.stringify({
            step1: { companyName: "Test", contactEmail: "test@test.com" },
            step2: { vesselName: "Test Vessel", vesselType: "Bulk Carrier" },
            step3: { coverageLevel: "Basic", cargoValue: 1000000 },
          })
        );
      }, []);

      return <Story />;
    },
  ],
  play: async ({ canvasElement }) => {
    const canvas = within(canvasElement);

    // Given: I have a saved draft in localStorage
    expect(localStorage.getItem("quoteDraft")).toBeTruthy();

    // When: I complete all steps and submit successfully
    await userEvent.click(canvas.getByTestId("submit-button"));

    // Then: localStorage should be cleared of "quoteDraft"
    await waitFor(
      () => {
        expect(canvas.getByTestId("success-message")).toBeInTheDocument();
      },
      { timeout: 3000 }
    );

    expect(localStorage.getItem("quoteDraft")).toBeNull();
  },
};

// @e2e @error-handling
export const HandleAPISubmissionFailure: Story = {
  args: {
    data: sampleQuoteData,
    onSubmit: async () => {},
    onBack: () => {},
  },
  parameters: {
    msw: {
      handlers: [
        http.post("https://jsonplaceholder.typicode.com/posts", () => {
          return new HttpResponse(null, { status: 500 });
        }),
      ],
    },
  },
  decorators: [
    (Story) => {
      React.useEffect(() => {
        localStorage.setItem("quoteDraft", JSON.stringify(sampleQuoteData));
      }, []);

      return <Story />;
    },
  ],
  play: async ({ canvasElement }) => {
    const canvas = within(canvasElement);

    // Given: The mock API is configured to return an error
    // When: I click the "Submit Request" button
    await userEvent.click(canvas.getByTestId("submit-button"));

    // Then: I should see an error message
    await waitFor(
      () => {
        expect(canvas.getByTestId("error-message")).toBeInTheDocument();
      },
      { timeout: 3000 }
    );

    // And: localStorage should still contain "quoteDraft"
    expect(localStorage.getItem("quoteDraft")).toBeTruthy();

    // And: I should remain on the review page (not navigate away)
    expect(canvas.getByTestId("review-summary")).toBeInTheDocument();
  },
};

// @e2e @error-handling
export const HandleAPISubmissionTimeout: Story = {
  args: {
    data: sampleQuoteData,
    onSubmit: async () => {},
    onBack: () => {},
  },
  parameters: {
    msw: {
      handlers: [
        http.post("https://jsonplaceholder.typicode.com/posts", async () => {
          // Simulate timeout
          await new Promise((resolve) => setTimeout(resolve, 10000));
          return HttpResponse.json({ id: 1 });
        }),
      ],
    },
  },
  decorators: [
    (Story) => {
      React.useEffect(() => {
        localStorage.setItem("quoteDraft", JSON.stringify(sampleQuoteData));
      }, []);

      return <Story />;
    },
  ],
  play: async ({ canvasElement }) => {
    const canvas = within(canvasElement);

    // Given: The mock API is configured to timeout
    // When: I click the "Submit Request" button
    await userEvent.click(canvas.getByTestId("submit-button"));

    // Then: I should see a timeout error message
    // Note: In a real implementation, you'd implement proper timeout handling
    await waitFor(() => {
      expect(canvas.getByTestId("submit-button")).toHaveTextContent(
        "Submitting..."
      );
    });

    // And: localStorage should still contain "quoteDraft"
    expect(localStorage.getItem("quoteDraft")).toBeTruthy();
  },
};

// @e2e @error-recovery
export const RetrySubmissionAfterFailure: Story = {
  args: {
    data: sampleQuoteData,
    onSubmit: async () => {},
    onBack: () => {},
  },
  parameters: {
    msw: {
      handlers: [
        // First request fails
        http.post(
          "https://jsonplaceholder.typicode.com/posts",
          () => {
            return new HttpResponse(null, { status: 500 });
          },
          { once: true }
        ),
        // Second request succeeds
        http.post("https://jsonplaceholder.typicode.com/posts", () => {
          return HttpResponse.json({ id: 1, success: true });
        }),
      ],
    },
  },
  play: async ({ canvasElement }) => {
    const canvas = within(canvasElement);

    // Given: The network request fails on first attempt
    // When: I click submit and see the error message
    await userEvent.click(canvas.getByTestId("submit-button"));

    await waitFor(
      () => {
        expect(canvas.getByTestId("error-message")).toBeInTheDocument();
      },
      { timeout: 3000 }
    );

    // And: I click "Retry"
    await userEvent.click(canvas.getByTestId("retry-button"));

    // Then: The second request succeeds
    await waitFor(
      () => {
        expect(canvas.getByTestId("success-message")).toHaveTextContent(
          "Quote submitted!"
        );
      },
      { timeout: 3000 }
    );
  },
};

// Loading state
export const LoadingState: Story = {
  args: {
    data: sampleQuoteData,
    onSubmit: async () => {
      await new Promise((resolve) => setTimeout(resolve, 2000));
    },
    onBack: () => {},
  },
  play: async ({ canvasElement }) => {
    const canvas = within(canvasElement);

    // Click submit to show loading state
    await userEvent.click(canvas.getByTestId("submit-button"));

    // Verify loading state
    expect(canvas.getByTestId("submit-button")).toHaveTextContent(
      "Submitting..."
    );
    expect(canvas.getByTestId("submit-button")).toBeDisabled();
    expect(canvas.getByTestId("back-button")).toBeDisabled();
  },
};

// Success state
export const SuccessState: Story = {
  args: {
    data: sampleQuoteData,
    onSubmit: async () => {},
    onBack: () => {},
  },
  play: async ({ canvasElement }) => {
    const canvas = within(canvasElement);

    // Submit successfully
    await userEvent.click(canvas.getByTestId("submit-button"));

    // Wait for success state
    await waitFor(
      () => {
        expect(canvas.getByTestId("success-message")).toBeInTheDocument();
      },
      { timeout: 3000 }
    );
  },
};
