-- FraudGuard Rekber AI production PostgreSQL schema
-- Prototype note: this schema is for a future production version. The current app uses mock data only.

CREATE EXTENSION IF NOT EXISTS pgcrypto;
CREATE EXTENSION IF NOT EXISTS citext;

CREATE TYPE user_role AS ENUM (
  'customer',
  'seller',
  'buyer',
  'fraud_analyst',
  'bank_staff',
  'admin'
);

CREATE TYPE risk_level AS ENUM (
  'safe',
  'caution',
  'high_risk',
  'critical'
);

CREATE TYPE case_status AS ENUM (
  'new',
  'under_review',
  'waiting_evidence',
  'escalated',
  'resolved',
  'closed'
);

CREATE TYPE alert_status AS ENUM (
  'new',
  'triaged',
  'under_review',
  'escalated',
  'resolved',
  'false_positive'
);

CREATE TYPE escrow_status AS ENUM (
  'draft',
  'link_created',
  'awaiting_payment',
  'funds_secured',
  'waiting_shipment',
  'in_transit',
  'delivered',
  'waiting_buyer_confirmation',
  'auto_release_pending',
  'released_to_seller',
  'disputed',
  'refunded',
  'frozen',
  'cancelled'
);

CREATE TYPE dispute_status AS ENUM (
  'open',
  'under_review',
  'waiting_evidence',
  'escalated',
  'resolved',
  'closed'
);

CREATE TYPE relationship_type AS ENUM (
  'sent_to',
  'cashout_to',
  'linked_report',
  'shared_device',
  'shared_identity_signal',
  'same_beneficiary',
  'escrow_counterparty'
);

CREATE OR REPLACE FUNCTION set_updated_at()
RETURNS TRIGGER AS $$
BEGIN
  NEW.updated_at = NOW();
  RETURN NEW;
END;
$$ LANGUAGE plpgsql;

CREATE TABLE users (
  id UUID PRIMARY KEY DEFAULT gen_random_uuid(),
  full_name TEXT NOT NULL,
  email CITEXT UNIQUE,
  phone_number TEXT,
  role user_role NOT NULL DEFAULT 'customer',
  status TEXT NOT NULL DEFAULT 'active',
  last_login_at TIMESTAMPTZ,
  metadata JSONB NOT NULL DEFAULT '{}'::jsonb,
  created_at TIMESTAMPTZ NOT NULL DEFAULT NOW(),
  updated_at TIMESTAMPTZ NOT NULL DEFAULT NOW()
);

CREATE TABLE accounts (
  id UUID PRIMARY KEY DEFAULT gen_random_uuid(),
  user_id UUID REFERENCES users(id) ON DELETE SET NULL,
  account_number TEXT NOT NULL UNIQUE,
  account_number_hash TEXT NOT NULL UNIQUE,
  bank_code TEXT NOT NULL,
  bank_name TEXT NOT NULL,
  owner_display_name TEXT NOT NULL,
  account_age_days INTEGER NOT NULL DEFAULT 0,
  status TEXT NOT NULL DEFAULT 'active',
  risk_score NUMERIC(5,2) NOT NULL DEFAULT 0 CHECK (risk_score >= 0 AND risk_score <= 100),
  risk_level risk_level NOT NULL DEFAULT 'safe',
  report_count INTEGER NOT NULL DEFAULT 0,
  verified_report_count INTEGER NOT NULL DEFAULT 0,
  metadata JSONB NOT NULL DEFAULT '{}'::jsonb,
  created_at TIMESTAMPTZ NOT NULL DEFAULT NOW(),
  updated_at TIMESTAMPTZ NOT NULL DEFAULT NOW()
);

