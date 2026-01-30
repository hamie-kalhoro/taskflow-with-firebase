const functions = require('firebase-functions');
const admin = require('firebase-admin');
const sgMail = require('@sendgrid/mail');

admin.initializeApp();

// Initialize SendGrid with API Key
// Note: In production, use Firebase Secrets: firebase functions:secrets:set SENDGRID_API_KEY
const SENDGRID_API_KEY = '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';
sgMail.setApiKey(SENDGRID_API_KEY);

exports.sendWelcomeEmail = functions.auth.user().onCreate(async (user) => {
    const email = user.email;
    const displayName = user.displayName || email.split('@')[0];

    const msg = {
        to: email,
        from: 'neo.abraham@zohomail.com', // Must be verified in SendGrid
        subject: 'Welcome to TaskFlow! 🎯',
        html: `
      <div style="font-family: 'Segoe UI', Tahoma, Geneva, Verdana, sans-serif; max-width: 600px; margin: 0 auto; padding: 20px; color: #1a1a1a; background-color: #f9f9f9;">
        <div style="background: linear-gradient(135deg, #F97316, #EA580C); padding: 30px; border-radius: 12px 12px 0 0; text-align: center;">
          <h1 style="color: white; margin: 0; font-size: 28px;">Welcome to TaskFlow!</h1>
        </div>
        
        <div style="background-color: white; padding: 40px; border-radius: 0 0 12px 12px; box-shadow: 0 4px 6px rgba(0,0,0,0.05);">
          <h2 style="color: #1a1a1a; margin-top: 0;">Hi ${displayName},</h2>
          <p style="font-size: 16px; line-height: 1.6; color: #444;">
            We're thrilled to have you join our community of organized high-achievers! TaskFlow is designed to help you streamline your day and hit your goals faster.
          </p>
          
          <div style="text-align: center; margin: 40px 0;">
            <a href="https://taskmanager-by-hmd.web.app/dashboard" 
               style="background: linear-gradient(135deg, #F97316, #EA580C); color: white; padding: 16px 32px; text-decoration: none; border-radius: 8px; font-weight: bold; font-size: 18px; display: inline-block; box-shadow: 0 4px 12px rgba(249, 115, 22, 0.3);">
              Go to Dashboard →
            </a>
          </div>
          
          <p style="font-size: 14px; color: #666; font-style: italic;">
            Tip: You can start by creating your first task using the "Add Task" button in the sidebar.
          </p>
          
          <hr style="border: 0; border-top: 1px solid #eee; margin: 30px 0;">
          
          <p style="font-size: 14px; color: #888;">
            Best Regards,<br>
            <strong>The TaskFlow Team</strong>
          </p>
        </div>
        
        <div style="text-align: center; margin-top: 20px; color: #aaa; font-size: 12px;">
          © 2026 TaskFlow. All rights reserved.
        </div>
      </div>
    `,
    };

    try {
        await sgMail.send(msg);
        console.log('Welcome email sent to:', email);
    } catch (error) {
        console.error('Error sending welcome email:', error);
        if (error.response) {
            console.error(error.response.body);
        }
    }
});
