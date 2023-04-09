const path = require('path');

const expense = require('../models/expense');

exports.expensePage = (req,res,next) => {
    console.log('expense page');
    res.sendFile(path.join(__dirname,'../','views','expense.html'));
}

exports.expenseAll = (req,res,next) => {
    console.log(req.headers.expenseid);
    try {
        expense.findAll({
            where:{
                'expenseId': req.headers.expenseid
            }
        })
        .then(exp => {
            res.status(201).json(exp)
        })
        .catch((error) => {
            console.error('Failed to create a new record : ', error);
            throw new Error('Something is not right');
        });
    } catch (error) {
        res.status(404).json(error);
    }
}

exports.expenseCreate = (req,res,next) => {
    console.log("login/expense: ",req.body);
    console.log(req.params.userId);
    try {
        expense.create({
            'amount': req.body.amount,
            'description': req.body.description,
            'category': req.body.category,
            'expenseId': req.params.userId
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
}

exports.expenseDelete = async (req,res,next) => {
    try {
        console.log(req.params);
        const id = req.params.id;
        const exp = await expense.findByPk(id);
        if(exp){
            await exp.destroy();
            res.status(201).json(req.params)
        }else{
            throw new Error('Something went wrong');
        }
    } catch (error) {
        res.json(error);
    }
}