CREATE TABLE transactions (
  id UUID PRIMARY KEY DEFAULT gen_random_uuid(),
  transaction_reference TEXT NOT NULL UNIQUE,
  sender_account_id UUID REFERENCES accounts(id) ON DELETE SET NULL,
  receiver_account_id UUID REFERENCES accounts(id) ON DELETE SET NULL,
  amount NUMERIC(18,2) NOT NULL CHECK (amount >= 0),
  currency CHAR(3) NOT NULL DEFAULT 'IDR',
  channel TEXT NOT NULL,
  platform_source TEXT,
  description TEXT,
  transaction_timestamp TIMESTAMPTZ NOT NULL,
  status TEXT NOT NULL DEFAULT 'pending',
  risk_score NUMERIC(5,2) CHECK (risk_score >= 0 AND risk_score <= 100),
  risk_level risk_level,
  metadata JSONB NOT NULL DEFAULT '{}'::jsonb,
  created_at TIMESTAMPTZ NOT NULL DEFAULT NOW(),
  updated_at TIMESTAMPTZ NOT NULL DEFAULT NOW()
);

CREATE TABLE reported_accounts (
  id UUID PRIMARY KEY DEFAULT gen_random_uuid(),
  account_id UUID REFERENCES accounts(id) ON DELETE SET NULL,
  account_number TEXT NOT NULL,
  reporter_user_id UUID REFERENCES users(id) ON DELETE SET NULL,
  fraud_category TEXT NOT NULL,
  report_summary TEXT NOT NULL,
  evidence_status TEXT NOT NULL DEFAULT 'pending',
  verified_by UUID REFERENCES users(id) ON DELETE SET NULL,
  verified_at TIMESTAMPTZ,
  status case_status NOT NULL DEFAULT 'new',
  risk_score NUMERIC(5,2) CHECK (risk_score >= 0 AND risk_score <= 100),
  risk_level risk_level,
  metadata JSONB NOT NULL DEFAULT '{}'::jsonb,
  created_at TIMESTAMPTZ NOT NULL DEFAULT NOW(),
  updated_at TIMESTAMPTZ NOT NULL DEFAULT NOW()
);

CREATE TABLE risk_scores (
  id UUID PRIMARY KEY DEFAULT gen_random_uuid(),
  account_id UUID REFERENCES accounts(id) ON DELETE CASCADE,
  transaction_id UUID REFERENCES transactions(id) ON DELETE CASCADE,
  score NUMERIC(5,2) NOT NULL CHECK (score >= 0 AND score <= 100),
  risk_level risk_level NOT NULL,
  model_version TEXT NOT NULL,
  reasons JSONB NOT NULL DEFAULT '[]'::jsonb,
  recommended_action TEXT NOT NULL,
  scored_at TIMESTAMPTZ NOT NULL DEFAULT NOW(),
  status TEXT NOT NULL DEFAULT 'active',
  metadata JSONB NOT NULL DEFAULT '{}'::jsonb,
  created_at TIMESTAMPTZ NOT NULL DEFAULT NOW(),
  updated_at TIMESTAMPTZ NOT NULL DEFAULT NOW(),
  CHECK (account_id IS NOT NULL OR transaction_id IS NOT NULL)
);

CREATE TABLE fraud_alerts (
  id UUID PRIMARY KEY DEFAULT gen_random_uuid(),
  alert_reference TEXT NOT NULL UNIQUE,
  account_id UUID REFERENCES accounts(id) ON DELETE SET NULL,
  transaction_id UUID REFERENCES transactions(id) ON DELETE SET NULL,
  risk_score_id UUID REFERENCES risk_scores(id) ON DELETE SET NULL,
  title TEXT NOT NULL,
  description TEXT NOT NULL,
  risk_score NUMERIC(5,2) NOT NULL CHECK (risk_score >= 0 AND risk_score <= 100),
  risk_level risk_level NOT NULL,
  status alert_status NOT NULL DEFAULT 'new',
  assigned_analyst_id UUID REFERENCES users(id) ON DELETE SET NULL,
  escalated_at TIMESTAMPTZ,
  resolved_at TIMESTAMPTZ,
  metadata JSONB NOT NULL DEFAULT '{}'::jsonb,
  created_at TIMESTAMPTZ NOT NULL DEFAULT NOW(),
  updated_at TIMESTAMPTZ NOT NULL DEFAULT NOW()
);

