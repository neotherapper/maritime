import type { QuoteRequest } from '../components/review/Review';

const API_BASE_URL = 'https://jsonplaceholder.typicode.com';
const TIMEOUT_MS = 3000; // 3 seconds for faster testing

export interface ApiResponse {
  id: number;
  status: string;
}

// Custom error for API failures
export class ApiError extends Error {
  public status?: number;
  public statusText?: string;
  
  constructor(
    message: string,
    status?: number,
    statusText?: string
  ) {
    super(message);
    this.name = 'ApiError';
    this.status = status;
    this.statusText = statusText;
  }
}

// Custom error for timeouts
export class TimeoutError extends Error {
  constructor(message: string = 'Request timed out') {
    super(message);
    this.name = 'TimeoutError';
  }
}

// Submit quote request to the API
export const submitQuoteRequest = async (quoteRequest: QuoteRequest): Promise<ApiResponse> => {
  const controller = new AbortController();
  const timeoutId = setTimeout(() => controller.abort(), TIMEOUT_MS);

  // Type-safe window interface for testing
  interface TestWindow extends Window {
    TEST_API_ENDPOINT?: string;
    TEST_API_ERROR?: boolean;
    TEST_API_TIMEOUT?: boolean;
  }
  
  // Allow test endpoint override for E2E testing
  const testEndpoint = (window as TestWindow).TEST_API_ENDPOINT;
  const endpoint = testEndpoint || `${API_BASE_URL}/posts`;
  
  // Check for test error flag
  const testError = (window as TestWindow).TEST_API_ERROR;
  const testTimeout = (window as TestWindow).TEST_API_TIMEOUT;
  const headers: Record<string, string> = {
    'Content-Type': 'application/json',
  };
  
  if (testError) {
    headers['x-test-error'] = 'true';
  }
  
  if (testTimeout) {
    headers['x-test-timeout'] = 'true';
  }

  try {
    const response = await fetch(endpoint, {
      method: 'POST',
      headers,
      body: JSON.stringify({
        companyName: quoteRequest.companyName,
        contactEmail: quoteRequest.contactEmail,
        vesselName: quoteRequest.vesselName,
        vesselType: quoteRequest.vesselType,
        coverageLevel: quoteRequest.coverageLevel,
        cargoValue: quoteRequest.cargoValue
      }),
      signal: controller.signal
    });

    clearTimeout(timeoutId);

    if (!response.ok) {
      throw new ApiError(
        `Failed to submit quote request: ${response.statusText}`,
        response.status,
        response.statusText
      );
    }

    const data = await response.json();
    
    return {
      id: data.id || Math.floor(Math.random() * 1000),
      status: 'submitted'
    };
  } catch (error) {
    clearTimeout(timeoutId);
    
    if (error instanceof Error && error.name === 'AbortError') {
      throw new TimeoutError('Request timed out. Please try again.');
    }
    
    if (error instanceof ApiError) {
      throw error;
    }
    
    // Network or other errors
    throw new ApiError(
      'Network error. Please check your connection and try again.',
      0,
      'Network Error'
    );
  }
};