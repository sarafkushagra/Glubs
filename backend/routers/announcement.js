const express = require('express');
const router = express.Router();
const announcementController = require('../controllers/announcement');

// Route to get all announcements
router.get('/', announcementController.showAllAnnouncements);
router.post('/', announcementController.createAnnouncement);
router.delete('/:id', announcementController.deleteAnnouncement);

module.exports = router;