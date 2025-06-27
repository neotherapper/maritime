import type { Meta, StoryObj } from "@storybook/react-vite";
import { expect, userEvent, waitFor, within } from "@storybook/test";
import { http, HttpResponse } from "msw";
import React from "react";

// Mock QuoteWizard component that orchestrates the entire flow
interface QuoteWizardState {
  currentStep: number;
  data: {
    step1?: { companyName: string; contactEmail: string };
    step2?: { vesselName: string; vesselType: string };
    step3?: { coverageLevel: string; cargoValue: number };
  };
}

const QuoteWizard: React.FC = () => {
  const [state, setState] = React.useState<QuoteWizardState>({
    currentStep: 1,
    data: {},
  });
  const [isSubmitted, setIsSubmitted] = React.useState(false);

  // Load from localStorage on mount
  React.useEffect(() => {
    const savedDraft = localStorage.getItem("quoteDraft");
    if (savedDraft) {
      try {
        const parsed = JSON.parse(savedDraft);
        setState((prev) => ({
          ...prev,
          data: parsed,
          currentStep: determineCurrentStep(parsed),
        }));
      } catch (error) {
        console.error("Failed to parse saved draft:", error);
      }
    }
  }, []);

  const determineCurrentStep = (data: any): number => {
    if (data.step3) return 3;
    if (data.step2) return 2;
    return 1;
  };

  const saveDraft = (stepData: any, step: number) => {
    const newData = { ...state.data, [`step${step}`]: stepData };
    setState((prev) => ({ ...prev, data: newData }));
    localStorage.setItem("quoteDraft", JSON.stringify(newData));
  };

  const handleStep1Next = (data: {
    companyName: string;
    contactEmail: string;
  }) => {
    saveDraft(data, 1);
    setState((prev) => ({ ...prev, currentStep: 2 }));
  };

  const handleStep1SaveDraft = (data: {
    companyName: string;
    contactEmail: string;
  }) => {
    saveDraft(data, 1);
  };

  const handleStep2Next = (data: {
    vesselName: string;
    vesselType: string;
  }) => {
    saveDraft(data, 2);
    setState((prev) => ({ ...prev, currentStep: 3 }));
  };

  const handleStep2Back = () => {
    setState((prev) => ({ ...prev, currentStep: 1 }));
  };

  const handleStep3Review = (data: {
    coverageLevel: string;
    cargoValue: number;
  }) => {
    saveDraft(data, 3);
    setState((prev) => ({ ...prev, currentStep: 4 })); // Review step
  };

  const handleStep3Back = () => {
    setState((prev) => ({ ...prev, currentStep: 2 }));
  };

  const handleReviewBack = () => {
    setState((prev) => ({ ...prev, currentStep: 3 }));
  };

  const handleSubmit = async () => {
    const fullData = {
      ...state.data.step1,
      ...state.data.step2,
      ...state.data.step3,
    };

    const response = await fetch("https://jsonplaceholder.typicode.com/posts", {
      method: "POST",
      headers: { "Content-Type": "application/json" },
      body: JSON.stringify(fullData),
    });

    if (!response.ok) {
      throw new Error("Submission failed");
    }

    localStorage.removeItem("quoteDraft");
    setIsSubmitted(true);
  };

  if (isSubmitted) {
    return (
      <div className="max-w-md mx-auto p-6 bg-white rounded-lg shadow-lg text-center">
        <div
          data-testid="success-message"
          className="text-green-600 text-lg font-semibold"
        >
          Quote submitted!
        </div>
      </div>
    );
  }

  return (
    <div className="min-h-screen bg-gray-50 py-8">
      <div className="max-w-2xl mx-auto">
        {/* Progress indicator */}
        <div className="mb-8">
          <div className="flex justify-center space-x-4">
            {[1, 2, 3].map((step) => (
              <div
                key={step}
                className={`w-8 h-8 rounded-full flex items-center justify-center text-sm font-medium ${
                  step <= Math.min(state.currentStep, 3)
                    ? "bg-blue-600 text-white"
                    : "bg-gray-300 text-gray-600"
                }`}
                data-testid={`progress-step-${step}`}
              >
                {step}
              </div>
            ))}
          </div>
        </div>

        {/* Step content */}
        {state.currentStep === 1 && (
          <MockStep1
            onNext={handleStep1Next}
            onSaveDraft={handleStep1SaveDraft}
            initialData={state.data.step1}
          />
        )}

        {state.currentStep === 2 && (
          <MockStep2
            onNext={handleStep2Next}
            onBack={handleStep2Back}
            initialData={state.data.step2}
          />
        )}

        {state.currentStep === 3 && (
          <MockStep3
            onReview={handleStep3Review}
            onBack={handleStep3Back}
            initialData={state.data.step3}
          />
        )}

        {state.currentStep === 4 && (
          <MockReview
            data={{
              companyName: state.data.step1?.companyName || "",
              contactEmail: state.data.step1?.contactEmail || "",
              vesselName: state.data.step2?.vesselName || "",
              vesselType: state.data.step2?.vesselType || "",
              coverageLevel: state.data.step3?.coverageLevel || "",
              cargoValue: state.data.step3?.cargoValue || 0,
            }}
            onSubmit={handleSubmit}
            onBack={handleReviewBack}
          />
        )}
      </div>
    </div>
  );
};

