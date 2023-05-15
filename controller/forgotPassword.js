const path = require('path');
const uuids = require('uuid');
const bcrypt = require('bcrypt');

const Sib = require('sib-api-v3-sdk');
require('dotenv').config();

const forgotpasswordrequests = require('../models/forgetpasswordrequests');

const User = require('../models/user');
const sequelize = require('../utils/database');

exports.forgotPassword = async (req, res, next) => {
    const t = await sequelize.transaction();    
    try {
        const {email} = req.body;
        // console.log(email)
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
                <p>
                There was a request to change your password!
                If you did not make this request then please ignore this email.
                Otherwise, please click this link to change your password: </p>
                <a href='http://65.2.186.16:3500/password/resetpassword/${id}' style="text-align: center; border: none;
                border-radius: 4px; padding: 5px 15px; background-color: blue; margin: 0px 45%; color: white; text-decoration: none;">Click Here</a>
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
    // console.log(forgetPassReq)
    if(forgetPassReq){
        res.sendFile(path.join(__dirname,'../','public','views','resetpassword.html'));
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
    // console.log('id:',id);
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