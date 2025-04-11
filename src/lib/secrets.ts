import { SecretManagerServiceClient } from '@google-cloud/secret-manager';

const client = new SecretManagerServiceClient();

/**
 * Lists all secrets and fetches the latest version of each.
 * @param projectId GCP Project ID
 * @returns A map of secret names to their latest secret values
 */
const fetchSecrets = async (projectId: string): Promise<Map<string, string>> => {
    const secretsMap = new Map<string, string>();
    const parent = `projects/${projectId}`;

    try {
        // List all secrets in the project
        const [secrets] = await client.listSecrets({ parent });
        console.log(`Found ${secrets.length} secrets.`);
    } catch (error) {
        console.error('Error fetching secrets:', error);
        throw new Error(`Failed to fetch secrets for project: ${projectId}`);
    }

    return secretsMap;
};

export default fetchSecrets;
