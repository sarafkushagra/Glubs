const express = require('express');
const router = express.Router();
const userController = require('../controllers/clubadmin');

router.get('/clubadmins', userController.showAllClubAdmins);
router.get('/clubadmins/:id', userController.showClubAdmin);
router.post('/clubadmins', userController.createClubAdmin);
router.put('/clubadmins/:id', userController.updateClubAdmin);
router.delete('/clubadmins/:id', userController.deleteClubAdmin);

module.exports = router;

