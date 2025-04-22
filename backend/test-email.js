// test-email.js
require('dotenv').config();
const nodemailer = require('nodemailer');

async function testEmail() {
  // Create a transporter object using the default SMTP transport
  const transporter = nodemailer.createTransport({
    host: 'sandbox.smtp.mailtrap.io',
    port: 2525,
    secure: false,
    auth: {
      user: 'bccccfcbb26214',
      pass: '17a45d2ac81ee0'
    }
  });

  try {
    // Send mail with defined transport object
    const info = await transporter.sendMail({
      from: '"Test Sender" <from@example.com>',
      to: 'recipient@example.com',
      subject: 'Test Email',
      text: 'This is a test email from Nodemailer',
      html: '<b>This is a test email from Nodemailer</b>'
    });

    console.log('Message sent: %s', info.messageId);
    console.log('Preview URL: %s', nodemailer.getTestMessageUrl(info));
    console.log('Full info:', info);
  } catch (error) {
    console.error('Error sending email:', error);
  }
}

testEmail();