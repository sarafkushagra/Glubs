const express = require('express');
const router = express.Router();
const userController = require('../controllers/clubadmin');

router.get('/', userController.showAllClubAdmins);
router.get('/:id', userController.showClubAdmin);
router.post('/', userController.createClubAdmin);
router.put('/:id', userController.updateClubAdmin);
router.delete('/:id', userController.deleteClubAdmin);

module.exports = router;

