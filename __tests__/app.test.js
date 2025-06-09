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
          expect(typeof topic.slug).toBe('string');
          expect(typeof topic.description).toBe('string');
        });
        expect(topics.length).not.toBe(0);
      });
  });
});

describe('GET /api/articles', () => {
  test('200: Responds with an object with key of articles and value of an array of article properties', () => {
    return request(app)
      .get('/api/articles')
      .expect(200)
      .then(({ body: { articles } }) => {
        articles.forEach((article) => {
          expect(typeof article.article_id).toBe('number');
          expect(typeof article.author).toBe('string');
          expect(typeof article.title).toBe('string');
          expect(typeof article.topic).toBe('string');
          expect(typeof article.created_at).toBe('string');
          expect(typeof article.votes).toBe('number');
          expect(typeof article.article_img_url).toBe('string');
          expect(typeof article.comment_count).toBe('number');
        });
        expect(articles).toBeSortedBy('created_at', {
          descending: true,
        });
        expect(articles.length).not.toBe(0);
      });
  });
});
