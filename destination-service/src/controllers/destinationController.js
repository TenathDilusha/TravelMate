const destinationService = require('../services/destinationService');

const getDestinations = (req, res) => {
  const results = destinationService.getAllDestinations(req.query);
  res.json(results);
};

const getDestination = (req, res) => {
  const dest = destinationService.getDestinationById(req.params.id);
  if (!dest) return res.status(404).json({ error: "Destination not found" });
  res.json(dest);
};

const healthCheck = (req, res) => {
  res.json({ status: "UP" });
};

module.exports = { getDestinations, getDestination, healthCheck };
