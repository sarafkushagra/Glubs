const express = require('express');
const router = express.Router();

const eventStatsController = require('../controllers/eventstats');

router.get('/eventstat', eventStatsController.showAllEventStats);
router.get('/eventstat/:id', eventStatsController.showEventStats);
router.post('/eventstat', eventStatsController.createEventStats);
router.put('/eventstat/:id', eventStatsController.updateEventStats);
router.delete('/eventstat/:id', eventStatsController.deleteEventStats);

module.exports = router;