CREATE TABLE escrow_cases (
  id UUID PRIMARY KEY DEFAULT gen_random_uuid(),
  case_reference TEXT NOT NULL UNIQUE,
  seller_user_id UUID REFERENCES users(id) ON DELETE SET NULL,
  buyer_user_id UUID REFERENCES users(id) ON DELETE SET NULL,
  seller_account_id UUID REFERENCES accounts(id) ON DELETE SET NULL,
  buyer_account_id UUID REFERENCES accounts(id) ON DELETE SET NULL,
  item_name TEXT NOT NULL,
  item_description TEXT,
  item_price NUMERIC(18,2) NOT NULL CHECK (item_price >= 0),
  escrow_fee NUMERIC(18,2) NOT NULL DEFAULT 0 CHECK (escrow_fee >= 0),
  currency CHAR(3) NOT NULL DEFAULT 'IDR',
  platform_source TEXT,
  courier_name TEXT,
  shipping_deadline TIMESTAMPTZ,
  release_deadline TIMESTAMPTZ,
  status escrow_status NOT NULL DEFAULT 'link_created',
  risk_score NUMERIC(5,2) CHECK (risk_score >= 0 AND risk_score <= 100),
  risk_level risk_level,
  assigned_staff_id UUID REFERENCES users(id) ON DELETE SET NULL,
  metadata JSONB NOT NULL DEFAULT '{}'::jsonb,
  created_at TIMESTAMPTZ NOT NULL DEFAULT NOW(),
  updated_at TIMESTAMPTZ NOT NULL DEFAULT NOW()
);

CREATE TABLE escrow_payments (
  id UUID PRIMARY KEY DEFAULT gen_random_uuid(),
  escrow_case_id UUID NOT NULL REFERENCES escrow_cases(id) ON DELETE CASCADE,
  payment_reference TEXT NOT NULL UNIQUE,
  payer_account_id UUID REFERENCES accounts(id) ON DELETE SET NULL,
  escrow_wallet_account_id UUID REFERENCES accounts(id) ON DELETE SET NULL,
  amount NUMERIC(18,2) NOT NULL CHECK (amount >= 0),
  fee_amount NUMERIC(18,2) NOT NULL DEFAULT 0 CHECK (fee_amount >= 0),
  currency CHAR(3) NOT NULL DEFAULT 'IDR',
  paid_at TIMESTAMPTZ,
  released_at TIMESTAMPTZ,
  refunded_at TIMESTAMPTZ,
  status TEXT NOT NULL DEFAULT 'pending',
  risk_score NUMERIC(5,2) CHECK (risk_score >= 0 AND risk_score <= 100),
  risk_level risk_level,
  metadata JSONB NOT NULL DEFAULT '{}'::jsonb,
  created_at TIMESTAMPTZ NOT NULL DEFAULT NOW(),
  updated_at TIMESTAMPTZ NOT NULL DEFAULT NOW()
);

CREATE TABLE courier_tracking (
  id UUID PRIMARY KEY DEFAULT gen_random_uuid(),
  escrow_case_id UUID NOT NULL REFERENCES escrow_cases(id) ON DELETE CASCADE,
  courier_name TEXT NOT NULL,
  tracking_number TEXT NOT NULL,
  tracking_status TEXT NOT NULL,
  current_location TEXT,
  shipped_at TIMESTAMPTZ,
  delivered_at TIMESTAMPTZ,
  last_checked_at TIMESTAMPTZ,
  status TEXT NOT NULL DEFAULT 'active',
  metadata JSONB NOT NULL DEFAULT '{}'::jsonb,
  created_at TIMESTAMPTZ NOT NULL DEFAULT NOW(),
  updated_at TIMESTAMPTZ NOT NULL DEFAULT NOW(),
  UNIQUE (courier_name, tracking_number)
);

