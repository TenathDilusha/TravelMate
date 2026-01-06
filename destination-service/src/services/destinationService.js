const destinations = require('../models/destinationModel');

const getAllDestinations = (query) => {
  let results = destinations;

  if (query.type) {
    results = results.filter(d => d.type.toLowerCase() === query.type.toLowerCase());
  }
  if (query.budget) {
    results = results.filter(d => d.budget.toLowerCase() === query.budget.toLowerCase());
  }

  return results;
};

const getDestinationById = (id) => {
  return destinations.find(d => d.id === id);
};

module.exports = { getAllDestinations, getDestinationById };
