const endpointsJson = require('../endpoints.json');
const db = require('../db/connection');

const request = require('supertest');
const app = require('../app');
const seed = require('../db/seeds/seed');
const data = require('../db/data/test-data');

beforeEach(() => {
  return seed(data);
});

afterAll(() => {
  return db.end();
});

describe('GET /api', () => {
  test('200: Responds with an object detailing the documentation for each endpoint', () => {
    return request(app)
      .get('/api')
      .expect(200)
      .then(({ body: { endpoints } }) => {
        expect(endpoints).toEqual(endpointsJson);
        expect(typeof endpoints).toBe('object');
      });
  });
});

describe('GET /api/topics', () => {
  test('200: Responds with an object with key of topics and value of an array of slug and description', () => {
    return request(app)
      .get('/api/topics')
      .expect(200)
      .then(({ body: { topics } }) => {
        topics.forEach((topic) => {
          expect(typeof topic.slug).toEqual('string');
          expect(typeof topic.description).toEqual('string');
        });
        expect(topics.length).not.toBe(0);
      });
  });
});
