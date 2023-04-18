const express = require('express');

const forgotPasswordController = require('../controller/forgotPassword');

const router = express.Router();

router.post('/password/forgotpassword',forgotPasswordController.forgotPassword);

router.get('/password/resetpassword/:id',forgotPasswordController.resetPassword);

router.post('/password/changepassword',forgotPasswordController.changePassword);

module.exports = router;