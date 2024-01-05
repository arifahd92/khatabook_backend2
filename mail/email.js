const nodemailer = require('nodemailer');

let mailTransporter = nodemailer.createTransport({
	service: 'gmail',
	auth: {
		user: 'arifahd92@gmail.com',
		pass: process.env.GMAIL_APP_PASSWORD
	}
});
function sendEmail(acc,msg){

    let mailDetails = {
        from: 'arifahd92@gmail.com',
        to: acc,
        subject: 'Test mail',
        text:msg
    };
    mailTransporter.sendMail(mailDetails, function(err, data) {
        if(err) {
            console.log(err);
        } else {
            console.log('Email sent successfully');
        }
    });
}

module.exports={sendEmail}
