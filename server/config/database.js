const mongoose = require('mongoose');
const sqlite3 = require('sqlite3').verbose();
const path = require('path');

let dbType = 'sqlite'; // Default to SQLite
let sqliteDb;

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

// Connect to Database
const connectDB = async () => {
    // Check if we should use MongoDB (set USE_MONGODB=true in .env or production environment)
    if (process.env.USE_MONGODB === 'true' || process.env.NODE_ENV === 'production') {
        try {
            console.log('Attempting to connect to MongoDB...');
            const conn = await mongoose.connect(process.env.MONGODB_URI);
            console.log(`MongoDB Connected: ${conn.connection.host}`);
            dbType = 'mongodb';
            return;
        } catch (error) {
            console.error(`MongoDB connection failed: ${error.message}`);
            console.log('Falling back to SQLite...');
        }
    }

    // SQLite Setup (Fallback or Default)
    console.log('Using SQLite database');
    dbType = 'sqlite';
    const dbPath = path.join(__dirname, '..', 'data', 'contacts.db');

    sqliteDb = new sqlite3.Database(dbPath, (err) => {
        if (err) console.error('Error opening SQLite database:', err.message);
        else {
            console.log('Connected to SQLite database');
            initializeSqlite();
        }
    });
};

function initializeSqlite() {
    const query = `
        CREATE TABLE IF NOT EXISTS contacts (
            id INTEGER PRIMARY KEY AUTOINCREMENT,
            name TEXT NOT NULL,
            email TEXT NOT NULL,
            phone TEXT NOT NULL,
            service TEXT,
            message TEXT NOT NULL,
            created_at DATETIME DEFAULT CURRENT_TIMESTAMP,
            ip_address TEXT,
            user_agent TEXT
        )
    `;
    sqliteDb.run(query);
}

// Unified Insert Function
async function insertContact(contactData) {
    if (dbType === 'mongodb') {
        const contact = await Contact.create(contactData);
        return { id: contact._id };
    } else {
        return new Promise((resolve, reject) => {
            const query = `
                INSERT INTO contacts (name, email, phone, service, message, ip_address, user_agent)
                VALUES (?, ?, ?, ?, ?, ?, ?)
            `;
            const params = [
                contactData.name, contactData.email, contactData.phone,
                contactData.service, contactData.message,
                contactData.ipAddress, contactData.userAgent
            ];
            sqliteDb.run(query, params, function (err) {
                if (err) reject(err);
                else resolve({ id: this.lastID });
            });
        });
    }
}

// Unified Get All Function
async function getAllContacts() {
    if (dbType === 'mongodb') {
        return await Contact.find().sort({ createdAt: -1 });
    } else {
        return new Promise((resolve, reject) => {
            sqliteDb.all('SELECT * FROM contacts ORDER BY created_at DESC', [], (err, rows) => {
                if (err) reject(err);
                else resolve(rows);
            });
        });
    }
}

module.exports = {
    connectDB,
    insertContact,
    getAllContacts
};
