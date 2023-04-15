const express = require('express');

const PremiumController = require('../controller/premium');

const premiumMiddleware = require('../middleware/auth');

const router = express.Router();

router.get('/get-premium',premiumMiddleware.authorization,PremiumController.getPremium);

router.post('/get-premium/payment',PremiumController.updatePayment);

router.get('/premium/show-leaderboard',premiumMiddleware.authorization,PremiumController.showLeaderboard);

module.exports = router;