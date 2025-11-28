const { createClient } = require('@supabase/supabase-js');
require('dotenv').config();

const supabaseUrl = process.env.SUPABASE_URL;
const supabaseKey = process.env.SUPABASE_KEY;

if (!supabaseUrl || !supabaseKey) {
    console.error('Error: SUPABASE_URL and SUPABASE_KEY are required in .env');
    process.exit(1);
}

const supabase = createClient(supabaseUrl, supabaseKey);

async function testConnection() {
    console.log('Testing Supabase connection...');

    // Try to insert a test record
    const testData = {
        name: 'Test User',
        email: 'test@example.com',
        phone: '1234567890',
        message: 'This is a test message from the verification script.',
        service: 'test-service'
    };

    const { data, error } = await supabase
        .from('contacts')
        .insert([testData])
        .select();

    if (error) {
        console.error('❌ Connection failed or table missing:', error.message);
        console.log('Did you run the SQL to create the "contacts" table?');
    } else {
        console.log('✅ Connection successful! Test record inserted.');
        console.log('Inserted ID:', data[0].id);

        // Clean up test data
        const { error: deleteError } = await supabase
            .from('contacts')
            .delete()
            .eq('id', data[0].id);

        if (deleteError) {
            console.log('Warning: Could not delete test record:', deleteError.message);
        } else {
            console.log('✅ Test record deleted.');
        }
    }
}

testConnection();
