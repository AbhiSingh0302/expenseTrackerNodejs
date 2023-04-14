const jwt = require('jsonwebtoken');

exports.authorization = (req,res,next) => {
    const token = req.headers.token;
    console.log(token);
    jwt.verify(token,'12345',(err,data) => {
        if(err){
            return res.status(500).json({
                "message": "Authorization Failed"
            })
        }
        req.headers = {'expenseid': data.userId};
        next();
    })
}
