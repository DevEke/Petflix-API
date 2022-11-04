var nodemailer = require('nodemailer');
let Users = require('../../models/User.jsx').User;
let crypto = require('crypto');

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
    router.put('/forgot-password', (req, res) => { 
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

    router.put('/reset-forgot-password', (req, res) => {
        Users.findOne({email: req.body.email})
        .then(user => {
            if (req.body.verification === user.resetCode) {
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
                    res.status(200).send({
                        message: 'Password was successfully reset. Please login to your account.',
                        status: 'success'
                    })
                })
                .catch(err => {
                    res.status(500).send({message: 'There was a problem finding your account.', status:'fail', error: err})
                })
            } else {
                res.status(500).send({message: 'Your verification code is incorrect. Please try again.', status: 'fail'})
            }
        })
        .catch(err=> {
            console.error(err);
            res.status(500).send({message: 'There was a problem finding a user with that email address', status: 'fail', error: err})
        })
    })

}


