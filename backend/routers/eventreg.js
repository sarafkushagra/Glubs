const express = require('express');
const router = express.Router();

const eventRegController = require('../controllers/eventreg');

router.get('/eventreg', eventRegController.showAllEventRegistrations);
router.get('/eventreg/:id', eventRegController.showEventRegistration);      
router.post('/eventreg', eventRegController.createEventRegistration);
router.put('/eventreg/:id', eventRegController.updateEventRegistration);
router.delete('/eventreg/:id', eventRegController.deleteEventRegistration);

module.exports = router;