const nodemailer = require('nodemailer');

// Create email transporter with alternative config for Render
const createTransporter = () => {
    return nodemailer.createTransport({
        host: 'smtp.gmail.com',
        port: 465,
        secure: true, // use SSL
        auth: {
            user: process.env.EMAIL_USER,
            pass: process.env.EMAIL_PASS
        },
        tls: {
            rejectUnauthorized: false
        }
    });
};

// Send notification to business
async function sendBusinessNotification(contactData) {
    const transporter = createTransporter();

    const serviceTypes = {
        'heating-install': 'Heating Installation',
        'heating-repair': 'Heating Repair',
        'cooling-install': 'AC Installation',
        'cooling-repair': 'AC Repair',
        'maintenance': 'Maintenance Plan',
        'air-quality': 'Indoor Air Quality',
        'commercial': 'Commercial HVAC',
        'emergency': 'Emergency Service',
        'other': 'Other'
    };

    const serviceName = serviceTypes[contactData.service] || 'Not specified';

    const mailOptions = {
        from: process.env.EMAIL_USER,
        to: process.env.BUSINESS_EMAIL,
        subject: `New Contact Form Submission - ${serviceName}`,
        html: `
            <div style="font-family: Arial, sans-serif; max-width: 600px; margin: 0 auto;">
                <h2 style="color: #2563eb;">New Contact Form Submission</h2>
                <p>You have received a new inquiry from your website:</p>
                
                <div style="background: #f3f4f6; padding: 20px; border-radius: 8px; margin: 20px 0;">
                    <h3 style="margin-top: 0;">Customer Information</h3>
                    <p><strong>Name:</strong> ${contactData.name}</p>
                    <p><strong>Email:</strong> <a href="mailto:${contactData.email}">${contactData.email}</a></p>
                    <p><strong>Phone:</strong> <a href="tel:${contactData.phone}">${contactData.phone}</a></p>
                    <p><strong>Service Needed:</strong> ${serviceName}</p>
                </div>

                <div style="background: #fff; padding: 20px; border: 1px solid #e5e7eb; border-radius: 8px;">
                    <h3 style="margin-top: 0;">Message</h3>
                    <p style="white-space: pre-wrap;">${contactData.message}</p>
                </div>

                <p style="color: #6b7280; font-size: 14px; margin-top: 20px;">
                    Submitted on: ${new Date().toLocaleString('en-US', {
            dateStyle: 'full',
            timeStyle: 'short'
        })}
                </p>
            </div>
        `
    };

    try {
        await transporter.sendMail(mailOptions);
        console.log('Business notification sent successfully');
        return { success: true };
    } catch (error) {
        console.error('Error sending business notification:', error);
        throw error;
    }
}

// Send confirmation to customer
async function sendCustomerConfirmation(contactData) {
    const transporter = createTransporter();

    const mailOptions = {
        from: process.env.EMAIL_USER,
        to: contactData.email,
        subject: 'Thank You for Contacting Georgia Air and Heating LLC',
        html: `
            <div style="font-family: Arial, sans-serif; max-width: 600px; margin: 0 auto;">
                <div style="background: linear-gradient(135deg, #2563eb 0%, #7c3aed 100%); padding: 30px; text-align: center; border-radius: 8px 8px 0 0;">
                    <h1 style="color: white; margin: 0;">Georgia Air and Heating LLC</h1>
                </div>

                <div style="padding: 30px; background: #f9fafb; border-radius: 0 0 8px 8px;">
                    <h2 style="color: #1f2937;">Thank You for Reaching Out!</h2>
                    
                    <p>Dear ${contactData.name},</p>
                    
                    <p>We've received your inquiry and appreciate you considering Georgia Air and Heating LLC for your HVAC needs.</p>
                    
                    <div style="background: white; padding: 20px; border-left: 4px solid #2563eb; margin: 20px 0;">
                        <p style="margin: 0;"><strong>What happens next?</strong></p>
                        <p style="margin: 10px 0 0 0;">Our team will review your request and get back to you within 24 hours. For urgent matters, please call us directly at:</p>
                        <p style="margin: 10px 0 0 0; font-size: 18px; color: #2563eb;">
                            <strong>English: 770-376-7161</strong><br>
                            <strong>Español: 770-852-0216</strong>
                        </p>
                    </div>

                    <div style="background: #e5e7eb; padding: 15px; border-radius: 8px; margin: 20px 0;">
                        <h3 style="margin-top: 0; font-size: 16px;">Your Submission Details:</h3>
                        <p style="margin: 5px 0;"><strong>Service:</strong> ${contactData.service || 'Not specified'}</p>
                        <p style="margin: 5px 0;"><strong>Message:</strong> ${contactData.message.substring(0, 100)}${contactData.message.length > 100 ? '...' : ''}</p>
                    </div>

                    <p style="color: #6b7280; font-size: 14px;">
                        If you have any immediate questions, feel free to reply to this email or call us directly.
                    </p>

                    <p>Best regards,<br><strong>Georgia Air and Heating LLC Team</strong></p>
                </div>

                <div style="text-align: center; padding: 20px; color: #6b7280; font-size: 12px;">
                    <p>Georgia Air and Heating LLC | Serving Georgia since 2024</p>
                    <p>Email: georgiaairandheating@gmail.com | 24/7 Service Available</p>
                </div>
            </div>
        `
    };

    try {
        await transporter.sendMail(mailOptions);
        console.log('Customer confirmation sent successfully');
        return { success: true };
    } catch (error) {
        console.error('Error sending customer confirmation:', error);
        throw error;
    }
}

module.exports = {
    sendBusinessNotification,
    sendCustomerConfirmation
};
