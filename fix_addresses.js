const { PrismaClient } = require('@prisma/client');
const crypto = require('crypto');
const fs = require('fs');
const path = require('path');

const prisma = new PrismaClient();

async function main() {
    const vaultKeyHex = process.env.VAULT_KEY;
    if (!vaultKeyHex || vaultKeyHex.length !== 64) {
        console.error('VAULT_KEY not set or invalid. Set it in .env');
        process.exit(1);
    }

    const vaultDir = path.join(process.cwd(), '../dojo-agents/vault');
    const agents = await prisma.agent.findMany();
    
    let fixed = 0;
    let skipped = 0;
    let failed = 0;

    for (const agent of agents) {
        if (agent.address.length === 58) {
            console.log(`[SKIP] ${agent.id} — already has valid address: ${agent.address.substring(0, 10)}...`);
            skipped++;
            continue;
        }

        const vaultPath = path.join(vaultDir, `${agent.id}.enc`);
        if (!fs.existsSync(vaultPath)) {
            console.log(`[WARN] ${agent.id} — no vault file found at ${vaultPath}`);
            failed++;
            continue;
        }

        try {
            const encryptedBlob = fs.readFileSync(vaultPath, 'utf8');
            const buf = Buffer.from(encryptedBlob, 'base64');
            const nonce = buf.subarray(0, 12);
            const authTag = buf.subarray(buf.length - 16);
            const ciphertext = buf.subarray(12, buf.length - 16);

            const vaultKey = Buffer.from(vaultKeyHex, 'hex');
            const salt = Buffer.from('0rca_swarm_dojo_salt');
            const derivedKey = crypto.pbkdf2Sync(vaultKey, salt, 100000, 32, 'sha256');

            const decipher = crypto.createDecipheriv('aes-256-gcm', derivedKey, nonce);
            decipher.setAuthTag(authTag);
            
            const decrypted = Buffer.concat([
                decipher.update(ciphertext),
                decipher.final()
            ]);

            const config = JSON.parse(decrypted.toString('utf8'));
            const realAddress = config.agent_address;

            if (!realAddress || realAddress.length !== 58) {
                console.log(`[WARN] ${agent.id} — decrypted but address is invalid in vault: ${realAddress}`);
                failed++;
                continue;
            }

            await prisma.agent.update({
                where: { id: agent.id },
                data: { address: realAddress }
            });

            // Verify update
            const updatedAgent = await prisma.agent.findUnique({ where: { id: agent.id } });
            if (updatedAgent.address === realAddress) {
                console.log(`[FIXED] ${agent.id} — address updated to ${realAddress}`);
                fixed++;
            } else {
                console.log(`[ERROR] ${agent.id} — DB update failed to persist! Current: ${updatedAgent.address}`);
                failed++;
            }
        } catch (err) {
            console.log(`[ERROR] ${agent.id} — decryption failed: ${err.message}`);
            failed++;
        }
    }

    console.log(`\nDone! Fixed: ${fixed}, Skipped: ${skipped}, Failed: ${failed}`);
    process.exit(0);
}

main();
