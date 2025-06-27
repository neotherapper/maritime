import type { Meta, StoryObj } from "@storybook/react-vite";
import { expect, within } from "@storybook/test";
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

export const Default: Story = {
  tags: ['test'],
  play: async ({ canvasElement }) => {
    const canvas = within(canvasElement);
    
    // Test that the wizard starts on step 1
    expect(canvas.getByTestId('step-indicator')).toBeInTheDocument();
    expect(canvas.getByTestId('company-name')).toBeInTheDocument();
  },
};

export const WithDraftData: Story = {
  tags: ['test'],
  decorators: [
    (Story) => {
      React.useEffect(() => {
        localStorage.setItem(
          "quoteDraft",
          JSON.stringify({
            step1: { companyName: "Test Company", contactEmail: "test@company.com" },
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
    
    // Test that wizard loads with step indicator
    expect(canvas.getByTestId('step-indicator')).toBeInTheDocument();
  },
};

export const APIFailure: Story = {
  tags: ['test'],
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
    
    // Test that wizard renders even with API failure configured
    expect(canvas.getByTestId('step-indicator')).toBeInTheDocument();
    expect(canvas.getByTestId('company-name')).toBeInTheDocument();
  },
};