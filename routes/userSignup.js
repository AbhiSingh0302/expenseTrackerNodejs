const express = require('express');

const path = require('path');

const User = require('../utils/database');

const router = express.Router();

console.log(path.resolve('index.html'))

router.post('/user/signup',(req,res,next) => {
    console.log(req.body);
    const name = req.body.name;
    const email = req.body.email;
    const password = req.body.password;
    try {
        User.create({
            username: name,
            email: email,
            password: password
        }).then(result => {
            res.status(201).json(result)
        }).catch((error) => {
            res.status(405).json({
                "message": "Failed to create user"
            })
            console.error('Failed to create a new record : ', error);
        });
    } catch (error) {
        res.status(405).json({
            "message": "Failed to create user"
        })
    }
})

module.exports = router;