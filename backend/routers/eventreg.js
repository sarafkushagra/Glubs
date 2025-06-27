const express = require('express');
const router = express.Router();

const eventRegController = require('../controllers/eventreg');

router.get('/', eventRegController.showAllEventRegistrations);
router.get('/:id', eventRegController.showEventRegistration);      
router.post('/', eventRegController.createEventRegistration);
router.put('/:id', eventRegController.updateEventRegistration);
router.delete('/:id', eventRegController.deleteEventRegistration);

module.exports = router;