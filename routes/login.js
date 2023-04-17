const express = require('express');

const loginPageController = require('../controller/login');

const router = express.Router();

router.get('/login',loginPageController.loginPage);

router.post('/login/user',loginPageController.userLogin);

router.post('/password/forgotpassword',loginPageController.forgotPassword);

module.exports = router;