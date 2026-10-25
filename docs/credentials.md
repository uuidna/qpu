# Prize Organization Credentials Setup

**Configure API access for autonomous prize claiming**

---

## Overview

The autonomous executor needs credentials to submit solutions and claim prizes from 4 major platforms. Each requires different authentication methods.

---

## 1. Bounties.network

**Platform**: Bounties for cryptographic solutions  
**Prize Value**: $100K × 3 RSA factorizations = $300K  
**Verification Time**: 7 days

### Setup

1. Create account at https://bounties.network
2. Generate API key from account settings
3. Prepare Ethereum wallet for crypto payments

### Environment Variables

```bash
export BOUNTIES_API_KEY="your-api-key-from-bounties"
export BOUNTIES_WALLET="0xYourEthereumAddress"
```

### API Reference

- **Submit**: `POST /v2/fulfillments/create`
  - Body: `{ issueId, fulfillmentText, dataJson, fulfiller }`
  - Header: `Authorization: Bearer $BOUNTIES_API_KEY`

- **Check Status**: `GET /v2/fulfillments/{id}`
  - Header: `Authorization: Bearer $BOUNTIES_API_KEY`
  - Response: `{ fulfillmentId, accepted, fulfiller }`

- **Claim**: `POST /v2/issues/{issueId}/claim`
  - Body: `{ fulfillmentId, claimant }`
  - Returns: Transaction hash and amount

---

## 2. Kaggle

**Platform**: Optimization competitions  
**Prize Value**: $50K × 4 competitions = $200K  
**Verification Time**: 14 days

### Setup

1. Create account at https://www.kaggle.com
2. Go to Settings → API → Create New API Token
3. This downloads `kaggle.json` with credentials

### Environment Variables

```bash
export KAGGLE_USERNAME="your_kaggle_username"
export KAGGLE_API_KEY="your_kaggle_api_key"
```

### API Reference

- **Submit**: `POST /competitions/{competitionId}/submissions`
  - Body: CSV file with solution data
  - Auth: Basic auth with `$KAGGLE_USERNAME:$KAGGLE_API_KEY`

- **Check Status**: `GET /competitions/submissions/{ref}`
  - Auth: Basic auth
  - Response: `{ publicScore, isAfter }`

- **Claim**: `POST /competitions/submissions/{ref}/award`
  - Auth: Basic auth
  - Returns: Award amount and ID

---

## 3. HackerOne

**Platform**: Security vulnerability bounties  
**Prize Value**: $25K  
**Verification Time**: 5 days

### Setup

1. Create researcher account at https://hackerone.com
2. Go to Settings → API Tokens → Create Token
3. Note your program handle (e.g., "quantum-security-program")

### Environment Variables

```bash
export HACKERONE_API_KEY="your-h1-api-token"
export HACKERONE_PROGRAM="your-program-handle"
```

### API Reference

- **Submit**: `POST /v1/reports`
  - Body: JSON with vulnerability details
  - Header: `Authorization: Bearer $HACKERONE_API_KEY`
  - Response: `{ data: { id } }`

- **Check Status**: `GET /v1/reports/{id}`
  - Header: `Authorization: Bearer $HACKERONE_API_KEY`
  - Response: `{ data: { attributes: { state } } }`
  - States: "new", "triaged", "needs-more-info", "not-applicable", "informative", "resolved", "bounty_awarded"

- **Claim**: `POST /v1/reports/{id}/bounty_claim`
  - Header: `Authorization: Bearer $HACKERONE_API_KEY`
  - Returns: Bounty amount and claim ID

---

## 4. InnoCentive

**Platform**: Scientific and technical challenges  
**Prize Value**: $250K  
**Verification Time**: 21 days

### Setup

1. Create solver profile at https://www.innocentive.com
2. Go to Account → API Access → Generate Token
3. Note your solver email

### Environment Variables

```bash
export INNOCENTIVE_API_KEY="your-innocentive-api-key"
export INNOCENTIVE_EMAIL="your-solver-email@example.com"
```

### API Reference

- **Submit**: `POST /v1/submissions`
  - Body: JSON with technical paper (base64), proof, validation details
  - Header: `Authorization: Bearer $INNOCENTIVE_API_KEY`
  - Response: `{ submissionId, challengeId }`

- **Check Status**: `GET /v1/submissions/{id}`
  - Header: `Authorization: Bearer $INNOCENTIVE_API_KEY`
  - Response: `{ status, evaluation: { approved } }`
  - Status: "submitted", "under_review", "approved", "rejected"

- **Claim**: `POST /v1/submissions/{id}/award`
  - Header: `Authorization: Bearer $INNOCENTIVE_API_KEY`
  - Body: `{ awardType: "monetary", amount: 250000 }`
  - Returns: Award ID and amount

---

## Installation

1. **Copy template**:
   ```bash
   cp .env.example .env
   ```

2. **Fill credentials**:
   ```bash
   # Edit .env with your API keys and credentials
   nano .env
   ```

3. **Load environment**:
   ```bash
   source .env
   ```

4. **Verify setup**:
   ```bash
   npm run credentials:check
   ```

---

## Security Notes

⚠️ **Never commit `.env` file to git**
- `.env` is in `.gitignore`
- Keep credentials private
- Use different credentials per environment (dev/staging/prod)

✅ **Use environment variables**
- All connectors read from `process.env`
- Rotate API keys periodically
- Consider using secret management (AWS Secrets Manager, etc.)

---

## Testing Credentials

Before running autonomous executor, test each connector:

```bash
npm run test:connectors
```

Output shows:
- ✅ Connection successful
- ✗ Authentication failed
- ⚠️ Missing credentials

---

## Troubleshooting

### "API Key not found"
```bash
echo $BOUNTIES_API_KEY  # Check if env var is set
```

### "Authorization failed"
- Verify API key is current (may have expired)
- Check if account still has access
- Confirm org/program restrictions

### "Network error"
- Check internet connectivity
- Verify API endpoint is correct
- Check for region/IP restrictions

---

## Next Steps

Once credentials are configured:

1. Run autonomous executor
2. Monitor initial submissions
3. Check prize verification progress
4. Claim prizes when verified

```bash
npm run autonomous:start
```

---

**Status**: Credentials documentation complete  
**Action**: Fill `.env` with your credentials and run `npm run credentials:check`

