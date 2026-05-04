# FraudGuard Rekber AI

FraudGuard Rekber AI is a professional hackathon prototype for banking fraud detection and secure escrow, focused on preventing triangle transaction scams in social commerce flows such as Facebook, Instagram, WhatsApp, and informal marketplaces.

The application uses mock data and simulated APIs only. It does not integrate with Bank Indonesia, OJK, CekRekening.id, real banks, couriers, marketplaces, or payment rails.

## Features

- Public fintech landing page with animated dashboard preview and clear demo positioning.
- Customer fraud check page with explainable account risk scoring.
- mAIst scam typology for fake chat-group escrow, noreff/refund wording, payment receipt screenshots, and “dana sudah masuk” pressure messages.
- Hybrid FDS module from the proposal: rule-based engine plus simulated Isolation Forest, customer behavior features, combined final risk score, transaction auto stream, and analyst actions.
- Transfer simulation that blocks high-risk demo transfers and recommends bank escrow.
- Seller Rekber Link creation flow with generated mock escrow URL.
- mAIst chat room where buyer, seller, and an automated bank mediator coordinate the transaction.
- Buyer escrow payment page with simulated bank wallet status.
- Courier tracking simulation with escrow status timeline.
- Buyer dispute page with evidence placeholder and AI decision-support summary.
- Fraud analyst dashboard with KPI cards, alert table, risk trend chart, account graph, cases, and reports.
- Masked account numbers, role-specific UI surfaces, and audit log simulation.

## Tech Stack

- Next.js App Router
- TypeScript
- Tailwind CSS
- shadcn/ui-style reusable components
- Framer Motion
- Recharts
- React Flow
- Lucide React
- Next.js API routes for the mock backend

## Local Setup

Install dependencies:

```bash
npm install
```

Run the development server:

```bash
npm run dev
```

Build for production:

```bash
npm run build
```

## Mock Data

The prototype includes realistic in-memory demo data:

- 20 bank accounts
- 100 transactions
- 10 reported account records
- 8 escrow cases
- 5 disputes
- 1 suspicious triangle fraud network

Primary data lives in `lib/mock-data/data.ts`, with mutable escrow and dispute helpers in `lib/mock-data/store.ts`.

## Production Database Schema

A PostgreSQL-style production schema is included at `db/production-schema.sql`.

It defines:

- users, accounts, transactions, reported_accounts, risk_scores, fraud_alerts
- escrow_cases, escrow_payments, courier_tracking, disputes, evidence_files
- analyst_actions, audit_logs, account_relationships
- JSONB metadata fields, status fields, risk score fields, risk level enums, analyst audit fields, updated_at triggers, and indexes for account lookup, risk sorting, transaction time, escrow status, alert status, and relationship graph traversal.

## Risk Engine

The rule-based risk engine is in `lib/risk-engine/index.ts`. It scores:

- Verified fraud reports
- New account age
- Many incoming transfers
- Fast cash-out behavior
- Links to high-risk accounts
- Scam-like transaction descriptions
- Repeated suspicious transaction amounts
- Unknown sender/receiver relationship
- Social commerce platform context

Risk levels:

- 0-30: Safe
- 31-60: Caution
- 61-80: High Risk
- 81-100: Critical

## Demo Flow

1. Open `/`.
2. Click **Try Fraud Check Demo**.
3. Use account `1234567890` and amount `Rp6,500,000`.
4. The system returns **Critical Risk 87/100**.
5. Click **Use Bank Rekber Link**.
6. Create a Rekber Link for an iPhone 13 sold via Facebook.
7. Open mAIst Chat and send buyer/seller messages.
8. Open the buyer payment page and simulate payment into escrow.
9. Open tracking and submit the mocked courier tracking number.
10. Tracking moves to delivered.
11. Open dispute and submit the buyer complaint.
12. AI summarizes evidence and recommends holding funds.
13. Open `/dashboard`, `/dashboard/hybrid-fds`, or `/dashboard/cases` for staff review.

## API Routes

- `GET /api/accounts/:accountNumber`
- `POST /api/risk/check`
- `POST /api/transfer/simulate`
- `POST /api/rekber/create`
- `GET /api/rekber/:id`
- `POST /api/rekber/:id/pay`
- `GET /api/rekber/:id/chat`
- `POST /api/rekber/:id/chat`
- `POST /api/rekber/:id/tracking`
- `POST /api/rekber/:id/dispute`
- `GET /api/dashboard/summary`
- `GET /api/dashboard/alerts`
- `GET /api/dashboard/graph`
- `GET /api/dashboard/cases`

## Future Integration Possibilities

Future production versions could integrate authorized bank systems, verified account-reporting sources, regulator-compliant workflows, marketplace signals, payment rails, courier tracking, and formal case-management systems. Those are intentionally shown as future possibilities only.
