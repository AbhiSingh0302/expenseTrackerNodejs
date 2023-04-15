const path = require('path');
const User = require('../models/user');
const expense = require('../models/expense');
const user = require('../models/user');

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
            let sum=0;
            exp.forEach(element => {
                sum += element.amount
            });
            User.findOne({
                where:{
                    id: req.headers.expenseid
                }
            })
            .then((user) => {
                user.update({
                    total_cost: sum
                })
                if(user.isPremium){
                    res.status(201).json({
                        'isPremium': true,
                        'result': exp
                    })
                }else{
                    res.status(201).json({
                        'isPremium': false,
                        'result': exp
                    })
                }
            })
            .catch(err => {
                throw new Error('Something is not right',err);
            })
        })
        .catch((error) => {
            console.error('Failed to create a new record : ', error);
            throw new Error('Something is not right');
        });
    } catch (error) {
        res.status(404).json(error);
    }
}

exports.expenseCreate = async (req,res,next) => {
    try {
        const userWithExpense = await Promise.all([
            expense.create({
                'amount': req.body.amount,
                'description': req.body.description,
                'category': req.body.category,
                'expenseId': req.headers.expenseid
            }),
            User.findOne({
                where:{
                    id: req.headers.expenseid
                }
            })
        ])
        const addUserExp = userWithExpense[0].amount;
        const previousTotalExp = userWithExpense[1].total_cost;
        await userWithExpense[1].update({
            total_cost: previousTotalExp + +addUserExp
        })
        res.status(201).json(userWithExpense[0])
    } catch (error) {
        res.status(404).json({
            "message": 'Not added, sorry for inconvenience'
        });
    }
}

exports.expenseDelete = async (req,res,next) => {
    try {
        const id = req.params.id;
        const exp = await expense.findByPk(id);
        const UserExp = await user.findByPk(exp.expenseId);;
        const deleteUserExp = UserExp.total_cost - exp.amount;
        await UserExp.update({
            total_cost: deleteUserExp
        })
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