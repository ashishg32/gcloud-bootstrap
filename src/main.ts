import fetchSecrets from './lib/secrets';
import connectToDb from './services/db';
import startServer from './server';

require('dotenv').config({
    path: `./config/.env.${process.env.NODE_ENV || 'development'}`
});

const { GCP_PROJECT_ID } = process.env;

const main = async () => {
    try {
        if (!GCP_PROJECT_ID) {
            console.error('GCP_PROJECT_ID is missing from environment variables.');
            process.exit(1);
        }
        console.log('Fetching secrets...');
        await fetchSecrets(GCP_PROJECT_ID);
        console.log('Secrets fetched successfully.');

        console.log('Connecting to database...');
        await connectToDb();
        console.log('Database connection established.');

        console.log('Starting the server...');
        await startServer();
        console.log('Server started successfully.');
    } catch (error) {
        console.error('Error in main function:', error);
        process.exit(1);
    }
};

main();
