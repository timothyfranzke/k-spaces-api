
let mongo = require('mongodb');

export function sendEmail(message, callback){
    var nodemailer = require('nodemailer');
    let smtpConfig = {
        host: 'seagull.arvixe.com',
        port: 465,
        secure: true, // upgrade later with STARTTLS
        auth: {
            user: 'sparrow@franzkedesigner.com',
            pass: 'dfg123'
        }
    };
    let mailOptions = {
        from: 'no-reply@k-spaces.com',
        to: message.to, // list of receivers
        replyTo: 'timothyfranzke@gmail.com',
        subject: message.subject, // Subject line
        html: message.body// html body
    };
    let transporter = nodemailer.createTransport(smtpConfig);

// send mail with defined transport object
    transporter.sendMail(mailOptions, function(error, info){
        if (error) {
            console.log(error);
            callback(error);
        }
        callback(null, info);
    });
};