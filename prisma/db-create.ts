import dotenv from 'dotenv';
import path from 'path';
import { execSync } from 'child_process';

const env = process.env.NODE_ENV || 'development';

dotenv.config({ path: path.resolve(__dirname, `../config/.env.${env}`) });

console.log('Creating and migrating the database...');

try {
    execSync('npx prisma migrate deploy', { stdio: 'inherit' });
    console.log('Database created and migrations applied successfully.');
} catch (error) {
    console.error('Error creating or migrating the database:', error);
    process.exit(1);
}
