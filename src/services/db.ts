import { Pool } from 'pg';

const connectToDb = async (): Promise<Pool> => {
    // Ensure DATABASE_URL is set before trying to connect to the DB
    if (!process.env.DATABASE_URL) {
        console.error('DATABASE_URL is not set!');
        process.exit(1);
    } else {
        console.log('DATABASE_URL is set:', process.env.DATABASE_URL);
    }

    const pool = new Pool({
        connectionString: process.env.DATABASE_URL,
    });

    try {
        await pool.connect();
        console.log('Connected to PostgreSQL via DATABASE_URL');
        return pool;
    } catch (err) {
        console.error('Error on PostgreSQL client:', err);
        process.exit(-1);
    }
};

export default connectToDb;
