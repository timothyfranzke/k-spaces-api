
let mongo = require('mongodb');
let logging = require('../logging/logging.service');

export function sendEmail(message, callback){
    logging.INFO("Class : Message.Service , Method : sendEmail , AdditionData : { to : " + message.to + "}");

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

    try{
      logging.INFO("Class : Message.Service , Method : sendEmail , Message : sending email");
      transporter.sendMail(mailOptions, function(error, info){
        if (error) {
          console.log(error);
          callback(error);
        }
        callback(null, info);
      });
    }
    catch(exception)
    {
      logging.ERROR(exception, "Class : Message.Service , Method : sendEmail , Message : failed to send email");
      callback(exception, null);
    }

};
