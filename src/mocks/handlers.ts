import { http, HttpResponse } from 'msw';

export const handlers = [
  // Mock API endpoint for quote requests
  http.post('https://jsonplaceholder.typicode.com/posts', async ({ request }) => {
    // Check for test error header
    const testError = request.headers.get('x-test-error');
    if (testError === 'true') {
      return new HttpResponse('Server error', { status: 500 });
    }
    
    // Check for test timeout header
    const testTimeout = request.headers.get('x-test-timeout');
    if (testTimeout === 'true') {
      // Delay longer than the API timeout (3 seconds)
      await new Promise(resolve => setTimeout(resolve, 5000));
      return HttpResponse.json({ id: 1, status: 'submitted' });
    }
    
    const body = await request.json();
    return HttpResponse.json({ 
      id: 1,
      status: 'submitted',
      ...body
    });
  }),

  // Mock user data endpoint
  http.get('/api/users', () => {
    return HttpResponse.json([{ id: 1, name: 'John Doe' }]);
  }),
];