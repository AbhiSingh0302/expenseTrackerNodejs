const path = require('path');
const Order = require('../models/order');
const User = require('../models/user');
const Expense = require('../models/expense');
const Razorpay = require('razorpay');
require('dotenv').config();

exports.getPremium = (req, res, next) => {
    console.log(req.headers.expenseid);
    try {
        console.log('hello premium', req.headers.expenseid);
        var instance = new Razorpay({
            key_id: process.env.key_id,
            key_secret: process.env.key_secret,
        });
        instance.orders.create({
            "amount": 2000,
            "currency": "INR"
        }, (err, order) => {
            if (err) {
                console.log('err in order: ',err);
                res.status(404).json(err);
            }
            else {
                console.log("order: ",order);
                Order.create({
                    order_id: order.id,
                    status: 'PENDING',
                    expenseId: req.headers.expenseid
                })
                    .then(data => {
                        console.log('data in Order: ',data);
                        res.json({
                            'order': data,
                            'rzpid': process.env.key_id
                        });
                    })
                    .catch(err => {
                        console.log('err in Order: ',err);
                        res.status(404).json(err);
                    })
            }
        })
    } catch (error) {
        console.log('catch error: ',error);
        res.status(404).json(error);
    }
}

exports.updatePayment = async (req, res, next) => {
    console.log('updatepayment',req.body);
    try {
        const transaction = req.body;
        if (transaction) {
            const order = await Order.findOne({
                where: {
                    order_id: transaction.razorpay_order_id
                }
            })
            await order.update({status: 'FAILED',purchase_id: transaction.razorpay_payment_id});
            const user = await User.findOne({
                where: {
                    id: order.expenseId
                }
            });
            if (transaction.razorpay_signature) {
                const updateOrder = order.update({status: 'SUCCESS',purchase_id: transaction.razorpay_payment_id});
                const updateUser = user.update({isPremium: true});
                const updateStatus = await Promise.all([
                    updateOrder,
                    updateUser
                ]);
                res.json({success: true, status: 'success'});
            }else{
                const updateOrderToF = await order.update({status: 'FAILED',purchase_id: transaction.razorpay_payment_id});
                res.json({success: true, status: 'failed'});
            }
        }else{
            throw new Error('Transaction not found');
        }
    } catch (error) {
        res.status(404).json({
            err: error
        })
    }
}

exports.showLeaderboard = async (req,res,next) => {
    try {
    const userAndExpense = await Promise.all([
        User.findAll(),
        Expense.findAll()
    ])
    const usersData = [];
    const expenseData = [...userAndExpense[1]];
    userAndExpense[0].forEach(element => {
        usersData.push({
            id: element.id,
            user: element.username,
            expenses: JSON.stringify(expenseData.filter(ele => {
                return ele.expenseId === element.id
            }))
        });
    });
    res.json(usersData);
} catch (error) {
     res.status(404).json(error);   
}
}