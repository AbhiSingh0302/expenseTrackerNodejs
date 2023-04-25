const path = require('path');
const AWS = require('aws-sdk');
const User = require('../models/user');
const expense = require('../models/expense');
const user = require('../models/user');
const sequelize = require('../utils/database');

const uploadToS3 = async (data, filename) => {
    try {
        const BUCKET_NAME = 'expensetrackernew';
        const IAM_USER_KEY = 'AKIA4BYCLIP54HLWCHHM';
        const IAM_USER_SECRET = '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';
        let s3bucket = new AWS.S3({
            accessKeyId: IAM_USER_KEY,
            secretAccessKey: IAM_USER_SECRET,
        })
        var params = {
            Bucket: BUCKET_NAME,
            Key: filename,
            Body: data
        }
        s3bucket.upload(params,(err, s3response) => {
            if (err) {
                console.log('Something went wrong', err);
            } else {
                console.log('success ', s3response);
            }
        })

    } catch (error) {
        console.log(error);
    }
}

exports.download = async (req, res) => {
    try {
        const expns = await User.findAll();
        if (expns) {
            const expnstostring = JSON.stringify(expns);
            const filename = 'Expense.txt';
            const fileURL = uploadToS3(expnstostring, filename);
        }
    } catch (error) {
res.json(error);
    }
}

exports.expensePage = (req, res, next) => {
    console.log('expense page');
    res.sendFile(path.join(__dirname, '../', 'views', 'expense.html'));
}

exports.expenseAll = (req, res, next) => {
    console.log(req.headers.expenseid);
    try {
        expense.findAll({
            where: {
                'expenseId': req.headers.expenseid
            }
        })
            .then(exp => {
                let sum = 0;
                exp.forEach(element => {
                    sum += element.amount
                });
                User.findOne({
                    where: {
                        id: req.headers.expenseid
                    }
                })
                    .then((user) => {
                        user.update({
                            total_cost: sum
                        })
                        if (user.isPremium) {
                            res.status(201).json({
                                'isPremium': true,
                                'result': exp
                            })
                        } else {
                            res.status(201).json({
                                'isPremium': false,
                                'result': exp
                            })
                        }
                    })
                    .catch(err => {
                        throw new Error('Something is not right', err);
                    })
            })
            .catch((error) => {
                console.error('Failed to create a new record : ', error);
                throw new Error('Something is not right');
            });
    } catch (error) {
        res.status(404).json(error);
    }
}

exports.expenseCreate = async (req, res, next) => {
    try {
        const t = await sequelize.transaction();
        const userWithExpense = await Promise.all([
            expense.create({
                'amount': req.body.amount,
                'description': req.body.description,
                'category': req.body.category,
                'expenseId': req.headers.expenseid
            },
                {
                    transaction: t
                }),
            User.findOne({
                where: {
                    id: req.headers.expenseid
                },
                transaction: t
            })
        ])
        await t.commit();
        const addUserExp = userWithExpense[0].amount;
        const previousTotalExp = userWithExpense[1].total_cost;
        await userWithExpense[1].update({
            total_cost: previousTotalExp + +addUserExp
        })
        res.status(201).json(userWithExpense[0])
    } catch (error) {
        await t.rollback();
        res.status(404).json({
            "message": 'Not added, sorry for inconvenience'
        });
    }
}

exports.expenseDelete = async (req, res, next) => {
    try {
        const t = await sequelize.transaction();
        const id = req.params.id;
        const exp = await expense.findByPk(id, { transaction: t });
        const UserExp = await user.findByPk(exp.expenseId, { transaction: t });
        await t.commit();
        const deleteUserExp = UserExp.total_cost - exp.amount;
        await UserExp.update({
            total_cost: deleteUserExp
        })
        if (exp) {
            await exp.destroy();
            res.status(201).json(req.params)
        } else {
            throw new Error('Something went wrong');
        }
    } catch (error) {
        await t.rollback();
        res.json(error);
    }
}