CREATE TABLE disputes (
  id UUID PRIMARY KEY DEFAULT gen_random_uuid(),
  dispute_reference TEXT NOT NULL UNIQUE,
  escrow_case_id UUID NOT NULL REFERENCES escrow_cases(id) ON DELETE CASCADE,
  opened_by_user_id UUID REFERENCES users(id) ON DELETE SET NULL,
  assigned_staff_id UUID REFERENCES users(id) ON DELETE SET NULL,
  complaint TEXT NOT NULL,
  ai_summary TEXT,
  ai_recommendation TEXT,
  staff_decision TEXT,
  staff_decision_reason TEXT,
  decided_by UUID REFERENCES users(id) ON DELETE SET NULL,
  decided_at TIMESTAMPTZ,
  status dispute_status NOT NULL DEFAULT 'open',
  risk_score NUMERIC(5,2) CHECK (risk_score >= 0 AND risk_score <= 100),
  risk_level risk_level,
  metadata JSONB NOT NULL DEFAULT '{}'::jsonb,
  created_at TIMESTAMPTZ NOT NULL DEFAULT NOW(),
  updated_at TIMESTAMPTZ NOT NULL DEFAULT NOW()
);

CREATE TABLE evidence_files (
  id UUID PRIMARY KEY DEFAULT gen_random_uuid(),
  dispute_id UUID REFERENCES disputes(id) ON DELETE CASCADE,
  reported_account_id UUID REFERENCES reported_accounts(id) ON DELETE CASCADE,
  escrow_case_id UUID REFERENCES escrow_cases(id) ON DELETE CASCADE,
  uploaded_by_user_id UUID REFERENCES users(id) ON DELETE SET NULL,
  file_name TEXT NOT NULL,
  file_type TEXT NOT NULL,
  storage_url TEXT NOT NULL,
  file_hash TEXT,
  status TEXT NOT NULL DEFAULT 'uploaded',
  metadata JSONB NOT NULL DEFAULT '{}'::jsonb,
  created_at TIMESTAMPTZ NOT NULL DEFAULT NOW(),
  updated_at TIMESTAMPTZ NOT NULL DEFAULT NOW(),
  CHECK (dispute_id IS NOT NULL OR reported_account_id IS NOT NULL OR escrow_case_id IS NOT NULL)
);

CREATE TABLE analyst_actions (
  id UUID PRIMARY KEY DEFAULT gen_random_uuid(),
  analyst_id UUID NOT NULL REFERENCES users(id) ON DELETE RESTRICT,
  fraud_alert_id UUID REFERENCES fraud_alerts(id) ON DELETE SET NULL,
  dispute_id UUID REFERENCES disputes(id) ON DELETE SET NULL,
  escrow_case_id UUID REFERENCES escrow_cases(id) ON DELETE SET NULL,
  reported_account_id UUID REFERENCES reported_accounts(id) ON DELETE SET NULL,
  action_type TEXT NOT NULL,
  action_summary TEXT NOT NULL,
  previous_status TEXT,
  new_status TEXT,
  previous_assignee_id UUID REFERENCES users(id) ON DELETE SET NULL,
  new_assignee_id UUID REFERENCES users(id) ON DELETE SET NULL,
  decision_reason TEXT,
  ip_address INET,
  user_agent TEXT,
  status TEXT NOT NULL DEFAULT 'recorded',
  metadata JSONB NOT NULL DEFAULT '{}'::jsonb,
  created_at TIMESTAMPTZ NOT NULL DEFAULT NOW(),
  updated_at TIMESTAMPTZ NOT NULL DEFAULT NOW(),
  CHECK (
    fraud_alert_id IS NOT NULL OR
    dispute_id IS NOT NULL OR
    escrow_case_id IS NOT NULL OR
    reported_account_id IS NOT NULL
  )
);

