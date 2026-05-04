export type RiskLevel = "Safe" | "Caution" | "High Risk" | "Critical";
export type PlatformSource = "Facebook" | "Instagram" | "WhatsApp" | "Marketplace" | "Other";
export type CaseStatus = "New" | "Under Review" | "Waiting Evidence" | "Escalated" | "Resolved";
export type EscrowStatus =
  | "Draft"
  | "Link Created"
  | "Funds Secured"
  | "Waiting Shipment"
  | "In Transit"
  | "Delivered"
  | "Waiting Buyer Confirmation"
  | "Auto-release Pending"
  | "Released to Seller"
  | "Disputed";

export interface BankAccount {
  accountId: string;
  accountNumber: string;
  ownerName: string;
  bankName: string;
  accountAgeDays: number;
  reportCount: number;
  verifiedReportCount: number;
  totalIncomingLast24h: number;
  totalOutgoingLast24h: number;
  averageCashoutMinutes: number;
  linkedHighRiskAccounts: number;
  riskScore: number;
  riskLevel: RiskLevel;
  type: "safe" | "caution" | "high-risk" | "mule" | "victim" | "external" | "ewallet";
}

export interface Transaction {
  txId: string;
  senderAccount: string;
  receiverAccount: string;
  amount: number;
  timestamp: string;
  channel: PlatformSource | "Mobile Banking" | "ATM" | "Internal Transfer";
  description: string;
  riskScore: number;
  flags: string[];
}

export interface ReportedAccount {
  accountNumber: string;
  numberOfReports: number;
  verifiedReports: number;
  fraudCategory: string;
  lastReportDate: string;
  riskStatus: RiskLevel;
  evidenceStatus: "Verified" | "Partial" | "Pending";
}

export interface EscrowCase {
  caseId: string;
  itemName: string;
  itemDescription: string;
  sellerUsername: string;
  buyerUsername: string;
  sellerAccount: string;
  buyerAccount: string;
  amount: number;
  escrowFee: number;
  courier: "JNE" | "J&T" | "SiCepat" | "AnterAja" | "Other";
  trackingNumber?: string;
  status: EscrowStatus;
  createdAt: string;
  releaseDeadline: string;
  disputeStatus: "None" | "Open" | "Under Review" | "Resolved";
}

export interface Dispute {
  disputeId: string;
  caseId: string;
  buyerComplaint: string;
  evidenceStatus: "Pending Upload" | "Uploaded" | "Reviewed";
  aiSummary: string;
  aiRecommendation: string;
  staffDecision?: "Refund buyer" | "Release to seller" | "Request more evidence" | "Freeze temporarily";
  createdAt: string;
}

export type ChatSenderRole = "ai" | "seller" | "buyer";

export interface RekberChatMessage {
  messageId: string;
  caseId: string;
  senderRole: ChatSenderRole;
  senderName: string;
  message: string;
  timestamp: string;
  metadata?: Record<string, string | number | boolean>;
}

export interface RiskCheckInput {
  accountNumber: string;
  amount: number;
  description: string;
  platform: PlatformSource;
  senderAccount?: string;
}

export interface RiskCheckResult {
  accountNumber: string;
  score: number;
  level: RiskLevel;
  reasons: string[];
  recommendedAction: string;
  accountFound: boolean;
}

export interface GraphNode {
  id: string;
  label: string;
  accountNumber?: string;
  type: BankAccount["type"];
  riskScore: number;
}

export interface GraphEdge {
  id: string;
  source: string;
  target: string;
  amount: number;
  label: string;
}

export interface AnalystCase {
  caseId: string;
  type: "Fraud Alert" | "Rekber Dispute" | "Reported Account";
  riskScore: number;
  status: CaseStatus;
  assignedAnalyst: string;
  lastUpdate: string;
  title: string;
}
