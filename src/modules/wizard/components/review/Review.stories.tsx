import type { Meta, StoryObj } from "@storybook/react-vite";
import { expect, within } from "@storybook/test";
import { http, HttpResponse } from "msw";
import { Review } from './Review';
import type { QuoteRequest } from './Review';

const sampleQuoteData: QuoteRequest = {
  companyName: "Atlantic Shipping Ltd",
  contactEmail: "captain@atlanticshipping.com",
  vesselName: "SS Maritime Explorer",
  vesselType: "Container Ship",
  coverageLevel: "Standard",
  cargoValue: 2500000,
};

const meta: Meta<typeof Review> = {
  title: "Features/Maritime Quote Wizard/Review",
  component: Review,
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
};

export default meta;
type Story = StoryObj<typeof meta>;

export const Default: Story = {
  tags: ['test'],
  args: {
    data: sampleQuoteData,
    onSubmit: async () => {},
    onBack: () => {},
  },
  play: async ({ canvasElement }) => {
    const canvas = within(canvasElement);
    
    // Test that review data is displayed
    expect(canvas.getByTestId('review-company-name')).toHaveTextContent('Atlantic Shipping Ltd');
    expect(canvas.getByTestId('review-contact-email')).toHaveTextContent('captain@atlanticshipping.com');
    expect(canvas.getByTestId('review-vessel-name')).toHaveTextContent('SS Maritime Explorer');
  },
};

export const LoadingState: Story = {
  tags: ['test'],
  args: {
    data: sampleQuoteData,
    onSubmit: async () => {
      await new Promise((resolve) => setTimeout(resolve, 1000));
    },
    onBack: () => {},
  },
  play: async ({ canvasElement }) => {
    const canvas = within(canvasElement);
    
    // Test submit button exists
    expect(canvas.getByTestId('submit-request')).toBeInTheDocument();
  },
};

export const ErrorState: Story = {
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
  args: {
    data: sampleQuoteData,
    onSubmit: async () => {
      throw new Error("Submission failed");
    },
    onBack: () => {},
  },
  play: async ({ canvasElement }) => {
    const canvas = within(canvasElement);
    
    // Test that components render properly even in error state
    expect(canvas.getByTestId('submit-request')).toBeInTheDocument();
  },
};