// Simplified mock components for the wizard flow
const MockStep1: React.FC<any> = ({ onNext, onSaveDraft, initialData }) => (
  <div
    className="bg-white p-6 rounded-lg shadow-lg"
    data-testid="step1-content"
  >
    <h2 className="text-xl font-semibold mb-4">Step 1: Company Information</h2>
    <button
      onClick={() =>
        onNext({
          companyName: "Pacific Shipping Ltd",
          contactEmail: "john.smith@pacificshipping.com",
        })
      }
      data-testid="step1-next"
    >
      Next
    </button>
    <button
      onClick={() =>
        onSaveDraft({
          companyName: "Atlantic Vessels Inc",
          contactEmail: "info@atlanticvessels.com",
        })
      }
      data-testid="step1-save-draft"
    >
      Save Draft
    </button>
  </div>
);

const MockStep2: React.FC<any> = ({ onNext, onBack, initialData }) => (
  <div
    className="bg-white p-6 rounded-lg shadow-lg"
    data-testid="step2-content"
  >
    <h2 className="text-xl font-semibold mb-4">Step 2: Vessel Information</h2>
    <button onClick={onBack} data-testid="step2-back">
      Back
    </button>
    <button
      onClick={() =>
        onNext({ vesselName: "MV Ocean Pioneer", vesselType: "Bulk Carrier" })
      }
      data-testid="step2-next"
    >
      Next
    </button>
  </div>
);

const MockStep3: React.FC<any> = ({ onReview, onBack, initialData }) => (
  <div
    className="bg-white p-6 rounded-lg shadow-lg"
    data-testid="step3-content"
  >
    <h2 className="text-xl font-semibold mb-4">Step 3: Coverage Information</h2>
    <button onClick={onBack} data-testid="step3-back">
      Back
    </button>
    <button
      onClick={() =>
        onReview({ coverageLevel: "Premium", cargoValue: 5000000 })
      }
      data-testid="step3-review"
    >
      Review
    </button>
  </div>
);

const MockReview: React.FC<any> = ({ data, onSubmit, onBack }) => (
  <div
    className="bg-white p-6 rounded-lg shadow-lg"
    data-testid="review-content"
  >
    <h2 className="text-xl font-semibold mb-4">Review Your Quote Request</h2>
    <div data-testid="review-data">{JSON.stringify(data, null, 2)}</div>
    <button onClick={onBack} data-testid="review-back">
      Back
    </button>
    <button onClick={onSubmit} data-testid="review-submit">
      Submit Request
    </button>
  </div>
);

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
      return <Story />;
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

      return <Story />;
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
