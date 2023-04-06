const express = require('express');

const path = require('path');

const router = express.Router();

router.get('/login',(req,res,next) => {
    res.sendFile(path.join(__dirname,'../','views','login.html'));
})

module.exports = router;