const path = require('path');

const bcrypt = require('bcrypt');

const User = require('../models/user');

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
                            "data": user
                        })
                        console.log('hellow');
                        // return res.redirect('/expense/useri');
                        // return res.redirect('/login/expense');
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