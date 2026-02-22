import { getPayload } from 'payload'
import configPromise from '../payload.config'

async function main() {
    console.log("Initializing Payload to force DB sync...");
    try {
        const payload = await getPayload({
            config: configPromise
        });
        console.log("Payload DB synced successfully!");
        process.exit(0);
    } catch (err) {
        console.error("Error syncing DB:", err);
        process.exit(1);
    }
}
main();
