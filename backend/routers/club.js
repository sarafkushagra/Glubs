const express = require('express');
const router = express.Router();
const clubController = require('../controllers/club');

router.get('/', clubController.showAllClubs);
router.post('/', clubController.createClub);
router.get('/:id', clubController.showClub);
router.put('/:id', clubController.updateClub);
router.delete('/:id', clubController.deleteClub);
router.get('/:id/members', clubController.showClubMembers);
router.get('/:id/events', clubController.showClubEvents);

module.exports = router;