CREATE TABLE audit_logs (
  id UUID PRIMARY KEY DEFAULT gen_random_uuid(),
  actor_user_id UUID REFERENCES users(id) ON DELETE SET NULL,
  action TEXT NOT NULL,
  entity_type TEXT NOT NULL,
  entity_id UUID,
  before_data JSONB,
  after_data JSONB,
  request_id TEXT,
  ip_address INET,
  user_agent TEXT,
  status TEXT NOT NULL DEFAULT 'success',
  metadata JSONB NOT NULL DEFAULT '{}'::jsonb,
  created_at TIMESTAMPTZ NOT NULL DEFAULT NOW(),
  updated_at TIMESTAMPTZ NOT NULL DEFAULT NOW()
);

CREATE TABLE account_relationships (
  id UUID PRIMARY KEY DEFAULT gen_random_uuid(),
  source_account_id UUID NOT NULL REFERENCES accounts(id) ON DELETE CASCADE,
  target_account_id UUID NOT NULL REFERENCES accounts(id) ON DELETE CASCADE,
  relationship_type relationship_type NOT NULL,
  confidence_score NUMERIC(5,2) NOT NULL DEFAULT 0 CHECK (confidence_score >= 0 AND confidence_score <= 100),
  risk_score NUMERIC(5,2) CHECK (risk_score >= 0 AND risk_score <= 100),
  risk_level risk_level,
  first_seen_at TIMESTAMPTZ NOT NULL DEFAULT NOW(),
  last_seen_at TIMESTAMPTZ NOT NULL DEFAULT NOW(),
  status TEXT NOT NULL DEFAULT 'active',
  metadata JSONB NOT NULL DEFAULT '{}'::jsonb,
  created_at TIMESTAMPTZ NOT NULL DEFAULT NOW(),
  updated_at TIMESTAMPTZ NOT NULL DEFAULT NOW(),
  UNIQUE (source_account_id, target_account_id, relationship_type)
);

-- updated_at triggers
CREATE TRIGGER trg_users_updated_at BEFORE UPDATE ON users FOR EACH ROW EXECUTE FUNCTION set_updated_at();
CREATE TRIGGER trg_accounts_updated_at BEFORE UPDATE ON accounts FOR EACH ROW EXECUTE FUNCTION set_updated_at();
CREATE TRIGGER trg_transactions_updated_at BEFORE UPDATE ON transactions FOR EACH ROW EXECUTE FUNCTION set_updated_at();
CREATE TRIGGER trg_reported_accounts_updated_at BEFORE UPDATE ON reported_accounts FOR EACH ROW EXECUTE FUNCTION set_updated_at();
CREATE TRIGGER trg_risk_scores_updated_at BEFORE UPDATE ON risk_scores FOR EACH ROW EXECUTE FUNCTION set_updated_at();
CREATE TRIGGER trg_fraud_alerts_updated_at BEFORE UPDATE ON fraud_alerts FOR EACH ROW EXECUTE FUNCTION set_updated_at();
CREATE TRIGGER trg_escrow_cases_updated_at BEFORE UPDATE ON escrow_cases FOR EACH ROW EXECUTE FUNCTION set_updated_at();
CREATE TRIGGER trg_escrow_payments_updated_at BEFORE UPDATE ON escrow_payments FOR EACH ROW EXECUTE FUNCTION set_updated_at();
CREATE TRIGGER trg_courier_tracking_updated_at BEFORE UPDATE ON courier_tracking FOR EACH ROW EXECUTE FUNCTION set_updated_at();
CREATE TRIGGER trg_disputes_updated_at BEFORE UPDATE ON disputes FOR EACH ROW EXECUTE FUNCTION set_updated_at();
CREATE TRIGGER trg_evidence_files_updated_at BEFORE UPDATE ON evidence_files FOR EACH ROW EXECUTE FUNCTION set_updated_at();
CREATE TRIGGER trg_analyst_actions_updated_at BEFORE UPDATE ON analyst_actions FOR EACH ROW EXECUTE FUNCTION set_updated_at();
CREATE TRIGGER trg_audit_logs_updated_at BEFORE UPDATE ON audit_logs FOR EACH ROW EXECUTE FUNCTION set_updated_at();
CREATE TRIGGER trg_account_relationships_updated_at BEFORE UPDATE ON account_relationships FOR EACH ROW EXECUTE FUNCTION set_updated_at();

