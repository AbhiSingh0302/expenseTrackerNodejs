const express = require('express');

const signUpRouter = require('../controller/signup');

const router = express.Router();

router.post('/signup',signUpRouter.userSignup);

router.get('/',signUpRouter.signupPage);

module.exports = router;