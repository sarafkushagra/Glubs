const express = require('express');
const router = express.Router();
const notificationController = require('../controllers/notification');


router.get('/:userId', notificationController.showAllNotifications);
router.post('/', notificationController.createNotification);
router.put('/:id', notificationController.updateNotification);
router.delete('/:id', notificationController.deleteNotification);

module.exports = router;