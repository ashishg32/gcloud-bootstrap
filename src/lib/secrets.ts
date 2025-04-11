import { SecretManagerServiceClient } from '@google-cloud/secret-manager';
import path from 'path';

const fetchSecrets = async (projectId: string): Promise<Map<string, string>> => {
    const secretsMap = new Map<string, string>();
    const NODE_ENV = process.env.NODE_ENV || 'development';

    try {
        const client = new SecretManagerServiceClient({
            keyFilename: path.join(__dirname, '../../key.json'),
        });

        const parent = `projects/${projectId}`;
        const [secrets] = await client.listSecrets({ parent });
        console.log(`Found ${secrets.length} secrets.`);

        for (const secret of secrets) {
            const secretFullName = secret.name;
            if (!secretFullName) continue;

            const parts = secretFullName.split('/');
            const secretName = parts[parts.length - 1];

            console.log(`Fetching latest version of: ${secretName}`);

            try {
                const [version] = await client.accessSecretVersion({
                    name: `${secretFullName}/versions/latest`,
                });
                const payload = (version.payload?.data as Buffer)?.toString('utf8') || '';
                console.log(`Secret loaded: ${secretName}`);
                secretsMap.set(secretName, payload);
                if (secretName === 'DATABASE_URLS') {
                    const dbUrls = JSON.parse(payload);
                    const selectedDbUrl = dbUrls[NODE_ENV];
                    if (!selectedDbUrl) {
                        throw new Error(`No DATABASE_URL found for NODE_ENV="${NODE_ENV}"`);
                    }
                    process.env.DATABASE_URL = selectedDbUrl;
                    console.log(`Set process.env.DATABASE_URL for ${NODE_ENV}`);
                } else {
                    process.env[secretName] = payload;
                    console.log(`Set process.env.${secretName}`);
                }
            } catch (err: any) {
                console.warn(`Failed to fetch secret '${secretName}':`, err.message);
            }
        }
    } catch (error) {
        console.error('Error fetching secrets:', error);
        throw new Error(`Failed to fetch secrets for project: ${projectId}`);
    }
    return secretsMap;
};

export default fetchSecrets;
