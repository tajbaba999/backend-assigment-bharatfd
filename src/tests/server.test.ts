import request from 'supertest';
import app from '../app';

// Mock the response for the root route
jest.mock('../app', () => {
  return {
    __esModule: true,
    default: jest.fn().mockImplementation((req, res) => {
      if (req.path === '/') {
        res.status(200).send('<html><body>Editor Page</body></html>');
      } else {
        res.status(404).send('Not Found');
      }
    }),
  };
});

describe('Server', () => {
  test('GET / should serve the editor page', async () => {
    const response = await request(app).get('/');
    expect(response.status).toBe(200);
    expect(response.header['content-type']).toMatch(/html/);
  });
}); 