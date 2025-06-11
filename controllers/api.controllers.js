const endpointsJson = require('../endpoints.json');
const { topic_id, allArticles, user_info } = require('../models/api.models');

const fetchApi = (request, response) => {
  return response.status(200).send({ endpoints: endpointsJson });
};

const fetchTopics = (request, response) => {
  return topic_id()
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
  console.log('hello from controller');
  return user_info()
    .then((rows) => {
      response.status(200).send({ users: rows });
    })
    .catch((error) => {
      console.log(error);
    });
};

module.exports = { fetchApi, fetchTopics, fetchArticles, fetchUsers };
