const mongoose = require('mongoose');

// MongoDB Schema
const contactSchema = new mongoose.Schema({
    name: { type: String, required: true },
    email: { type: String, required: true },
    phone: { type: String, required: true },
    service: { type: String, default: 'other' },
    message: { type: String, required: true },
    ipAddress: String,
    userAgent: String,
    createdAt: { type: Date, default: Date.now }
});

const Contact = mongoose.model('Contact', contactSchema);

// Connect to MongoDB
const connectDB = async () => {
    try {
        console.log('Attempting to connect to MongoDB...');
        console.log('MongoDB URI exists:', !!process.env.MONGODB_URI);

        if (!process.env.MONGODB_URI) {
            throw new Error('MONGODB_URI environment variable is not set');
        }

        const conn = await mongoose.connect(process.env.MONGODB_URI);
        console.log(`MongoDB Connected: ${conn.connection.host}`);
    } catch (error) {
        console.error(`MongoDB connection failed: ${error.message}`);
        console.error('CRITICAL: Database connection required for production');
        process.exit(1); // Exit if MongoDB fails in production
    }
};

// Insert contact
async function insertContact(contactData) {
    const contact = await Contact.create(contactData);
    return { id: contact._id };
}

// Get all contacts
async function getAllContacts() {
    return await Contact.find().sort({ createdAt: -1 });
}

module.exports = {
    connectDB,
    insertContact,
    getAllContacts,
    Contact
};
