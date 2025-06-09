const endpointsJson = require('../endpoints.json');
const { topic_id, allArticles } = require('../models/api.models');

const fetchApi = (request, response) => {
  return response.status(200).send({ endpoints: endpointsJson });
};

const fetchTopics = (request, response) => {
  console.log('hello from controller');
  return topic_id().then((rows) => {
    console.log(rows);
    response.status(200).send({ topics: rows });
  });
};

const fetchArticles = (request, response) => {
  console.log('hello from controller');
  return allArticles()
    .then((rows) => {
      response.status(200).send({ articles: rows });
    })
    .catch((error) => {
      console.log(error);
    });
};

module.exports = { fetchApi, fetchTopics, fetchArticles };
