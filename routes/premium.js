const express = require('express');

const PremiumController = require('../controller/premium');

const expenseMiddleware = require('../middleware/auth');

const router = express.Router();

router.get('/get-premium',expenseMiddleware.authorization,PremiumController.getPremium);

module.exports = router;