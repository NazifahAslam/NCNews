const endpointsJson = require("../endpoints.json");
const {
  allTopics,
  allArticles,
  allUsers,
  articleId,
  articleIdComments,
  insertComments,
  updateArticleVote,
  removeComment,
} = require("../models/api.models");

const fetchApi = (request, response) => {
  return response.status(200).send({ endpoints: endpointsJson });
};

const fetchTopics = (request, response) => {
  return allTopics()
    .then((rows) => {
      response.status(200).send({ topics: rows });
    })
    .catch((error) => {
      console.log(error);
    });
};

const fetchArticles = (request, response) => {
  return allArticles()
    .then((rows) => {
      response.status(200).send({ articles: rows });
    })
    .catch((error) => {
      console.log(error);
    });
};

const fetchUsers = (request, response) => {
  return allUsers()
    .then((rows) => {
      response.status(200).send({ users: rows });
    })
    .catch((error) => {
      console.log(error);
    });
};

const fetchArticleId = (request, response, next) => {
  const { article_id } = request.params;
  return articleId(article_id)
    .then((rows) => {
      response.status(200).send({ article: rows });
    })
    .catch((error) => {
      next(error);
    });
};

const fetchArticleIdComments = (request, response, next) => {
  const { article_id } = request.params;
  return articleIdComments(article_id)
    .then((comments) => {
      response.status(200).send({ comments: comments });
    })
    .catch((error) => {
      next(error);
    });
};

const postArticleComment = (request, response, next) => {
  const { article_id } = request.params;
  const { username, body } = request.body;

  if (!username || !body) {
    return response
      .status(400)
      .send({ message: "username and body are required" });
  }

  articleId(article_id)
    .then((rows) => {
      if (rows.length === 0) {
        return response.status(404).send({ message: "Article not found" });
      }

      return insertComments(username, body, article_id);
    })

    .then((comment) => {
      response.status(201).send({ comment });
    })
    .catch(next);
};

const patchArticleIdVote = (request, response, next) => {
  const { article_id } = request.params;
  const { inc_votes } = request.body;

  if (!inc_votes || typeof inc_votes !== "number") {
    return response.status(400).send({ message: "bad request" });
  }

  return updateArticleVote(article_id, inc_votes)
    .then((votes) => {
      if (!votes) {
        return response.status(404).send({ message: "not found" });
      }

      response.status(200).send({ article: votes });
    })
    .catch(next);
};

const deleteComment = (request, response, next) => {
  const { comment_id } = request.params;

  removeComment(comment_id)
    .then(({ rows }) => {
      if (rows.length === 0) {
        return response.status(404).send({ message: "not found" });
      }
      return response.sendStatus(204);
    })
    .catch(next);
};

module.exports = {
  fetchApi,
  fetchTopics,
  fetchArticles,
  fetchUsers,
  fetchArticleId,
  fetchArticleIdComments,
  postArticleComment,
  patchArticleIdVote,
  deleteComment,
};
