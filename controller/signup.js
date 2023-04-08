const path = require('path');

const bcrypt = require('bcrypt');

const User = require('../models/user');

exports.signupPage = (req,res,next) => {
    res.sendFile(path.resolve('index.html'));
}

exports.userSignup = (req,res,next) => {
    console.log(req.body);
    const name = req.body.name;
    const email = req.body.email;
    const password = req.body.password;
    try {
        bcrypt.hash(password,10,(err,hashPass) => {
            console.log(err);
            User.create({
                username: name,
                email: email,
                password: hashPass
            }).then(result => {
                res.status(201).json(result)
            }).catch((error) => {
                res.status(405).json({
                    "message": 'User already exist'
                })
                console.error('Failed to create a new record : ', error);
            });
        })
        } catch (error) {
            res.status(405).json({
                "message": "Failed to create user"
            })
        }
    }