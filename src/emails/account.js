const sgMail = require('@sendgrid/mail')

sgMail.setApiKey(process.env.SENDGRID_API_KEY)
senderEmail = process.env.SENDER_EMAIL

const sendWelcomeEmail = (email, name) => {
    sgMail.send({
        to: email,
        from: senderEmail,
        subject: 'Welcome to my Task App',
        text: `Hey again ${name} ;)`
    })
}

const sendCancelationEmail = (email, name) => {
    sgMail.send({
        to: email, 
        from: senderEmail,
        subject: 'Good luck in your future',
        text: `It was a pleasure with you ${name}!`
    })
}

module.exports = {
    sendWelcomeEmail,
    sendCancelationEmail
}