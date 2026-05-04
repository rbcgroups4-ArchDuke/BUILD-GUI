import type { ChatSenderRole, Dispute, EscrowCase, RekberChatMessage } from "@/types";
import {
  accounts,
  analystCases,
  auditLogs,
  disputes as initialDisputes,
  escrowCases as initialEscrowCases,
  graphEdges,
  graphNodes,
  reportedAccounts,
  transactions
} from "./data";

const state = {
  escrowCases: [...initialEscrowCases],
  disputes: [...initialDisputes],
  chatMessages: new Map<string, RekberChatMessage[]>()
};

export function findAccount(accountNumber: string) {
  return accounts.find((account) => account.accountNumber === accountNumber);
}

export function listAccounts() {
  return accounts;
}

export function listTransactions() {
  return transactions;
}

export function listReportedAccounts() {
  return reportedAccounts;
}

export function listEscrowCases() {
  return state.escrowCases;
}

export function getEscrowCase(id: string) {
  const existing = state.escrowCases.find((item) => item.caseId === id);
  if (existing) return existing;

  if (/^RKB-2026-\d{6}$/.test(id)) {
    const restored: EscrowCase = {
      caseId: id,
      itemName: "iPhone 13 128GB Midnight",
      itemDescription:
        "Restored demo escrow case after dev server restart. Used, fullset box, battery health 88%, listed via Facebook group.",
      sellerUsername: "fb.com/market.aris",
      buyerUsername: "fb.com/dina.securebuy",
      sellerAccount: "1234567890",
      buyerAccount: "6611223344",
      amount: 6500000,
      escrowFee: 65000,
      courier: "JNE",
      trackingNumber: undefined,
      status: "Link Created",
      createdAt: new Date().toISOString(),
      releaseDeadline: new Date(Date.now() + 3 * 24 * 60 * 60 * 1000).toISOString(),
      disputeStatus: "None"
    };
    state.escrowCases.unshift(restored);
    return restored;
  }

  return undefined;
}

export function createEscrowCase(input: Omit<EscrowCase, "caseId" | "createdAt" | "releaseDeadline" | "status" | "disputeStatus">) {
  const caseId = `RKB-2026-${String(129 + state.escrowCases.length + 1).padStart(6, "0")}`;
  const createdAt = new Date().toISOString();
  const releaseDeadline = new Date(Date.now() + 3 * 24 * 60 * 60 * 1000).toISOString();
  const escrow: EscrowCase = {
    ...input,
    caseId,
    status: "Link Created",
    createdAt,
    releaseDeadline,
    disputeStatus: "None"
  };
  state.escrowCases.unshift(escrow);
  return escrow;
}

export function updateEscrowCase(id: string, patch: Partial<EscrowCase>) {
  const index = state.escrowCases.findIndex((item) => item.caseId === id);
  if (index === -1) return undefined;
  state.escrowCases[index] = { ...state.escrowCases[index], ...patch };
  return state.escrowCases[index];
}

export function getDisputeByCaseId(caseId: string) {
  return state.disputes.find((item) => item.caseId === caseId);
}

export function createOrUpdateDispute(caseId: string, input: Partial<Dispute>) {
  const existing = getDisputeByCaseId(caseId);
  if (existing) {
    Object.assign(existing, input);
    return existing;
  }
  const dispute: Dispute = {
    disputeId: `DSP-2026-${String(100 + state.disputes.length).padStart(4, "0")}`,
    caseId,
    buyerComplaint: input.buyerComplaint ?? "Pembeli meminta pencairan dana ditahan.",
    evidenceStatus: input.evidenceStatus ?? "Uploaded",
    aiSummary:
      input.aiSummary ??
      "Komplain pembeli, status kurir, dan riwayat penjual menunjukkan dana perlu tetap ditahan saat staff meninjau bukti.",
    aiRecommendation:
      input.aiRecommendation ??
      "Rekomendasi AI: tahan dana dan eskalasi ke staff bank. AI hanya pendukung keputusan; keputusan akhir harus dibuat staff bank berwenang.",
    createdAt: new Date().toISOString(),
    staffDecision: input.staffDecision
  };
  state.disputes.unshift(dispute);
  updateEscrowCase(caseId, { status: "Disputed", disputeStatus: "Open" });
  return dispute;
}

