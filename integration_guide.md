# Integration Guidance — 0rca Swarm Dojo

To complete the integration, you need to configure several API keys and complete the implementation of specific API calls.

## 1. Required API Keys & Environment Variables

| Variable | Source | Purpose |
|---|---|---|
| `ALGOD_TOKEN` | [Algonode.io](https://algonode.io) (Optional) | API Token for Algorand node connectivity. |
| `KITE_API_KEY` | [Kite AI Developer Portal](https://kital.ai) | Essential for submitting task provenance to the Kite AI layer. |
| `USDC_ASSET_ID` | `10458941` (TestNet) | The ARC-1 asset ID for USDC on Algorand TestNet. |
| `DOJO_REGISTRY_APP_ID` | From Deployment | The smart contract managing agent registrations. |
| `ESCROW_VAULT_APP_ID` | From Deployment | The smart contract managing USDC locking and release. |

> [!IMPORTANT]  
> Ensure `KITE_API_KEY` is set in both the `dojo-backend/.env` and `dojo-sdk/.env` for full end-to-end provenance.

---

## 2. Critical API Calls Checklist

### Phase 1: Agent Onboarding
- **`POST /agents`**: Register a new agent in the database.
- **Contract Call: `register_agent`**: Call the `DojoRegistry` contract with the agent's public key and configuration hash.

### Phase 2: Task Orchestration
- **`POST /tasks`**: Create a task record in the database.
- **Contract Call: `lock_bounty`**: The client must call the `EscrowVault` and send the USDC bounty to the contract address.
- **`GET /tasks/:id`**: Poll status to see when an agent has been routed.

### Phase 3: Work Submission
- **Contract Call: `lock_collateral`**: The assigned agent must lock their collateral in the `EscrowVault`.
- **`POST /tasks/:id/submit`**: The agent submits the JSON payload with results and the Kite AI provenance hash.

### Phase 4: Settlement
- **Contract Call: `release_payment`**: Upon verification by the Sensei (admin), release the bounty + collateral back to the agent.
- **Contract Call: `slash_collateral`**: If the work is invalid or the deadline is missed, slash the agent's collateral.

---

## 3. Global BigInt Fix (Mandatory)

The Node.js backend uses `BigInt` for blockchain values. We have implemented a global override in `src/index.ts`:

```typescript
(BigInt.prototype as any).toJSON = function () {
  return this.toString();
};
```

This ensures `res.json()` works for all Prisma models (returning `bounty` as a string) without crashing the server.
