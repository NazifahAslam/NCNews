const endpointsJson = require("../endpoints.json");
const db = require("../db/connection");

const request = require("supertest");
const app = require("../app");
const seed = require("../db/seeds/seed");
const data = require("../db/data/test-data");
const comments = require("../db/data/test-data/comments");
const { articleId } = require("../models/api.models");

beforeEach(() => {
  return seed(data);
});

afterAll(() => {
  return db.end();
});

describe("GET /api", () => {
  test("200: Responds with an object detailing the documentation for each endpoint", () => {
    return request(app)
      .get("/api")
      .expect(200)
      .then(({ body: { endpoints } }) => {
        expect(endpoints).toEqual(endpointsJson);
        expect(typeof endpoints).toBe("object");
      });
  });
});

describe("GET /api/topics", () => {
  test("200: Responds with an object with key of topics and value of an array of slug and description", () => {
    return request(app)
      .get("/api/topics")
      .expect(200)
      .then(({ body: { topics } }) => {
        topics.forEach((topic) => {
          expect(typeof topic.slug).toBe("string");
          expect(typeof topic.description).toBe("string");
        });
        expect(topics.length).not.toBe(0);
      });
  });
});

describe("GET /api/articles", () => {
  test("200: Responds with an object with key of articles and value of an array of article properties", () => {
    return request(app)
      .get("/api/articles")
      .expect(200)
      .then(({ body: { articles } }) => {
        articles.forEach((article) => {
          expect(typeof article.article_id).toBe("number");
          expect(typeof article.author).toBe("string");
          expect(typeof article.title).toBe("string");
          expect(typeof article.body).toBe("string");
          expect(typeof article.topic).toBe("string");
          expect(typeof article.created_at).toBe("string");
          expect(typeof article.votes).toBe("number");
          expect(typeof article.article_img_url).toBe("string");
          expect(typeof article.comment_count).toBe("number");
        });
        expect(articles).toBeSortedBy("created_at", {
          descending: true,
        });
        expect(articles.length).not.toBe(0);
      });
  });
});

describe("GET /api/users", () => {
  test("200: Responds with an object with key of users and value of an array of user properties", () => {
    return request(app)
      .get("/api/users")
      .expect(200)
      .then(({ body: { users } }) => {
        users.forEach((user) => {
          expect(typeof user.username).toBe("string");
          expect(typeof user.name).toBe("string");
          expect(typeof user.avatar_url).toBe("string");
        });
        expect(users.length).not.toBe(0);
      });
  });
});

describe("GET /api/articles/:article_id", () => {
  test("200: Responds with an object with the key of article and the value of an article object with properties", () => {
    return request(app)
      .get("/api/articles/1")
      .expect(200)
      .then(({ body: { article } }) => {
        expect(article.article_id).toBe(1);
        expect(typeof article.author).toBe("string");
        expect(typeof article.title).toBe("string");
        expect(typeof article.body).toBe("string");
        expect(typeof article.topic).toBe("string");
        expect(typeof article.created_at).toBe("string");
        expect(typeof article.votes).toBe("number");
        expect(typeof article.article_img_url).toBe("string");
      });
  });
  test("404: responds with an error when given an id that is not in our datatbase", () => {
    return request(app)
      .get("/api/articles/100")
      .expect(404)
      .then(({ body: { message } }) => {
        expect(message).toBe("not found");
      });
  });
  test("400: responds with an error when given an id that is not the correct format", () => {
    return request(app)
      .get("/api/articles/hello")
      .expect(400)
      .then(({ body: { message } }) => {
        expect(message).toBe("bad request");
      });
  });
});

describe("GET /api/articles/:article_id/comments", () => {
  test("200: responds with an object with the key of comments and the value of an array of comments for the given article_id.", () => {
    return request(app)
      .get("/api/articles/1/comments")
      .expect(200)
      .then(({ body: { comments } }) => {
        comments.forEach((comment) => {
          expect(typeof comment.comment_id).toBe("number");
          expect(typeof comment.votes).toBe("number");
          expect(typeof comment.created_at).toBe("string");
          expect(typeof comment.author).toBe("string");
          expect(typeof comment.body).toBe("string");
          expect(comment.article_id).toBe(1);
        });
      });
  });
  test("404: responds with an error when given an id that is not in our datatbase with comments endpoint.", () => {
    return request(app)
      .get("/api/articles/100/comments")
      .expect(404)
      .then(({ body: { message } }) => {
        expect(message).toBe("not found");
      });
  });
  test("400: responds with an error when given an id that is not the correct format with comments endpoint.", () => {
    return request(app)
      .get("/api/articles/hello")
      .expect(400)
      .then(({ body: { message } }) => {
        expect(message).toBe("bad request");
      });
  });
});

