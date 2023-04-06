const express = require('express');

const path = require('path');

const router = express.Router();

console.log(path.resolve('index.html'))

router.get('/',(req,res,next) => {
    res.sendFile(path.resolve('index.html'));
})

module.exports = router;