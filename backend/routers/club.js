const express = require('express');
const router = express.Router();
const clubController = require('../controllers/club');

const { isAuthenticated, restrictTo } = require("../middlewares/auth");

router.get('/', clubController.showAllClubs);
router.post('/', isAuthenticated, restrictTo(["club-admin", "admin"]) ,clubController.createClub);
router.get('/:id',isAuthenticated, clubController.showClub);
router.put('/:id',isAuthenticated, restrictTo(["club-admin", "admin"]), clubController.updateClub);
router.delete('/:id',isAuthenticated, restrictTo(["club-admin", "admin"]) ,clubController.deleteClub);
router.get('/:id/members',isAuthenticated, restrictTo(["club-admin", "admin"]), clubController.showClubMembers);
router.get('/:clubId/events',isAuthenticated, clubController.showClubEvents);

module.exports = router;