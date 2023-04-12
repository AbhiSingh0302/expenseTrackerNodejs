const path = require('path');
const Order = require('../models/order');
const User = require('../models/user');
const Razorpay = require('razorpay');
require('dotenv').config();

exports.getPremium = (req, res, next) => {
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
                res.json({
                    "error": err
                });
            }
            else {
                console.log(order);
                Order.create({
                    order_id: order.id,
                    status: 'PENDING',
                    expenseId: req.headers.expenseid
                })
                    .then(data => {
                        res.json(data);
                    })
                    .catch(err => {
                        console.log(err);
                    })
            }
        })
    } catch (error) {
        res.status(404).json(error);
    }
}

exports.updatePayment = async (req, res, next) => {
    console.log('updatepayment');
    try {
        const transaction = req.body;
        if (transaction) {
            const order = await Order.findOne({
                where: {
                    order_id: transaction.razorpay_order_id
                }
            })
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
            }else{
                const updateOrderToF = await order.update({status: 'FAILED',purchase_id: transaction.razorpay_payment_id});
            }
        }else{
            throw new Error('Transaction not found');
        }
    } catch (error) {
        res.status(404).json(error)
    }
}