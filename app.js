const express = require('express');

const bodyParser = require('body-parser');

const cors = require('cors');

const signUpRouter = require('./routes/signup');

const loginRouter = require('./routes/login');

const expenseUserRouter = require('./routes/userexpense');

const User = require('./models/user');

const Expense = require('./models/expense');

const sequelize = require('./utils/database');

const app = express();

app.use(cors());

app.use(bodyParser.json());

app.use(signUpRouter);

Expense.belongsTo(User);
User.hasMany(Expense);

app.use(expenseUserRouter);

app.use(expenseUserRouter);

app.use(expenseUserRouter);

app.use(expenseUserRouter);

app.use(loginRouter);

app.use(loginRouter);

app.use(signUpRouter);

sequelize.sync({force: true})
.then(() =>{
    app.listen(3600);
})
.catch((err) => {
    console.log(err);
})
