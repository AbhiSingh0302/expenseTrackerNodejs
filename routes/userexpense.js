const express = require('express');

const path = require('path');

const expenseController = require('../controller/expense');

const router = express.Router();

router.post('/expense/user/:id',expenseController.expenseDelete);


router.get('/expense/all',expenseController.expenseAll);

router.post('/expense/create/:userId',expenseController.expenseCreate);

router.get('/expense',expenseController.expensePage);

module.exports = router;