function initialChatMessages(escrow: EscrowCase): RekberChatMessage[] {
  const baseTime = new Date(escrow.createdAt).getTime();
  return [
    {
      messageId: `${escrow.caseId}-CHAT-001`,
      caseId: escrow.caseId,
      senderRole: "ai",
      senderName: "AI Rekber Bank",
      message:
        `Ruang Rekber resmi dibuat untuk ${escrow.itemName}. Saya akan menjadi penengah otomatis. Pembeli hanya membayar lewat tombol pembayaran di aplikasi bank, bukan lewat screenshot atau rekening chat luar.`,
      timestamp: new Date(baseTime + 60_000).toISOString()
    },
    {
      messageId: `${escrow.caseId}-CHAT-002`,
      caseId: escrow.caseId,
      senderRole: "seller",
      senderName: "Penjual",
      message: `Saya jual ${escrow.itemName}. Harga ${new Intl.NumberFormat("id-ID", { style: "currency", currency: "IDR", maximumFractionDigits: 0 }).format(escrow.amount)}.`,
      timestamp: new Date(baseTime + 120_000).toISOString()
    },
    {
      messageId: `${escrow.caseId}-CHAT-003`,
      caseId: escrow.caseId,
      senderRole: "buyer",
      senderName: "Pembeli",
      message: "Saya setuju pakai Rekber Bank. Tolong AI pantau sampai barang/data diterima.",
      timestamp: new Date(baseTime + 180_000).toISOString()
    },
    {
      messageId: `${escrow.caseId}-CHAT-004`,
      caseId: escrow.caseId,
      senderRole: "ai",
      senderName: "AI Rekber Bank",
      message:
        "Aturan aman: penjual jangan kirim barang, kode akun, email, password, atau data digital sebelum status di aplikasi berubah menjadi Funds Secured. Bukti transfer dari chat luar tidak cukup.",
      timestamp: new Date(baseTime + 240_000).toISOString()
    }
  ];
}

export function getRekberChatMessages(caseId: string) {
  const escrow = getEscrowCase(caseId);
  if (!escrow) return undefined;
  if (!state.chatMessages.has(caseId)) {
    state.chatMessages.set(caseId, initialChatMessages(escrow));
  }
  return state.chatMessages.get(caseId);
}

function aiReplyFor(escrow: EscrowCase, message: string, senderRole: ChatSenderRole): string {
  const text = message.toLowerCase();
  const fundsSecured = ["Funds Secured", "Waiting Shipment", "In Transit", "Delivered", "Waiting Buyer Confirmation", "Auto-release Pending"].includes(escrow.status);

  if (/(sudah transfer|sudah bayar|bukti|struk|receipt|dana sudah masuk|noreff|ref|reff)/.test(text)) {
    return fundsSecured
      ? "Saya sudah melihat status dana aman di sistem bank: Funds Secured. Penjual boleh lanjut kirim barang atau data sesuai kesepakatan, lalu masukkan resi/tracking di aplikasi."
      : "Saya belum melihat dana masuk di sistem bank. Jangan kirim barang, akun, password, OTP, atau data digital hanya berdasarkan screenshot. Pembeli harus menekan tombol pembayaran resmi di halaman Rekber.";
  }

  if (/(kirim|serahkan|akun|password|email|otp|data)/.test(text)) {
    return fundsSecured
      ? "Status dana sudah aman. Penjual tetap kirim data hanya lewat prosedur yang disepakati, simpan bukti serah-terima, dan jangan bagikan OTP."
      : "Tahan dulu. Dana belum tercatat aman di escrow bank. AI Rekber tidak mengizinkan pelepasan barang atau data sebelum pembayaran resmi terkonfirmasi di aplikasi.";
  }

  if (/(resi|tracking|kurir|jne|j&t|sicepat|anteraja|dikirim)/.test(text)) {
    return "Jika barang sudah dikirim, penjual perlu mengisi nomor resi di halaman tracking. Saya akan memantau status mocked courier dan menahan dana sampai delivered atau ada dispute.";
  }

  if (/(komplain|dispute|kosong|tidak sesuai|salah barang|hold|tahan)/.test(text)) {
    return "Saya akan membantu membuat ringkasan dispute sebagai decision support. Dana harus ditahan dan eskalasi ke staff bank jika bukti pembeli menunjukkan barang/data tidak sesuai.";
  }

  if (senderRole === "seller") {
    return "Catatan untuk penjual: tunggu indikator Funds Secured di aplikasi ini. Jangan percaya grup rekber luar, screenshot transfer, atau pesan yang memaksa pengiriman cepat.";
  }

  return "Catatan untuk pembeli: lakukan pembayaran hanya melalui tombol resmi di halaman Rekber. AI Rekber membantu memandu transaksi, tetapi keputusan dispute tetap oleh staff bank.";
}

