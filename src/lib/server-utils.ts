import 'server-only'; // Ensures this code never runs on the client
import { SecretManagerServiceClient } from '@google-cloud/secret-manager';
import { cache } from 'react';
// Initialize the client
const secretManagerClient = new SecretManagerServiceClient();
// The full resource name of your secret
const secretName = 'projects/1846938519/secrets/GOOGLE_MAPS_API_KEY/versions/latest';
// Use React's cache to ensure we only fetch the secret once per request.
export const getGoogleMapsApiKey = cache(async () => {
try {
const [version] = await secretManagerClient.accessSecretVersion({
name: secretName,
});

const apiKey = version.payload?.data?.toString();
if (!apiKey) {
  throw new Error('Secret payload is empty.');
}

console.log('[SERVER LOG] Successfully fetched API key from Secret Manager.');
return apiKey;

} catch (error) {
    console.error('[SERVER LOG] FAILED to fetch API key from Secret Manager:', error);
    // Return null or an empty string so the app doesn't crash,
    // even though Maps will fail to load.
    return null;
    }
    });