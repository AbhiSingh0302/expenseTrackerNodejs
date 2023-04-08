const express = require('express');

const loginPageController = require('../controller/login');

const router = express.Router();

router.get('/login',loginPageController.loginPage);

router.post('/login/user',loginPageController.userLogin);

module.exports = router;