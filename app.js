const express = require('express');

const bodyParser = require('body-parser');

const cors = require('cors');

const signUpRouter = require('./routes/signup');

const loginRouter = require('./routes/login');

const expenseUserRouter = require('./routes/userexpense');

const sequelize = require('./utils/database');

const app = express();

app.use(cors());

app.use(bodyParser.json());

app.use(signUpRouter);

app.use(expenseUserRouter);

app.use(expenseUserRouter);

app.use(expenseUserRouter);

app.use(expenseUserRouter);

app.use(loginRouter);

app.use(loginRouter);

app.use(signUpRouter);

sequelize.sync()
.then(() =>{
    app.listen(3600);
})
.catch((err) => {
    console.log(err);
})
