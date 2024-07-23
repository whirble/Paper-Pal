import { config } from 'dotenv';
import { neon, neonConfig } from '@neondatabase/serverless';
import { drizzle } from 'drizzle-orm/neon-http';

config(); // Load environment variables from .env file

neonConfig.fetchConnectionCache = true;

// Debugging statement
// console.log('DATABASE_URL:', process.env.DATABASE_URL);

// the problem was here in the error statement
if (!process.env.DATABASE_URL) {
    console.log('database url not found');
}

// Declare db variable
let db: any;

try {
    const sql = neon(process.env.DATABASE_URL || '');
    console.log('Successfully created SQL connection');
    db = drizzle(sql); // Assign value to db
} catch (error) {
    console.error('Error creating SQL connection');
}

export { db };
