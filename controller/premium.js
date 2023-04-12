const path = require('path');
const Order = require('../models/order');
const Razorpay = require('razorpay');
require('dotenv').config();
console.log(process.env.key_id);

exports.getPremium = (req,res,next) => {
    try {     
        console.log('hello premium',req.headers.expenseid);
        var instance = new Razorpay({
            key_id: process.env.key_id,
            key_secret: process.env.key_secret,
        });
        instance.orders.create({
            "amount": 2000,
            "currency": "INR"
        },(err,order) => {
            if(err){
                res.json({
                    "error": err
                });
            }
            else{
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