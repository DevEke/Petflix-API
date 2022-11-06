var nodemailer = require('nodemailer');
let Users = require('../../models/User.jsx').User;
let crypto = require('crypto');
const { body, validationResult } = require('express-validator');

const transporter = nodemailer.createTransport({
    port: 465,
    host: "smtp.gmail.com",
    auth: {
        user: 'chriseke13@gmail.com',
        pass: 'fcqjbpavpkefceki',
        secure: true,
    }
})

const randomNumber = () => {
    var min = 100000;
    var max = 999999;
    return Math.floor(Math
      .random() * (max - min + 1)) + min;
  }


module.exports = (router) => {
    router.put('/forgot-password',
    body('email').isEmail().withMessage('Please enter a valid email address.'),
     (req, res) => {
        res.header("Access-Control-Allow-Origin", "*");
        const errors = validationResult(req);
        if (!errors.isEmpty()) {
            res.status(400).send({message: 'Please check your credentials.', status: 'fail', errors: errors})
        }
        let verificationCode = randomNumber();  
        Users.findOneAndUpdate({email: req.body.email}, {
            $set: {
                resetCode: verificationCode
            }
        }, {new: true})
        .then(user => {
            const mailData = {
                from: 'chriseke13@gmail.com',
                to: req.body.email,
                subject: 'Password Reset Verification Code',
                text: 'Here is the verification code to reset your password',
                html: `<div>
                        <h5>Here is your verification code</h5>
                        <h1>${verificationCode}</h1>
                        </div>`
            }
            transporter.sendMail(mailData, (err, info) => {
                if (err) {
                    return console.log(err)
                }
                res.status(200).send({message: "If an account exists for you, an email will be sent to you with a verification code. Enter it below to reset your password.", status: 'success', message_id: info.messageId})
            });
        })
        .catch(err => { res.status(500).send({message: 'Error sending email', status: 'fail', error: err})})
    })

    router.put('/reset-forgot-password',
    body('password').isLength({min: 5}).withMessage('Password must be at least 5 characterss long.'),
    body('confirm').custom((value, {req}) => {
        if (value !== req.body.password) {
            throw new Error('Make sure your confirmation matches your password.')
        }
        return true;
    }),
     (req, res) => {
        res.header("Access-Control-Allow-Origin", "*");
        const errors = validationResult(req);
        if (!errors.isEmpty()) {
             return res.status(400).send({message: 'Please check your credentials.', status: 'fail', errors: errors})
        }
        Users.findOne({email: req.body.email})
        .then(user => {
            if (req.body.code === user.resetCode) {
                const salt = crypto.randomBytes(16).toString('hex');
                const hash = crypto.pbkdf2Sync(req.body.password, salt, 1000, 64, 'sha512').toString('hex')
                Users.findOneAndUpdate({ _id: user._id}, {
                    $set: {
                        hash: hash,
                        salt: salt,
                        resetCode: ''
                    }
                }, { new: true})
                .then(user => {
                     return res.status(200).send({
                        message: 'Password was successfully reset. Please login to your account.',
                        status: 'success'
                    })
                })
                .catch(err => {
                     return res.status(500).send({message: 'There was a problem finding your account.', status:'fail', error: err})
                })
            } else {
                 return res.status(500).send({message: 'Your verification code is incorrect. Please try again.', status: 'fail'})
            }
        })
        .catch(err=> {
            console.error(err);
             return res.status(500).send({message: 'There was a problem finding a user with that email address', status: 'fail', error: err})
        })
    })

}


