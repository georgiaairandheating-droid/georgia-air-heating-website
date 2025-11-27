# HVAC Website Backend

Backend server for Georgia Air and Heating LLC website with contact form processing, email notifications, and database storage.

## Features

- ✅ Contact form API endpoint
- ✅ Email notifications (business + customer confirmation)
- ✅ SQLite database for storing submissions
- ✅ Input validation and sanitization
- ✅ Rate limiting (5 requests per 15 minutes)
- ✅ CORS protection
- ✅ Security headers with Helmet

## Prerequisites

- Node.js (v14 or higher)
- Gmail account for sending emails

## Setup Instructions

### 1. Install Dependencies

```bash
cd server
npm install
```

### 2. Configure Environment Variables

Create a `.env` file in the `server` directory:

```bash
cp .env.example .env
```

Edit `.env` and add your configuration:

```env
PORT=3000
EMAIL_USER=your-gmail@gmail.com
EMAIL_PASS=your-app-specific-password
BUSINESS_EMAIL=georgiaairandheating@gmail.com
NODE_ENV=development
FRONTEND_URL=http://localhost:8000
```

### 3. Set Up Gmail App Password

1. Go to your Google Account settings
2. Navigate to Security → 2-Step Verification
3. Scroll down to "App passwords"
4. Generate a new app password for "Mail"
5. Copy the 16-character password
6. Paste it as `EMAIL_PASS` in your `.env` file

**Important:** Use an app-specific password, NOT your regular Gmail password!

### 4. Start the Backend Server

```bash
npm start
```

Or for development with auto-reload:

```bash
npm run dev
```

The server will start on `http://localhost:3000`

### 5. Start the Frontend

In a separate terminal, from the `hvac-website` directory:

```bash
python3 -m http.server 8000
```

The frontend will be available at `http://localhost:8000`

## API Endpoints

### POST /api/contact
Submit a contact form

**Request Body:**
```json
{
  "name": "John Doe",
  "email": "john@example.com",
  "phone": "555-123-4567",
  "service": "heating-repair",
  "message": "I need help with my furnace"
}
```

**Response (Success):**
```json
{
  "success": true,
  "message": "Thank you for contacting us! We'll get back to you within 24 hours.",
  "contactId": 1
}
```

### GET /api/health
Check server status

**Response:**
```json
{
  "success": true,
  "message": "Server is running",
  "timestamp": "2024-01-01T12:00:00.000Z"
}
```

### GET /api/contact
Get all contact submissions (admin use)

**Response:**
```json
{
  "success": true,
  "count": 10,
  "contacts": [...]
}
```

## Database

The SQLite database file is automatically created at `server/data/contacts.db`

**Schema:**
- id (INTEGER PRIMARY KEY)
- name (TEXT)
- email (TEXT)
- phone (TEXT)
- service (TEXT)
- message (TEXT)
- created_at (DATETIME)
- ip_address (TEXT)
- user_agent (TEXT)

## Security Features

- **Rate Limiting**: 5 requests per 15 minutes per IP
- **CORS**: Only allows requests from configured frontend URL
- **Helmet**: Security headers
- **Input Validation**: Server-side validation with express-validator
- **Sanitization**: Prevents XSS attacks

## Testing

1. Open `http://localhost:8000/contact.html`
2. Fill out the contact form
3. Submit and check:
   - Form shows success message
   - Email sent to business email
   - Confirmation email sent to customer
   - Database entry created in `server/data/contacts.db`

## Troubleshooting

**Email not sending:**
- Verify Gmail app password is correct
- Check that 2-Step Verification is enabled
- Make sure EMAIL_USER and EMAIL_PASS are in .env file

**CORS errors:**
- Verify FRONTEND_URL in .env matches your frontend URL
- Check browser console for specific error messages

**Database errors:**
- Ensure `server/data` directory exists
- Check file permissions

## Production Deployment

For production deployment:

1. Set `NODE_ENV=production` in .env
2. Use a process manager like PM2
3. Set up proper domain and SSL
4. Update FRONTEND_URL to your production domain
5. Consider using a more robust database (PostgreSQL, MySQL)
6. Set up proper logging and monitoring

## File Structure

```
server/
├── config/
│   ├── database.js      # SQLite setup
│   └── email.js         # Nodemailer configuration
├── middleware/
│   └── validation.js    # Input validation
├── routes/
│   └── contact.js       # Contact form routes
├── data/
│   └── contacts.db      # SQLite database (auto-created)
├── server.js            # Main Express app
├── package.json         # Dependencies
├── .env                 # Environment variables (create this)
└── .env.example         # Environment template
```

## Support

For issues or questions, contact the development team.
