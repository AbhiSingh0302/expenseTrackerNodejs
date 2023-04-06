const express = require('express');

const bodyParser = require('body-parser');

const path = require('path');

const signUpRouter = require('./routes/signup');

const userSignUp = require('./routes/userSignup');

const loginRouter = require('./routes/login');

const app = express();

app.use(bodyParser.json());

app.use(userSignUp);

app.use(loginRouter);

app.use(signUpRouter);

app.listen(3600);
