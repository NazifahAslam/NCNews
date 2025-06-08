const { topic_id } = require('../models/api.models');
const endpointsJson = require('../endpoints.json');

const fetchApi = (request, response) => {
  console.log('controller!!!');
  return response.status(200).send({ endpoints: endpointsJson });
};

module.exports = { fetchApi };
