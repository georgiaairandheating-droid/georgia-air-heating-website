const { createClient } = require('@supabase/supabase-js');

// Initialize Supabase client
// These environment variables will be provided by the user
const supabaseUrl = process.env.SUPABASE_URL;
const supabaseKey = process.env.SUPABASE_KEY;

let supabase;

const connectDB = () => {
    if (!supabaseUrl || !supabaseKey) {
        console.error('Error: SUPABASE_URL and SUPABASE_KEY are required.');
        // We don't exit here to allow the server to start, but DB operations will fail
        return;
    }

    try {
        supabase = createClient(supabaseUrl, supabaseKey);
        console.log('Supabase client initialized');
    } catch (error) {
        console.error('Error initializing Supabase client:', error.message);
    }
};

// Insert contact submission
async function insertContact(contactData) {
    if (!supabase) {
        throw new Error('Database not connected. Missing Supabase credentials.');
    }

    const { data, error } = await supabase
        .from('contacts')
        .insert([
            {
                name: contactData.name,
                email: contactData.email,
                phone: contactData.phone,
                service: contactData.service,
                message: contactData.message,
                ip_address: contactData.ipAddress,
                user_agent: contactData.userAgent
            }
        ])
        .select();

    if (error) {
        throw new Error(`Supabase error: ${error.message}`);
    }

    return { id: data[0].id };
}

// Get all contacts
async function getAllContacts() {
    if (!supabase) {
        throw new Error('Database not connected');
    }

    const { data, error } = await supabase
        .from('contacts')
        .select('*')
        .order('created_at', { ascending: false });

    if (error) {
        throw new Error(`Supabase error: ${error.message}`);
    }

    return data;
}

// Check service status (keep-alive)
async function getServiceStatus() {
    if (!supabase) return false;

    try {
        // Simple query to keep DB awake
        const { count, error } = await supabase
            .from('contacts')
            .select('*', { count: 'exact', head: true });

        return !error;
    } catch (error) {
        return false;
    }
}

module.exports = {
    connectDB,
    insertContact,
    getAllContacts,
    getServiceStatus
};
