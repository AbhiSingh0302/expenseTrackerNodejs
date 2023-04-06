const express = require('express');

const path = require('path');

const expense = require('../utils/expenses');

const router = express.Router();

router.post('/login/expense',(req,res,next) => {
    console.log("login/expense: ",req.body);
    try {
        expense.create({
            'amount': req.body.amount,
            'description': req.body.description,
            'category': req.body.category
        })
        .then(exp => {
            res.status(201).json(exp)
        })
        .catch((error) => {
            res.status(405).json({
                "message": 'User already exist'
            })
            console.error('Failed to create a new record : ', error);
        });
    } catch (error) {
        res.status(404).json(error);
    }
})

module.exports = router;