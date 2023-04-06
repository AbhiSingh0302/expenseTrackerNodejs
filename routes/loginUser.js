const express = require('express');

const path = require('path');

const bcrypt = require('bcrypt');

const User = require('../utils/database');

const router = express.Router();

console.log(path.resolve('index.html'))

router.post('/login/user', async (req, res, next) => {
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
    // if(user){
    //     if(loginPass == user.password){
    //         res.status(200).json({
    //             "message": "User successfully logged in",
    //             "data": user
    //         })
    //     }else{
            // res.status(401).json({
            //     "message": "Password is incorrect",
            // })
    //     }
    // }
    // else{
        // res.status(404).json({
        //     "message": "User not found",
        // })
    // }
})

module.exports = router;