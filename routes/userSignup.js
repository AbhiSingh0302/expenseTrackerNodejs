const express = require('express');

const path = require('path');

const router = express.Router();

console.log(path.resolve('index.html'))

router.post('/user/signup',(req,res,next) => {
    console.log(req.body);
})

module.exports = router;