-- Account lookup indexes
CREATE INDEX idx_accounts_account_number ON accounts (account_number);
CREATE INDEX idx_accounts_account_number_hash ON accounts (account_number_hash);
CREATE INDEX idx_reported_accounts_account_number ON reported_accounts (account_number);

-- Risk indexes
CREATE INDEX idx_accounts_risk_score ON accounts (risk_score DESC);
CREATE INDEX idx_transactions_risk_score ON transactions (risk_score DESC);
CREATE INDEX idx_risk_scores_score ON risk_scores (score DESC);
CREATE INDEX idx_fraud_alerts_risk_score ON fraud_alerts (risk_score DESC);
CREATE INDEX idx_escrow_cases_risk_score ON escrow_cases (risk_score DESC);
CREATE INDEX idx_account_relationships_risk_score ON account_relationships (risk_score DESC);

-- Transaction timestamp indexes
CREATE INDEX idx_transactions_timestamp ON transactions (transaction_timestamp DESC);
CREATE INDEX idx_transactions_receiver_timestamp ON transactions (receiver_account_id, transaction_timestamp DESC);
CREATE INDEX idx_transactions_sender_timestamp ON transactions (sender_account_id, transaction_timestamp DESC);

-- Escrow and alert status indexes
CREATE INDEX idx_escrow_cases_status ON escrow_cases (status);
CREATE INDEX idx_escrow_cases_status_updated_at ON escrow_cases (status, updated_at DESC);
CREATE INDEX idx_fraud_alerts_status ON fraud_alerts (status);
CREATE INDEX idx_fraud_alerts_status_updated_at ON fraud_alerts (status, updated_at DESC);
CREATE INDEX idx_disputes_status ON disputes (status);

-- Relationship graph lookup indexes
CREATE INDEX idx_account_relationships_source ON account_relationships (source_account_id);
CREATE INDEX idx_account_relationships_target ON account_relationships (target_account_id);
CREATE INDEX idx_account_relationships_source_type ON account_relationships (source_account_id, relationship_type);
CREATE INDEX idx_account_relationships_target_type ON account_relationships (target_account_id, relationship_type);
CREATE INDEX idx_account_relationships_last_seen ON account_relationships (last_seen_at DESC);
CREATE INDEX idx_account_relationships_graph_traversal ON account_relationships (source_account_id, target_account_id, relationship_type);

-- Operational audit indexes
CREATE INDEX idx_analyst_actions_analyst_created_at ON analyst_actions (analyst_id, created_at DESC);
CREATE INDEX idx_analyst_actions_alert ON analyst_actions (fraud_alert_id);
CREATE INDEX idx_analyst_actions_dispute ON analyst_actions (dispute_id);
CREATE INDEX idx_audit_logs_entity ON audit_logs (entity_type, entity_id);
CREATE INDEX idx_audit_logs_actor_created_at ON audit_logs (actor_user_id, created_at DESC);

-- JSONB indexes for flexible investigation metadata
CREATE INDEX idx_accounts_metadata_gin ON accounts USING GIN (metadata);
CREATE INDEX idx_transactions_metadata_gin ON transactions USING GIN (metadata);
CREATE INDEX idx_fraud_alerts_metadata_gin ON fraud_alerts USING GIN (metadata);
CREATE INDEX idx_escrow_cases_metadata_gin ON escrow_cases USING GIN (metadata);
CREATE INDEX idx_account_relationships_metadata_gin ON account_relationships USING GIN (metadata);
