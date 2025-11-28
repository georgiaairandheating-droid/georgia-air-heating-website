const express = require('express');
const router = express.Router();
const { insertContact } = require('../config/database');
const { sendBusinessNotification, sendCustomerConfirmation } = require('../config/email');
const { contactValidationRules, validate } = require('../middleware/validation');

// POST /api/contact - Handle contact form submission
router.post('/', contactValidationRules, validate, async (req, res) => {
    try {
        const { name, email, phone, service, message } = req.body;

        // Prepare contact data
        const contactData = {
            name,
            email,
            phone,
            service,
            message,
            ipAddress: req.ip,
            userAgent: req.get('user-agent')
        };

        // Save to database
        const result = await insertContact(contactData);
        console.log(`New contact saved with ID: ${result.id}`);

        // Send emails (don't wait for them to complete)
        Promise.all([
            sendBusinessNotification(contactData),
            sendCustomerConfirmation(contactData)
        ]).catch(emailError => {
            console.error('Error sending emails:', emailError);
            // Don't fail the request if emails fail
        });

        // Return success response
        res.status(200).json({
            success: true,
            message: 'Thank you for contacting us! We\'ll get back to you within 24 hours.',
            contactId: result.id
        });

    } catch (error) {
        console.error('Error processing contact form:', error);
        res.status(500).json({
            success: false,
            message: 'Sorry, there was an error processing your request. Please try again or call us directly.'
        });
    }
});

// GET /api/contact - Get all contacts (optional admin endpoint)
router.get('/', async (req, res) => {
    try {
        const { getAllContacts } = require('../config/database');
        const contacts = await getAllContacts();

        res.status(200).json({
            success: true,
            count: contacts.length,
            contacts
        });
    } catch (error) {
        console.error('Error fetching contacts:', error);
        res.status(500).json({
            success: false,
            message: 'Error fetching contacts'
        });
    }
});

module.exports = router;
