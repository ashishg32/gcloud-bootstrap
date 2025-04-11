import express from 'express';
import cookieParser from 'cookie-parser';

import prisma from './prisma';
import userRouter from './routes/user';
import fetchSecrets from './lib/secrets';

require('dotenv').config({
    path: `./config/.env.${process.env.NODE_ENV || 'development'}`
});

const {
    PORT,
    GCP_PROJECT_ID
} = process.env;

if (!GCP_PROJECT_ID) {
    console.error('❌ GCP_PROJECT_ID is missing from environment variables.');
    process.exit(1);  // Exit the process if GCP_PROJECT_ID is required
}

const app = express();

app.use(express.json());
app.use(cookieParser());
app.use('/api/users', userRouter);

const startServer = async () => {
    try {
        await prisma.$connect();
        console.log('Database connected successfully');

        const server = app.listen(PORT, () => {
            console.log(`Server running on port ${PORT}`);
        });

        const shutdown = async (signal: string) => {
            console.log(`Received ${signal}. Closing server...`);
            await prisma.$disconnect();
            server.close(() => {
                console.log('Server closed.');
                process.exit(0);
            });
        };

        process.on('SIGINT', () => shutdown('SIGINT'));
        process.on('SIGTERM', () => shutdown('SIGTERM'));

    } catch (error) {
        console.error('❌ Failed to connect to the database:', error);
        process.exit(1);
    }
};

const main = async () => {
    try {
        // Ensure the secrets are fetched with a valid project ID
        await fetchSecrets(GCP_PROJECT_ID);
        await startServer();
    } catch (error) {
        console.error('❌ Error in main function:', error);
        process.exit(1);  // Exit if something goes wrong
    }
};

main().catch(console.error);
