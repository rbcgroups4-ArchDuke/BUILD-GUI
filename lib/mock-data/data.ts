import type {
  AnalystCase,
  BankAccount,
  Dispute,
  EscrowCase,
  GraphEdge,
  GraphNode,
  PlatformSource,
  ReportedAccount,
  RiskLevel,
  Transaction
} from "@/types";

const now = new Date("2026-05-04T10:30:00+07:00");

export const riskLevelFromScore = (score: number): RiskLevel => {
  if (score <= 30) return "Safe";
  if (score <= 60) return "Caution";
  if (score <= 80) return "High Risk";
  return "Critical";
};

export const accounts: BankAccount[] = [
  {
    accountId: "ACC-001",
    accountNumber: "1234567890",
    ownerName: "R. Santoso",
    bankName: "Nusantara Bank",
    accountAgeDays: 18,
    reportCount: 14,
    verifiedReportCount: 8,
    totalIncomingLast24h: 82500000,
    totalOutgoingLast24h: 75900000,
    averageCashoutMinutes: 7,
    linkedHighRiskAccounts: 2,
    riskScore: 87,
    riskLevel: "Critical",
    type: "high-risk"
  },
  {
    accountId: "ACC-002",
    accountNumber: "8899001122",
    ownerName: "M. Pradana",
    bankName: "Nusantara Bank",
    accountAgeDays: 34,
    reportCount: 8,
    verifiedReportCount: 4,
    totalIncomingLast24h: 41200000,
    totalOutgoingLast24h: 39600000,
    averageCashoutMinutes: 9,
    linkedHighRiskAccounts: 1,
    riskScore: 78,
    riskLevel: "High Risk",
    type: "mule"
  },
  {
    accountId: "ACC-003",
    accountNumber: "7700112233",
    ownerName: "D. Anwar",
    bankName: "Garuda Bank",
    accountAgeDays: 1280,
    reportCount: 0,
    verifiedReportCount: 0,
    totalIncomingLast24h: 3500000,
    totalOutgoingLast24h: 1200000,
    averageCashoutMinutes: 480,
    linkedHighRiskAccounts: 0,
    riskScore: 18,
    riskLevel: "Safe",
    type: "safe"
  },
  {
    accountId: "ACC-004",
    accountNumber: "5566778899",
    ownerName: "A. Maharani",
    bankName: "Metro Digital Bank",
    accountAgeDays: 240,
    reportCount: 2,
    verifiedReportCount: 0,
    totalIncomingLast24h: 8700000,
    totalOutgoingLast24h: 6900000,
    averageCashoutMinutes: 74,
    linkedHighRiskAccounts: 0,
    riskScore: 45,
    riskLevel: "Caution",
    type: "caution"
  },
  {
    accountId: "ACC-005",
    accountNumber: "6611223344",
    ownerName: "N. Putri",
    bankName: "Nusantara Bank",
    accountAgeDays: 980,
    reportCount: 0,
    verifiedReportCount: 0,
    totalIncomingLast24h: 2200000,
    totalOutgoingLast24h: 900000,
    averageCashoutMinutes: 720,
    linkedHighRiskAccounts: 0,
    riskScore: 12,
    riskLevel: "Safe",
    type: "victim"
  },
  {
    accountId: "ACC-006",
    accountNumber: "6622334455",
    ownerName: "F. Ramadhan",
    bankName: "Nusantara Bank",
    accountAgeDays: 1420,
    reportCount: 0,
    verifiedReportCount: 0,
    totalIncomingLast24h: 4700000,
    totalOutgoingLast24h: 1300000,
    averageCashoutMinutes: 630,
    linkedHighRiskAccounts: 0,
    riskScore: 16,
    riskLevel: "Safe",
    type: "victim"
  },
  {
    accountId: "ACC-007",
    accountNumber: "6633445566",
    ownerName: "C. Wijaya",
    bankName: "Garuda Bank",
    accountAgeDays: 720,
    reportCount: 1,
    verifiedReportCount: 0,
    totalIncomingLast24h: 6100000,
    totalOutgoingLast24h: 1800000,
    averageCashoutMinutes: 410,
    linkedHighRiskAccounts: 0,
    riskScore: 24,
    riskLevel: "Safe",
    type: "victim"
  },
  {
    accountId: "ACC-008",
    accountNumber: "5522110099",
    ownerName: "T. Nugroho",
    bankName: "Metro Digital Bank",
    accountAgeDays: 52,
    reportCount: 6,
    verifiedReportCount: 3,
    totalIncomingLast24h: 31300000,
    totalOutgoingLast24h: 30100000,
    averageCashoutMinutes: 11,
    linkedHighRiskAccounts: 2,
    riskScore: 82,
    riskLevel: "Critical",
    type: "mule"
  },
  {
    accountId: "ACC-009",
    accountNumber: "9900887766",
    ownerName: "External Wallet Cluster",
    bankName: "E-Wallet Gateway",
    accountAgeDays: 360,
    reportCount: 3,
    verifiedReportCount: 1,
    totalIncomingLast24h: 22400000,
    totalOutgoingLast24h: 21600000,
    averageCashoutMinutes: 16,
    linkedHighRiskAccounts: 1,
    riskScore: 66,
    riskLevel: "High Risk",
    type: "ewallet"
  },
  {
    accountId: "ACC-010",
    accountNumber: "901300001900",
    ownerName: "M. Rekber Alias",
    bankName: "SeaBank",
    accountAgeDays: 21,
    reportCount: 11,
    verifiedReportCount: 6,
    totalIncomingLast24h: 38500000,
    totalOutgoingLast24h: 37200000,
    averageCashoutMinutes: 8,
    linkedHighRiskAccounts: 3,
    riskScore: 89,
    riskLevel: "Critical",
    type: "external"
  },
  ...Array.from({ length: 10 }, (_, index) => {
    const id = index + 11;
    const score = [22, 37, 58, 29, 49, 15, 72, 34, 19, 54][index];
    return {
      accountId: `ACC-${String(id).padStart(3, "0")}`,
      accountNumber: `${74 + index}${31 + index}${86 + index}${45 + index}${20 + index}`,
      ownerName: [
        "S. Lestari",
        "B. Firmansyah",
        "I. Akbar",
        "L. Kartika",
        "H. Saputra",
        "P. Dewi",
        "Y. Hidayat",
        "G. Permata",
        "O. Bakti",
        "E. Natalia"
      ][index],
      bankName: ["Nusantara Bank", "Garuda Bank", "Metro Digital Bank", "Samudra Bank"][index % 4],
      accountAgeDays: [640, 80, 44, 920, 160, 1288, 27, 410, 860, 120][index],
      reportCount: [0, 1, 2, 0, 1, 0, 5, 1, 0, 2][index],
      verifiedReportCount: [0, 0, 1, 0, 0, 0, 2, 0, 0, 1][index],
      totalIncomingLast24h: [4200000, 7700000, 11600000, 2200000, 9400000, 1800000, 23800000, 6600000, 2900000, 10200000][index],
      totalOutgoingLast24h: [1300000, 4900000, 8700000, 900000, 6100000, 700000, 22900000, 3100000, 1000000, 7800000][index],
      averageCashoutMinutes: [360, 120, 42, 600, 85, 720, 13, 160, 540, 38][index],
      linkedHighRiskAccounts: [0, 0, 1, 0, 0, 0, 2, 0, 0, 1][index],
      riskScore: score,
      riskLevel: riskLevelFromScore(score),
      type: score > 60 ? "high-risk" : score > 30 ? "caution" : "safe"
    } satisfies BankAccount;
  })
];

