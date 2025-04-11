import express from 'express';
import cookieParser from 'cookie-parser';

import healthCheckrouter from './routes/health-check';
import fetchSecrets from './lib/secrets';

require('dotenv').config({
    path: `./config/.env.${process.env.NODE_ENV || 'development'}`
});

const {
    PORT,
    GCP_PROJECT_ID
} = process.env;

if (!GCP_PROJECT_ID) {
    console.error('GCP_PROJECT_ID is missing from environment variables.');
    process.exit(1);
}

const app = express();

app.use(express.json());
app.use(cookieParser());
app.use('/api/version', healthCheckrouter);

const startServer = async () => {
    try {
        const server = app.listen(PORT, () => {
            console.log(`Server running on port ${PORT}`);
        });

        const shutdown = async (signal: string) => {
            console.log(`Received ${signal}. Closing server...`);
            server.close(() => {
                console.log('Server closed.');
                process.exit(0);
            });
        };

        process.on('SIGINT', () => shutdown('SIGINT'));
        process.on('SIGTERM', () => shutdown('SIGTERM'));

    } catch (error) {
        console.error('Failed to connect to the database:', error);
        process.exit(1);
    }
};

const main = async () => {
    try {
        await fetchSecrets(GCP_PROJECT_ID);
        console.log('Secrets fetched successfully.');
        if (process.env.DATABASE_URL) {
            console.log('DATABASE_URL is set:', process.env.DATABASE_URL);
        } else {
            console.error('DATABASE_URL is not set!');
            process.exit(1);
        }
        await startServer();
        console.log('Server started successfully.');
    } catch (error) {
        console.error(' Error in main function:', error);
        process.exit(1);
    }
};

main();
