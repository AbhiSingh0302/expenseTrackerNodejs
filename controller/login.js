const path = require('path');

const bcrypt = require('bcrypt');

const jwt = require('jsonwebtoken');

const User = require('../models/user');

function generateWebTokens(id){
    return jwt.sign({userId: id},"12345");
}

exports.loginPage = (req,res,next) => {
    res.sendFile(path.join(__dirname,'../','views','login.html'));
}

exports.userLogin = async (req, res, next) => {
    console.log(req.body);
    try {
        const loginEmail = req.body.email;
        const loginPass = req.body.password;
        const user = await User.findOne({
            where: {
                email: loginEmail
            }
        })

        if (user) {
            bcrypt.compare(loginPass, user.password, (err, result) => {
                if (err) {
                    throw new Error(err);
                }
                else {
                    if (result) {
                        res.status(200).json({
                            "message": "User successfully logged in",
                            "token": generateWebTokens(user.id)
                        })
                        console.log('hellow');
                    }
                    else{
                        res.status(401).json({
                            "message": "Password is incorrect",
                        })
                    }
                }
            })
        }
        else{
            res.status(404).json({
                "message": "User not found",
            })
        }

    } catch (error) {
        res.status(404).json({
            "message": error
        })
    }
}