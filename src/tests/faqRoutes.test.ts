import request from 'supertest';
import app from '../app';
import { prisma } from '../services/prismaService';

// Mock the Prisma client
jest.mock('../services/prismaService', () => {
  return {
    prisma: {
      $connect: jest.fn().mockResolvedValue(undefined),
      $disconnect: jest.fn().mockResolvedValue(undefined),
      fAQ: {
        findMany: jest.fn().mockResolvedValue([]), // Mock the findMany method
        findUnique: jest.fn().mockResolvedValue(null), // Mock the findUnique method
        create: jest.fn().mockResolvedValue({ id: 1, question: 'What is your name?', answer: 'My name is ChatGPT.' }),
      },
    },
  };
});

describe('FAQ Routes', () => {
  beforeAll(async () => {
    // Connect to the database before running tests
    await prisma.$connect();
  });

  afterAll(async () => {
    // Close the database connection after tests
    await prisma.$disconnect();
  });

  test('GET /api/faqs should return a list of FAQs', async () => {
    const response = await request(app).get('/api/faqs');
    expect(response.status).toBe(200);
    // You can add more assertions based on your expected response structure
  });

  test('GET /api/faqs/:id should return a specific FAQ', async () => {
    const faqId = 1; // Replace with a valid ID from your database
    const response = await request(app).get(`/api/faqs/${faqId}`);
    expect(response.status).toBe(200);
    expect(response.body).toHaveProperty('id', faqId);
  });

  test('GET /api/faqs/:id with non-existing ID should return 404', async () => {
    const response = await request(app).get('/api/faqs/9999'); // Assuming 9999 does not exist
    expect(response.status).toBe(404);
    expect(response.body).toHaveProperty('error', 'FAQ not found');
  });

  test('POST /api/faqs should create a new FAQ', async () => {
    const newFAQ = {
      question: 'What is your name?',
      answer: 'My name is ChatGPT.',
    };

    const response = await request(app)
      .post('/api/faqs')
      .send(newFAQ)
      .set('Content-Type', 'application/json');

    expect(response.status).toBe(201);
    expect(response.body).toHaveProperty('id'); // Assuming the response includes the created FAQ ID
    expect(response.body).toHaveProperty('question', newFAQ.question);
    expect(response.body).toHaveProperty('answer', newFAQ.answer);
  });

  test('POST /api/faqs with missing fields should return 400', async () => {
    const response = await request(app)
      .post('/api/faqs')
      .send({ question: '' }) // Missing answer
      .set('Content-Type', 'application/json');

    expect(response.status).toBe(400);
    expect(response.body).toHaveProperty('error', 'Answer is required');
  });
}); 