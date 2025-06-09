const endpointsJson = require('../endpoints.json');
const { topic_id } = require('../models/api.models');

const fetchApi = (request, response) => {
  return response.status(200).send({ endpoints: endpointsJson });
};

const fetchTopics = (request, response) => {
  console.log('hello from controller');

  //why line 12 is affecting my test?:
  const { fetch_topic_id } = request.params;

  return topic_id(fetch_topic_id).then((rows) => {
    response.status(200).send({ topics: rows });
  });
};

module.exports = { fetchApi, fetchTopics };