export function addRekberChatMessage(caseId: string, senderRole: ChatSenderRole, message: string) {
  const escrow = getEscrowCase(caseId);
  if (!escrow) return undefined;
  const messages = getRekberChatMessages(caseId);
  if (!messages) return undefined;
  const senderName = senderRole === "seller" ? "Penjual" : senderRole === "buyer" ? "Pembeli" : "AI Rekber Bank";
  const userMessage: RekberChatMessage = {
    messageId: `${caseId}-CHAT-${String(messages.length + 1).padStart(3, "0")}`,
    caseId,
    senderRole,
    senderName,
    message,
    timestamp: new Date().toISOString()
  };
  messages.push(userMessage);

  if (senderRole !== "ai") {
    messages.push({
      messageId: `${caseId}-CHAT-${String(messages.length + 1).padStart(3, "0")}`,
      caseId,
      senderRole: "ai",
      senderName: "AI Rekber Bank",
      message: aiReplyFor(escrow, message, senderRole),
      timestamp: new Date(Date.now() + 800).toISOString(),
      metadata: { automated: true, escrowStatus: escrow.status }
    });
  }

  return messages;
}

export function dashboardSummary() {
  const suspiciousToday = transactions.filter((tx) => tx.riskScore >= 61).length;
  const highRiskAccounts = accounts.filter((account) => account.riskScore >= 61).length;
  const activeEscrow = state.escrowCases.filter((item) => !["Released to Seller"].includes(item.status)).length;
  const pendingDisputes = state.disputes.filter((item) => !item.staffDecision).length;
  return {
    suspiciousToday,
    highRiskAccounts,
    lossPrevented: 438500000,
    activeEscrow,
    pendingDisputes,
    riskTrend: [
      { hour: "06:00", low: 18, medium: 7, high: 3 },
      { hour: "09:00", low: 24, medium: 10, high: 8 },
      { hour: "12:00", low: 21, medium: 13, high: 11 },
      { hour: "15:00", low: 26, medium: 15, high: 14 },
      { hour: "18:00", low: 18, medium: 19, high: 17 },
      { hour: "21:00", low: 13, medium: 16, high: 12 }
    ]
  };
}

export function dashboardAlerts() {
  return transactions
    .filter((tx) => tx.riskScore >= 60)
    .slice(0, 12)
    .map((tx) => ({
      ...tx,
      receiver: accounts.find((account) => account.accountNumber === tx.receiverAccount)
    }));
}

export function dashboardGraph() {
  return { nodes: graphNodes, edges: graphEdges };
}

export function dashboardCases() {
  const disputeCases = state.disputes.slice(0, 2).map((dispute) => ({
    caseId: dispute.caseId,
    type: "Rekber Dispute" as const,
    riskScore: dispute.caseId === "RKB-2026-000129" ? 82 : 65,
    status: dispute.staffDecision ? ("Resolved" as const) : ("Escalated" as const),
    assignedAnalyst: "Bima Santika",
    lastUpdate: dispute.createdAt,
    title: dispute.buyerComplaint
  }));
  return [...disputeCases, ...analystCases];
}

export function getAuditLogs() {
  return auditLogs;
}