const socialChannels: PlatformSource[] = ["Facebook", "Instagram", "WhatsApp", "Marketplace"];
const descriptions = [
  "Payment for iPhone 13 marketplace order",
  "DP kamera second via Facebook",
  "Pembayaran sepeda lipat COD batal",
  "Transfer invoice toko online",
  "Format transaksi jual beli akun digital via grup rekber",
  "Dana sudah masuk noreff refplay escrow group",
  "Pelunasan laptop pre-owned",
  "Pembelian sneakers limited",
  "Order sparepart motor",
  "Top up saldo keluarga"
];

export const transactions: Transaction[] = Array.from({ length: 100 }, (_, index) => {
  const sender = accounts[(index + 4) % accounts.length];
  const receiver =
    index % 9 === 0
      ? accounts[0]
      : index % 13 === 0
        ? accounts[1]
        : accounts[(index * 3 + 2) % accounts.length];
  const amount = [6500000, 1250000, 3750000, 2750000, 899000, 13250000, 4500000, 1700000][index % 8];
  const riskScore = Math.min(98, Math.round(receiver.riskScore * 0.72 + (index % 9) * 3));
  return {
    txId: `TX-2026-${String(index + 1).padStart(5, "0")}`,
    senderAccount: sender.accountNumber,
    receiverAccount: receiver.accountNumber,
    amount,
    timestamp: new Date(now.getTime() - index * 17 * 60 * 1000).toISOString(),
    channel: index % 5 === 0 ? "Mobile Banking" : socialChannels[index % socialChannels.length],
    description: descriptions[index % descriptions.length],
    riskScore,
    flags:
      riskScore > 80
        ? ["fast_cashout", "social_commerce", "linked_reported_account"]
        : riskScore > 60
          ? ["new_counterparty", "social_commerce"]
          : []
  };
});

