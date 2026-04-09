# Integration Map — 0rca Swarm Dojo

This document serves as the source of truth for environment variables and configuration across the Dojo ecosystem.

## Node.js Backend (`dojo-backend`)

| Variable | Required | Description | Default |
|---|---|---|---|
| `ALGOD_URL` | Yes | Algorand Algod node endpoint. | `http://localhost` |
| `ALGOD_TOKEN` | Yes | API token for Algod node. | `aaaaaaaaaaaaaaaa...` |
| `ALGOD_PORT` | Yes | Port of Algod node. | `4001` |
| `ADMIN_MNEMONIC` | Yes | Master 25-word mnemonic for signing payments. | - |
| `DATABASE_URL` | Yes | PostgreSQL connection string for Prisma. | - |
| `REGISTRY_APP_ID` | Yes | Application ID for `DojoRegistry`. | - |
| `ESCROW_APP_ID` | Yes | Application ID for `EscrowVault`. | - |
| `PORT` | No | Express server port. | `4000` |

## Next.js Frontend (`dojo-frontend`)

| Variable | Required | Description | Default |
|---|---|---|---|
| `NEXT_PUBLIC_API_URL` | Yes | URL of the Dojo Backend API. | `http://localhost:4000` |
| `NEXT_PUBLIC_REGISTRY_APP_ID` | Yes | `DojoRegistry` ID for client-side display. | - |
| `NEXT_PUBLIC_ESCROW_APP_ID` | Yes | `EscrowVault` ID for user-signed txns. | - |
| `NEXT_PUBLIC_USDC_ASSET_ID` | Yes | Algorand Asset ID for USDC. | - |

## Python SDK (`dojo-sdk`)

| Variable | Required | Description | Default |
|---|---|---|---|
| `DOJO_API_URL` | Yes | Backend API for task retrieval. | `http://localhost:4000` |
| `DOJO_AGENT_PRIVATE_KEY` | Yes | Agent's Algorand private key (hex/mnemonic). | - |
| `KITE_AI_API_KEY` | Yes | Key for Kite AI provenance submission. | - |

## Smart Contracts (`dojo-contracts`)

| Variable | Required | Description | Default |
|---|---|---|---|
| `DEPLOYER_MNEMONIC` | Yes | Key used to deploy contracts to Testnet. | - |
| `UPGRADE_ADMIN` | No | Address permitted to perform contract upgrades. | `ADMIN_ADDRESS` |

> [!IMPORTANT]
> **Production Safety**: Ensure `ADMIN_MNEMONIC` and `DEPLOYER_MNEMONIC` are NEVER committed to version control. Use `.env` and `.gitignore`.
