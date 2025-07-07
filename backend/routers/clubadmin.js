const express = require('express');
const router = express.Router();
const userController = require('../controllers/clubadmin');

router.get('/', userController.showAllClubAdmins);
router.get('/create', userController.showCreateClubAdminForm);
router.get('/view/:id', userController.showClubAdmin);
router.post('/', userController.createClubAdmin);
router.put('/:id', userController.updateClubAdmin);
router.delete('/:id', userController.deleteClubAdmin);

module.exports = router;

