const { body, validationResult } = require('express-validator');

// Validation rules for contact form
const contactValidationRules = [
    body('name')
        .trim()
        .notEmpty().withMessage('Name is required')
        .isLength({ min: 2, max: 100 }).withMessage('Name must be between 2 and 100 characters')
        .matches(/^[a-zA-Z\s'-]+$/).withMessage('Name can only contain letters, spaces, hyphens, and apostrophes'),

    body('email')
        .trim()
        .notEmpty().withMessage('Email is required')
        .isEmail().withMessage('Please provide a valid email address')
        .normalizeEmail(),

    body('phone')
        .trim()
        .notEmpty().withMessage('Phone number is required')
        .matches(/^[\d\s\-\(\)\+]+$/).withMessage('Please provide a valid phone number')
        .isLength({ min: 10, max: 20 }).withMessage('Phone number must be between 10 and 20 characters'),

    body('service')
        .optional()
        .trim()
        .isIn(['heating-install', 'heating-repair', 'cooling-install', 'cooling-repair', 'maintenance', 'air-quality', 'commercial', 'emergency', 'other', ''])
        .withMessage('Invalid service type'),

    body('message')
        .trim()
        .notEmpty().withMessage('Message is required')
        .isLength({ min: 10, max: 1000 }).withMessage('Message must be between 10 and 1000 characters')
];

// Middleware to check validation results
const validate = (req, res, next) => {
    const errors = validationResult(req);

    if (!errors.isEmpty()) {
        return res.status(400).json({
            success: false,
            errors: errors.array().map(err => ({
                field: err.path,
                message: err.msg
            }))
        });
    }

    next();
};

module.exports = {
    contactValidationRules,
    validate
};
