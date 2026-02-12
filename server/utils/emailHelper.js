const nodemailer = require('nodemailer');

const sendCredentialsEmail = async (studentEmail, studentName, rollNumber, password) => {
    try {
        const transporter = nodemailer.createTransport({
            service: 'gmail',
            auth: {
                user: process.env.EMAIL_USER,
                pass: process.env.EMAIL_PASS,
            },
        });

        const mailOptions = {
            from: `"Exam Management System" <${process.env.EMAIL_USER}>`,
            to: studentEmail,
            subject: 'Your Exam Portal Credentials',
            html: `
        <div style="font-family: Arial, sans-serif; max-width: 600px; margin: 0 auto; padding: 20px; border: 1px solid #e0e0e0; border-radius: 10px;">
          <h2 style="color: #6366f1; text-align: center;">Welcome to the Exam Portal</h2>
          <p>Hello <strong>${studentName}</strong>,</p>
          <p>Your account has been successfully created by the Admin. You can now log in using the following credentials:</p>
          
          <div style="background-color: #f8fafc; padding: 15px; border-radius: 8px; margin: 20px 0; border: 1px solid #e2e8f0;">
            <p style="margin: 5px 0;"><strong>Roll Number / User ID:</strong> ${rollNumber}</p>
            <p style="margin: 5px 0;"><strong>Password:</strong> ${password}</p>
          </div>
          
          <p>Please change your password after your first login for security reasons.</p>
          
          <div style="text-align: center; margin-top: 30px;">
            <a href="http://localhost:5173/login" style="background-color: #6366f1; color: white; padding: 12px 24px; text-decoration: none; border-radius: 5px; font-weight: bold;">Login to Dashboard</a>
          </div>
          
          <hr style="margin-top: 30px; border: 0; border-top: 1px solid #eee;" />
          <p style="font-size: 12px; color: #64748b; text-align: center;">This is an automated email. Please do not reply.</p>
        </div>
      `,
        };

        await transporter.sendMail(mailOptions);
        console.log(`Credentials email sent to ${studentEmail}`);
    } catch (error) {
        console.error('Error sending email:', error);
        // We don't throw here to avoid failing the signup process if email fails
    }
};

module.exports = { sendCredentialsEmail };