describe("POST: /api/articles/:article_id/comments", () => {
  test("201: Posts a comment successfully and responds with a posted comment", () => {
    return request(app)
      .post("/api/articles/9/comments")
      .send({
        username: "butter_bridge",
        body: "Hello, my friends",
      })
      .expect(201)
      .then(({ body: { comment } }) => {
        expect(typeof comment.author).toBe("string");
        expect(typeof comment.body).toBe("string");
        expect(comment.article_id).toBe(9);
      });
  });

  test("400: Responds with error if username is missing", () => {
    return request(app)
      .post("/api/articles/1/comments")
      .send({ body: "Hello" })
      .expect(400)
      .then(({ body }) => {
        expect(body.message).toBe("username and body are required");
      });
  });

  test("400: Responds with error if body is missing", () => {
    return request(app)
      .post("/api/articles/1/comments")
      .send({ username: "butter_bridge" })
      .expect(400)
      .then(({ body }) => {
        expect(body.message).toBe("username and body are required");
      });
  });

  test("404: Responds with error if article does not exist", () => {
    return request(app)
      .post("/api/articles/99999/comments")
      .send({ username: "butter_bridge", body: "Hello" })
      .expect(404)
      .then(({ body }) => {
        expect(body.message).toBe("not found");
      });
  });

  test("400: Responds with error if article_id is not a number", () => {
    return request(app)
      .post("/api/articles/notanumber/comments")
      .send({ username: "butter_bridge", body: "Hello" })
      .expect(400)
      .then(({ body }) => {
        expect(body.message).toBe("bad request");
      });
  });
});

describe("PATCH /api/articles/:article_id", () => {
  test("200: update the number of article's votes and returns the updated article with the correct increment vote count", () => {
    let originalVotes;

    return request(app)
      .get("/api/articles/9")
      .then(({ body: { article } }) => {
        originalVotes = article.votes;
        return request(app)
          .patch("/api/articles/9")
          .send({ inc_votes: 1 })
          .expect(200);
      })
      .then(({ body: { article } }) => {
        expect(typeof article.votes).toBe("number");
        expect(article.votes).toBe(originalVotes + 1);
      });
  });

  test("200: update the number of article's votes and returns the updated article with the correct decrement vote count", () => {
    let originalVotes;

    return request(app)
      .get("/api/articles/1")
      .then(({ body: { article } }) => {
        originalVotes = article.votes;
        return request(app)
          .patch("/api/articles/1")
          .send({ inc_votes: -1 })
          .expect(200);
      })
      .then(({ body: { article } }) => {
        expect(typeof article.votes).toBe("number");
        expect(article.votes).toBe(originalVotes - 1);
      });
  });

  test("400: responds with an error if inc_votes is missing or not a number", () => {
    return request(app)
      .patch("/api/articles/2")
      .send({})
      .expect(400)
      .then(({ body }) => {
        expect(body.message).toBe("bad request");
      });
  });

  test("404: responds with an error if article id does not exist", () => {
    return request(app)
      .patch("/api/articles/9999")
      .send({ inc_votes: 1 })
      .expect(404)
      .then(({ body }) => {
        expect(body.message).toBe("not found");
      });
  });
});

describe("DELETE /api/comments/:comment_id", () => {
  test("204: Deletes a comment successfully", () => {
    return request(app)
      .post("/api/articles/1/comments")
      .send({
        username: "butter_bridge",
        body: "Hello, my friends",
      })
      .expect(201)
      .then(({ body: { comment } }) => {
        const commentId = comment.comment_id;
        return request(app)
          .delete(`/api/comments/${commentId}`)
          .expect(204)
          .then(() => {
            return request(app)
              .get("/api/articles/1/comments")
              .expect(200)
              .then(({ body: { comments } }) => {
                comments.forEach((comment) => {
                  if (comment.comment_id === commentId) {
                    found = true;
                  }
                });
              });
          });
      });
  });
});
