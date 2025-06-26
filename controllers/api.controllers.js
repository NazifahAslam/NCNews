const endpointsJson = require('../endpoints.json');
const {
  allTopics,
  allArticles,
  allUsers,
  articleId,
  articleIdComments,
} = require('../models/api.models');

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

module.exports = {
  fetchApi,
  fetchTopics,
  fetchArticles,
  fetchUsers,
  fetchArticleId,
  fetchArticleIdComments,
};
