const express = require('express');

const bodyParser = require('body-parser');

const path = require('path');

const cors = require('cors');

const signUpRouter = require('./routes/signup');

const userSignUp = require('./routes/userSignup');

const loginRouter = require('./routes/login');

const loginUserRouter = require('./routes/loginUser');

const expenseRouter = require('./routes/expense');

const allExpenseRouter = require('./routes/allExpense');

const deleteExpenseRouter = require('./routes/deleteExpense');

const app = express();

app.use(cors());

app.use(bodyParser.json());

app.use(userSignUp);

app.use(deleteExpenseRouter);

app.use(allExpenseRouter);

app.use(expenseRouter);

app.use(loginUserRouter);

app.use(loginRouter);

app.use(signUpRouter);

app.listen(3600);
