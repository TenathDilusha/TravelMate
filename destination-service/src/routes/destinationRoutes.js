const express = require('express');
const router = express.Router();
const destinationController = require('../controllers/destinationController');

router.get('/', destinationController.getDestinations);
router.get('/:id', destinationController.getDestination);
router.get('/health', destinationController.healthCheck);

module.exports = router;
