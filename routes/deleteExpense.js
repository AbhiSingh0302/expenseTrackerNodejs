const express = require('express');

const path = require('path');

const expense = require('../utils/expenses');

const router = express.Router();

router.post('/login/expense/:id',(req,res,next) => {
    try {
        expense.findOne({
            where:{
                id: req.params.id
            }
        })
        .then(exp => {
            exp.destroy();
            res.status(201).json(exp)
        })
        .catch((error) => {
            console.error('Failed to create a new record : ', error);
            throw new Error('Something is not right');
        });
    } catch (error) {
        res.status(404).json(error);
    }
})

module.exports = router;