// backend/utils/emailService.js
const nodemailer = require('nodemailer');

// Log the environment variables (without exposing password)
console.log('Email configuration:', {
    host: process.env.EMAIL_HOST,
    port: process.env.EMAIL_PORT,
    secure: process.env.EMAIL_SECURE === 'true',
    user: process.env.EMAIL_USER ? '✓ Set' : '✗ Not set',
    pass: process.env.EMAIL_PASSWORD ? '✓ Set' : '✗ Not set',
    from: process.env.EMAIL_FROM
  });

// Create a transporter
const transporter = nodemailer.createTransport({
  host: process.env.EMAIL_HOST,
  port: process.env.EMAIL_PORT,
  secure: process.env.EMAIL_SECURE === 'true',
  auth: {
    user: process.env.EMAIL_USER,
    pass: process.env.EMAIL_PASSWORD,
  },
});

// Verify transporter configuration
transporter.verify(function(error, success) {
    if (error) {
      console.error('Nodemailer verification error:', error);
    } else {
      console.log('Nodemailer is ready to send messages');
    }
  });

// Send a welcome/confirmation email
exports.sendSubscriptionConfirmation = async (email, name = '') => {
  try {
    console.log(`Attempting to send email to ${email}...`);
    
    const mailOptions = {
      from: `"Spice & Tea Exchange" <${process.env.EMAIL_FROM}>`,
      to: email,
      subject: '✨ Welcome to Our Magical Tea Journey! ✨',
      html: `
        <div style="font-family: Arial, sans-serif; max-width: 600px; margin: 0 auto; padding: 20px; background-color: #fef8f5; border-radius: 10px;">
          <div style="text-align: center; margin-bottom: 20px;">
            <div style="background-color: #D6C0B3; width: 50px; height: 50px; border-radius: 50%; display: inline-flex; align-items: center; justify-content: center; margin-bottom: 10px;">
              <span style="color: #9F5255; font-weight: bold;">T&S</span>
            </div>
            <h1 style="color: #735557; margin: 10px 0;">Welcome to Our Magical Journey!</h1>
          </div>
          
          <p style="color: #4b5563; line-height: 1.6;">
            Dear ${name || 'Tea Enthusiast'},
          </p>
          
          <p style="color: #4b5563; line-height: 1.6;">
            Thank you for subscribing to our magical updates! You're now part of our enchanted circle of tea lovers who will receive exclusive offers, seasonal recipes, and tea wisdom directly to your inbox.
          </p>
          
          <div style="background-color: #f0e6e2; padding: 15px; border-radius: 8px; margin: 20px 0;">
            <p style="color: #734046; font-style: italic;">
              "Tea is like a warm hug in a cup, connecting us to the earth and to each other."
            </p>
          </div>
          
          <p style="color: #4b5563; line-height: 1.6;">
            Stay tuned for your first magical update coming soon! In the meantime, explore our <a href="${process.env.FRONTEND_URL}/products" style="color: #9B4444; text-decoration: none;">tea collection</a> and discover new flavors.
          </p>
          
          <div style="text-align: center; margin-top: 30px;">
            <a href="${process.env.FRONTEND_URL}" style="background: linear-gradient(45deg, #735557, #97866A); color: white; text-decoration: none; padding: 10px 20px; border-radius: 8px; font-weight: bold;">
              Visit Our Tea Shop ✨
            </a>
          </div>
          
          <div style="margin-top: 30px; padding-top: 20px; border-top: 1px solid #e2d5d0; font-size: 0.9em; color: #6b7280; text-align: center;">
            <p>
              If you didn't subscribe to our newsletter, please ignore this email or <a href="${process.env.FRONTEND_URL}/unsubscribe?email=${email}" style="color: #9B4444;">unsubscribe here</a>.
            </p>
            <p>
              &copy; ${new Date().getFullYear()} Spice & Tea Exchange. All rights reserved.
            </p>
          </div>
        </div>
      `
    };

    const info = await transporter.sendMail(mailOptions);
    console.log(`Subscription confirmation email sent to ${email}`);
    
    // For Mailtrap, log the message URL where you can view the sent email
    if (process.env.NODE_ENV === 'development') {
      console.log(`View the email at: https://mailtrap.io/inboxes`);
    }
    
    return true;
  } catch (error) {
    console.error('Error sending subscription confirmation email:', error);
    return false;
  }
};