export const reportedAccounts: ReportedAccount[] = accounts
  .filter((account) => account.reportCount > 0)
  .slice(0, 10)
  .map((account, index) => ({
    accountNumber: account.accountNumber,
    numberOfReports: account.reportCount,
    verifiedReports: account.verifiedReportCount,
    fraudCategory: [
      "Triangle transaction",
      "Fake marketplace seller",
      "Fake rekber group impersonation",
      "Rapid cash-out mule",
      "Account takeover",
      "Escrow impersonation"
    ][index % 6],
    lastReportDate: new Date(now.getTime() - (index + 1) * 9 * 60 * 60 * 1000).toISOString(),
    riskStatus: account.riskLevel,
    evidenceStatus: index % 3 === 0 ? "Verified" : index % 3 === 1 ? "Partial" : "Pending"
  }));

export const escrowCases: EscrowCase[] = [
  {
    caseId: "RKB-2026-000129",
    itemName: "iPhone 13 128GB Midnight",
    itemDescription: "Used, fullset box, battery health 88%, listed via Facebook group.",
    sellerUsername: "fb.com/market.aris",
    buyerUsername: "fb.com/dina.securebuy",
    sellerAccount: "1234567890",
    buyerAccount: "6611223344",
    amount: 6500000,
    escrowFee: 65000,
    courier: "JNE",
    trackingNumber: "JNE-8821-4409-ID",
    status: "Delivered",
    createdAt: new Date(now.getTime() - 30 * 60 * 60 * 1000).toISOString(),
    releaseDeadline: new Date(now.getTime() + 18 * 60 * 60 * 1000).toISOString(),
    disputeStatus: "Open"
  },
  ...Array.from({ length: 7 }, (_, index) => ({
    caseId: `RKB-2026-00013${index}`,
    itemName: ["MacBook Air M2", "Sony A6400", "Nintendo Switch OLED", "Road Bike Polygon", "iPad Air 5", "Watch Ultra", "RTX 4070 GPU"][index],
    itemDescription: "Bank-operated escrow simulation for social commerce purchase.",
    sellerUsername: `fb.com/seller.${index + 21}`,
    buyerUsername: `instagram.com/buyer.${index + 42}`,
    sellerAccount: accounts[(index + 3) % accounts.length].accountNumber,
    buyerAccount: accounts[(index + 8) % accounts.length].accountNumber,
    amount: [11200000, 8300000, 4200000, 7100000, 7600000, 5200000, 9800000][index],
    escrowFee: [112000, 83000, 42000, 71000, 76000, 52000, 98000][index],
    courier: ["J&T", "SiCepat", "AnterAja", "JNE", "Other", "J&T", "SiCepat"][index] as EscrowCase["courier"],
    trackingNumber: index % 2 === 0 ? `TRK-${index + 1288}-FG` : undefined,
    status: ["Funds Secured", "In Transit", "Waiting Shipment", "Auto-release Pending", "Link Created", "Delivered", "Disputed"][index] as EscrowCase["status"],
    createdAt: new Date(now.getTime() - (index + 3) * 8 * 60 * 60 * 1000).toISOString(),
    releaseDeadline: new Date(now.getTime() + (index + 1) * 14 * 60 * 60 * 1000).toISOString(),
    disputeStatus: (index === 6 ? "Under Review" : "None") as EscrowCase["disputeStatus"]
  }) satisfies EscrowCase)
];

