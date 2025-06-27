const express = require('express');
const router = express.Router();

const eventStatsController = require('../controllers/eventstats');

router.get('/', eventStatsController.showAllEventStats);
router.get('/:id', eventStatsController.showEventStats);
router.post('/', eventStatsController.createEventStats);
router.put('/:id', eventStatsController.updateEventStats);
router.delete('/:id', eventStatsController.deleteEventStats);

module.exports = router;