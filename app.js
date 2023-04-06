const express = require('express');

const bodyParser = require('body-parser');

const path = require('path');

const signUpRouter = require('./routes/signup');

const userSignUp = require('./routes/userSignup');

const app = express();

app.use(bodyParser.json());

app.use(userSignUp);

app.use(signUpRouter);

app.listen(3600);
