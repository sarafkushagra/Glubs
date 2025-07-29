const express = require('express');
const router = express.Router();
const { verifyQR } = require('../controllers/qrController');

router.post('/verify-qr', verifyQR);

module.exports = router;
