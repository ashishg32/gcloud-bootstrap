import express from 'express';
import cookieParser from 'cookie-parser';

import healthCheckrouter from './routes/health-check';
require('dotenv').config({
    path: `./config/.env.${process.env.NODE_ENV || 'development'}`
});

const { PORT } = process.env;
const app = express();

app.use(express.json());
app.use(cookieParser());
app.use('/api/version', healthCheckrouter);

const startServer = async () => {
    try {
        const port = PORT || 9000;
        const server = app.listen(port, () => {
            console.log(`Server running on port ${port}`);
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

export default startServer;
