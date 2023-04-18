const path = require('path');
const uuids = require('uuid');
const bcrypt = require('bcrypt');

const Sib = require('sib-api-v3-sdk');
require('dotenv').config();

const forgotpasswordrequests = require('../models/forgetpasswordrequests');

const User = require('../models/user');
const sequelize = require('../utils/database');

exports.forgotPassword = async (req, res, next) => {
    try {
        const t = await sequelize.transaction();    
        const {email} = req.body;
        const user = await User.findOne({
            where:{
                email: email
            },
            transaction: t  
        })
            const id = uuids.v4()
            const forgotPassReq = await forgotpasswordrequests.create({
                id: id,
                isActive: true,
                expenseId: user.id
            },{
                transaction: t
            })
            await t.commit();
            const client = Sib.ApiClient.instance;
            const apiKey = client.authentications['api-key'];
            apiKey.apiKey = process.env.API_KEY;
            const tranEmailApi = new Sib.TransactionalEmailsApi();
            const sender = {
                email: 'abhimanyusingh0302@gmail.com'
            }
            const receivers = [
                {
                    email: email
                }
            ]
            const sendMail = await tranEmailApi.sendTransacEmail({
                sender,
                to: receivers,
                subject: 'Regarding forgot password request',
                htmlContent: `
                <h1 style="text-align: center;">Reset Password</h1>
                <a href='http://localhost:3500/password/resetpassword/${id}'>Click Here</a>
                `
            })
            if(sendMail){
                res.json(sendMail);
            }else{
                throw new Error('Not Sent');
            }
    } catch (error) {
        await t.rollback();
        res.status(404).json(error);
    }
}

exports.resetPassword = async(req,res,next) => {
    try {
    const {id} = req.params;
    if(!id){
        throw new Error('Invalid id');
    }
    const forgetPassReq = await forgotpasswordrequests.findOne({
        where: {
            id: id,
            isActive: true
        }
    })
    console.log(forgetPassReq)
    if(forgetPassReq){
        res.redirect('/login')
        // res.sendFile(path.join(__dirname,'../','views','resetpassword.html'));
    }else{
        throw new Error('Something is not right');
    }    
} catch (error) {
    res.send('<h1 style="text-align: center; margin-top: 4rem;">Requests Denied</h1>')   
}
}

exports.changePassword = async(req,res,next) => {
    try {
    const {password} = req.body;
    const {id} = req.headers;
    console.log('id:',id);
    if(!id){
        throw new Error('Invalid id')
    }
    const forgotPassId = await forgotpasswordrequests.findOne({
        where: {
            id: id
        }
    })
    await forgotPassId.update({
        isActive: false
    })
    const id2 = forgotPassId.expenseId;
    const user = await User.findOne({
        where:id2
    });
    const encryptPass = await bcrypt.hash(password, 10);
    user.update({
        password: encryptPass
    })
    res.json({
        success: true,
        message: 'password changed',
        data: forgotPassId
    });
} catch (error) {
        res.status(404).json({
            'error':error
        });
}
}