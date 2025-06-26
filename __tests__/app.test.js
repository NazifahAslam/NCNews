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
          expect(typeof article.body).toBe('string');
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

describe('GET /api/users', () => {
  test('200: Responds with an object with key of users and value of an array of user properties', () => {
    return request(app)
      .get('/api/users')
      .expect(200)
      .then(({ body: { users } }) => {
        users.forEach((user) => {
          expect(typeof user.username).toBe('string');
          expect(typeof user.name).toBe('string');
          expect(typeof user.avatar_url).toBe('string');
        });
        expect(users.length).not.toBe(0);
      });
  });
});

describe('GET /api/articles/:article_id', () => {
  test('200: Responds with an object with the key of article and the value of an article object with properties', () => {
    return request(app)
      .get('/api/articles/1')
      .expect(200)
      .then(({ body: { article } }) => {
        expect(article.article_id).toBe(1);
        expect(typeof article.author).toBe('string');
        expect(typeof article.title).toBe('string');
        expect(typeof article.body).toBe('string');
        expect(typeof article.topic).toBe('string');
        expect(typeof article.created_at).toBe('string');
        expect(typeof article.votes).toBe('number');
        expect(typeof article.article_img_url).toBe('string');
      });
  });
  test('404: responds with an error when given an id that is not in our datatbase', () => {
    return request(app)
      .get('/api/articles/100')
      .expect(404)
      .then(({ body: { message } }) => {
        expect(message).toBe('not found');
      });
  });
  test('400: responds with an error when given an id that is not the correct format', () => {
    return request(app)
      .get('/api/articles/hello')
      .expect(400)
      .then(({ body: { message } }) => {
        expect(message).toBe('bad request');
      });
  });
});

describe('GET /api/articles/:article_id/comments', () => {
  test('200: responds with an object with the key of comments and the value of an array of comments for the given article_id.', () => {
    return request(app)
      .get('/api/articles/1/comments')
      .expect(200)
      .then(({ body: { comments } }) => {
        comments.forEach((comment) => {
          expect(typeof comment.comment_id).toBe('number');
          expect(typeof comment.votes).toBe('number');
          expect(typeof comment.created_at).toBe('string');
          expect(typeof comment.author).toBe('string');
          expect(typeof comment.body).toBe('string');
          expect(comment.article_id).toBe(1);
        });
      });
  });
  test('404: responds with an error when given an id that is not in our datatbase with comments endpoint.', () => {
    return request(app)
      .get('/api/articles/100/comments')
      .expect(404)
      .then(({ body: { message } }) => {
        expect(message).toBe('not found');
      });
  });
  test('400: responds with an error when given an id that is not the correct format with comments endpoint.', () => {
    return request(app)
      .get('/api/articles/hello')
      .expect(400)
      .then(({ body: { message } }) => {
        expect(message).toBe('bad request');
      });
  });
});

/*
 */