export const disputes: Dispute[] = [
  {
    disputeId: "DSP-2026-0091",
    caseId: "RKB-2026-000129",
    buyerComplaint: "Package arrived, but the box was empty and courier weight looks inconsistent.",
    evidenceStatus: "Uploaded",
    aiSummary:
      "Buyer reports an empty package for an iPhone 13 transaction. Courier weight is below expected device and packaging weight. Seller account has prior dispute history.",
    aiRecommendation:
      "Hold funds and escalate to authorized bank staff. Request courier weight proof and unboxing evidence before any release decision.",
    createdAt: new Date(now.getTime() - 3 * 60 * 60 * 1000).toISOString()
  },
  ...Array.from({ length: 4 }, (_, index) => ({
    disputeId: `DSP-2026-009${index + 2}`,
    caseId: escrowCases[index + 2]?.caseId ?? `RKB-2026-00014${index}`,
    buyerComplaint: [
      "Item condition does not match listing photos.",
      "Tracking number has not moved for two days.",
      "Seller requests direct settlement outside bank escrow.",
      "Package delivered to a different address."
    ][index],
    evidenceStatus: ["Reviewed", "Uploaded", "Pending Upload", "Uploaded"][index] as Dispute["evidenceStatus"],
    aiSummary: "Decision-support summary prepared from buyer text, courier status, and seller history.",
    aiRecommendation: ["Request more evidence.", "Hold funds temporarily.", "Escalate to staff.", "Freeze temporarily while courier confirms."][index],
    createdAt: new Date(now.getTime() - (index + 5) * 60 * 60 * 1000).toISOString()
  }))
];

export const graphNodes: GraphNode[] = [
  { id: "victim-a", label: "Victim A", accountNumber: "6611223344", type: "victim", riskScore: 12 },
  { id: "victim-b", label: "Victim B", accountNumber: "6622334455", type: "victim", riskScore: 16 },
  { id: "victim-c", label: "Victim C", accountNumber: "6633445566", type: "victim", riskScore: 24 },
  { id: "suspect", label: "Suspicious Account", accountNumber: "1234567890", type: "high-risk", riskScore: 87 },
  { id: "mule", label: "Mule Account", accountNumber: "8899001122", type: "mule", riskScore: 78 },
  { id: "ewallet", label: "E-wallet", accountNumber: "9900887766", type: "ewallet", riskScore: 66 },
  { id: "external", label: "External Account", accountNumber: "4455667788", type: "external", riskScore: 62 }
];

export const graphEdges: GraphEdge[] = [
  { id: "e1", source: "victim-a", target: "suspect", amount: 6500000, label: "Rp6.5M" },
  { id: "e2", source: "victim-b", target: "suspect", amount: 4200000, label: "Rp4.2M" },
  { id: "e3", source: "victim-c", target: "suspect", amount: 2750000, label: "Rp2.75M" },
  { id: "e4", source: "suspect", target: "mule", amount: 12100000, label: "Cash-out 7m" },
  { id: "e5", source: "suspect", target: "ewallet", amount: 5000000, label: "Split transfer" },
  { id: "e6", source: "mule", target: "external", amount: 8800000, label: "External" }
];

export const analystCases: AnalystCase[] = [
  {
    caseId: "CASE-2026-3101",
    type: "Fraud Alert",
    riskScore: 87,
    status: "New",
    assignedAnalyst: "Ayu Prameswari",
    lastUpdate: new Date(now.getTime() - 24 * 60 * 1000).toISOString(),
    title: "Triangle fraud pattern linked to account ending 7890"
  },
  {
    caseId: "CASE-2026-3102",
    type: "Rekber Dispute",
    riskScore: 82,
    status: "Escalated",
    assignedAnalyst: "Bima Santika",
    lastUpdate: new Date(now.getTime() - 70 * 60 * 1000).toISOString(),
    title: "Empty package dispute for RKB-2026-000129"
  },
  ...Array.from({ length: 8 }, (_, index) => ({
    caseId: `CASE-2026-310${index + 3}`,
    type: ["Reported Account", "Fraud Alert", "Rekber Dispute"][index % 3] as AnalystCase["type"],
    riskScore: [64, 74, 55, 91, 47, 68, 38, 79][index],
    status: ["Under Review", "Waiting Evidence", "Resolved", "New", "Escalated"][index % 5] as AnalystCase["status"],
    assignedAnalyst: ["Ayu Prameswari", "Bima Santika", "Citra Halim", "Dimas Rafi"][index % 4],
    lastUpdate: new Date(now.getTime() - (index + 2) * 46 * 60 * 1000).toISOString(),
    title: [
      "Reported seller account requires evidence review",
      "Rapid incoming transfers from unrelated senders",
      "Courier evidence mismatch in escrow case",
      "Mule chain connected to external wallet",
      "Customer report pending verification",
      "Potential account takeover signal",
      "Resolved rekber release request",
      "Social commerce transaction cluster"
    ][index]
  }))
];

export const auditLogs = [
  "2026-05-04 10:22 Analyst Ayu opened CASE-2026-3101",
  "2026-05-04 10:24 Risk model explanation viewed for account ****7890",
  "2026-05-04 10:29 Dispute hold recommendation generated for RKB-2026-000129"
];
