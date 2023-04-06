const express = require('express');

const path = require('path');

const router = express.Router();
console.log(path.join(__dirname,'../','views'));
router.get('/login',(req,res,next) => {
    console.log("hello");
    res.sendFile(path.join(__dirname,'../','views','login.html'));
})

module.exports = router;