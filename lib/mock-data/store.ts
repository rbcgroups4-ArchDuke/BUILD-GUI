import type { ChatSenderRole, Dispute, EscrowCase, RekberChatMessage } from "@/types";
import { detectSuspiciousRekberSignals } from "@/lib/ai/rekber-assistant";
import { REKBER_ASSISTANT_NAME } from "@/lib/rekber/assistant-config";
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
      escrowFee: 100000,
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
      "Rekomendasi mAIst: tahan dana dan eskalasi ke staff bank. mAIst hanya pendukung keputusan; keputusan akhir harus dibuat staff bank berwenang.",
    createdAt: new Date().toISOString(),
    staffDecision: input.staffDecision
  };
  state.disputes.unshift(dispute);
  updateEscrowCase(caseId, { status: "Disputed", disputeStatus: "Open" });
  return dispute;
}

function hasTransferProof(text: string) {
  return /(bukti transfer|foto transfer|struk transfer|receipt|screenshot transfer|sudah transfer|sudah bayar|transfer bank|bukti tf)/.test(text);
}

function hasShippingProof(text: string) {
  return /(nomor resi|resi|video packing|foto packing|bukti pengiriman|sudah kirim|barang dikirim|jne|j&t|sicepat|anteraja)/.test(text);
}

function hasBuyerReceivedConfirmation(text: string) {
  return /(barang sudah diterima|barang diterima|sudah diterima|kondisi baik|barang aman|sesuai deskripsi|barang sesuai)/.test(text);
}

function hasPayoutDetails(text: string) {
  return /(bca|bri|bni|mandiri|seabank|bank|dana|gopay|ovo|norek|nomor rekening|atas nama)/.test(text) && /\d{6,}/.test(text);
}

function buildChatMetadata(senderRole: ChatSenderRole, message: string) {
  const text = message.toLowerCase();

  if (senderRole === "buyer" && hasTransferProof(text)) {
    return {
      attachmentType: "image",
      attachmentUrl: "/demo/images/simulasi-transfer-6600000.png",
      attachmentLabel: "Bukti transfer simulasi Rp 6.600.000"
    } satisfies Record<string, string>;
  }

  if (senderRole === "buyer" && hasBuyerReceivedConfirmation(text)) {
    return {
      attachmentType: "video",
      attachmentUrl: "/demo/videos/simulasivideounboxing.mp4",
      attachmentLabel: "simulasivideounboxing.mp4"
    } satisfies Record<string, string>;
  }

  return undefined;
}

function extractTrackingNumber(text: string) {
  const match = text.match(/[A-Z]{2,6}[-\s]?\d{4,}[-\s]?[A-Z0-9]{0,6}/i);
  return match ? match[0].replace(/\s+/g, "-") : undefined;
}

function pushAutomatedMessage(
  messages: RekberChatMessage[],
  caseId: string,
  senderRole: ChatSenderRole,
  senderName: string,
  message: string,
  metadata?: Record<string, string | number | boolean>
) {
  messages.push({
    messageId: `${caseId}-CHAT-${String(messages.length + 1).padStart(3, "0")}`,
    caseId,
    senderRole,
    senderName,
    message,
    timestamp: new Date(Date.now() + messages.length * 800).toISOString(),
    metadata
  });
}

function maybeAdvanceEscrowStatus(caseId: string, senderRole: ChatSenderRole, message: string) {
  const escrow = getEscrowCase(caseId);
  if (!escrow) return undefined;

  const text = message.toLowerCase();

  if (senderRole === "buyer" && hasTransferProof(text) && ["Link Created", "Draft"].includes(escrow.status)) {
    return updateEscrowCase(caseId, { status: "Funds Secured" });
  }

  if (senderRole === "seller" && hasShippingProof(text) && ["Funds Secured", "Waiting Shipment"].includes(escrow.status)) {
    return updateEscrowCase(caseId, {
      status: "In Transit",
      trackingNumber: extractTrackingNumber(message) ?? escrow.trackingNumber
    });
  }

  if (senderRole === "buyer" && hasBuyerReceivedConfirmation(text) && ["In Transit", "Funds Secured", "Waiting Buyer Confirmation"].includes(escrow.status)) {
    return updateEscrowCase(caseId, { status: "Delivered" });
  }

  if (senderRole === "seller" && hasPayoutDetails(text) && ["Delivered", "Auto-release Pending", "Waiting Buyer Confirmation"].includes(escrow.status)) {
    return updateEscrowCase(caseId, { status: "Released to Seller" });
  }

  return escrow;
}

function buildTransactionSummary(escrow: EscrowCase) {
  const total = escrow.amount + escrow.escrowFee;
  return [
    "Format transaksi Rekber:",
    `Penjual: ${escrow.sellerUsername}`,
    `Pembeli: ${escrow.buyerUsername}`,
    `Barang: ${escrow.itemName}`,
    `Deskripsi: ${escrow.itemDescription}`,
    `Harga barang: ${new Intl.NumberFormat("id-ID", { style: "currency", currency: "IDR", maximumFractionDigits: 0 }).format(escrow.amount)}`,
    `Biaya admin: ${new Intl.NumberFormat("id-ID", { style: "currency", currency: "IDR", maximumFractionDigits: 0 }).format(escrow.escrowFee)}`,
    `Total pembayaran: ${new Intl.NumberFormat("id-ID", { style: "currency", currency: "IDR", maximumFractionDigits: 0 }).format(total)}`
  ].join("\n");
}

function buildBuyerUnboxingAcknowledgement() {
  return [
    "Terima kasih atas konfirmasinya.",
    "Bukti video unboxing pembeli sudah saya terima dan kondisi barang dinyatakan baik.",
    "Saya lanjutkan ke tahap pencairan dana untuk penjual."
  ].join("\n");
}

function initialChatMessages(escrow: EscrowCase): RekberChatMessage[] {
  const baseTime = new Date(escrow.createdAt).getTime();
  return [
    {
      messageId: `${escrow.caseId}-CHAT-001`,
      caseId: escrow.caseId,
      senderRole: "ai",
      senderName: REKBER_ASSISTANT_NAME,
      message:
        `Halo, saya ${REKBER_ASSISTANT_NAME} dari AI Rekber. Room resmi untuk transaksi ${escrow.itemName} sudah aktif. Silakan lanjutkan transaksi di room ini, dan pembayaran hanya melalui halaman Rekber resmi.`,
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
      senderRole: "ai",
      senderName: REKBER_ASSISTANT_NAME,
      message: buildTransactionSummary(escrow),
      timestamp: new Date(baseTime + 180_000).toISOString()
    },
    {
      messageId: `${escrow.caseId}-CHAT-004`,
      caseId: escrow.caseId,
      senderRole: "ai",
      senderName: REKBER_ASSISTANT_NAME,
      message:
        `Total yang harus dibayarkan pembeli adalah ${new Intl.NumberFormat("id-ID", { style: "currency", currency: "IDR", maximumFractionDigits: 0 }).format(escrow.amount + escrow.escrowFee)}. Setelah pembeli kirim bukti transfer, saya akan lanjutkan ke tahap pengiriman barang.`,
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
  const suspiciousSignals = detectSuspiciousRekberSignals(message);

  if (suspiciousSignals.length > 0) {
    return `${REKBER_ASSISTANT_NAME} AI Rekber tidak memproses password, OTP, PIN, email pemulihan, atau kode sekunder di chat. Jika transaksi sudah aman, lanjutkan hanya dengan detail pencairan resmi dan bukti serah-terima yang diperlukan.`;
  }

  if (senderRole === "buyer" && hasTransferProof(text) && escrow.status === "Funds Secured") {
    return "Dana sudah saya terima di sistem Rekber. Silakan penjual segera mengirim barang dan kirimkan bukti pengiriman ke chat ini, misalnya nomor resi, foto packing, atau video packing.";
  }

  if (senderRole === "seller" && hasShippingProof(text) && escrow.status === "In Transit") {
    return "Bukti pengiriman sudah saya terima. Pembeli silakan tunggu barang tiba, lalu konfirmasi di chat ini jika barang sudah diterima dalam kondisi baik.";
  }

  if (senderRole === "buyer" && hasBuyerReceivedConfirmation(text) && escrow.status === "Delivered") {
    return buildBuyerUnboxingAcknowledgement();
  }

  if (senderRole === "seller" && hasPayoutDetails(text) && escrow.status === "Released to Seller") {
    return "Baik, detail rekening pencairan sudah saya catat. Dana sedang saya kirim ke rekening penjual. Transaksi selesai, terima kasih telah menggunakan AI Rekber.";
  }

  if (senderRole === "buyer" && /(transfer|bayar|bukti)/.test(text)) {
    return "Terima kasih atas konfirmasinya. Jika pembayaran sudah dilakukan, mohon kirim bukti transfer bank beserta foto atau screenshot transfer di chat ini agar saya cek ke sistem Rekber.";
  }

  if (senderRole === "seller" && /(kirim barang|siap kirim|packing|resi)/.test(text) && ["Funds Secured", "Waiting Shipment"].includes(escrow.status)) {
    return "Silakan penjual kirim barang tersebut dan sertakan bukti pengiriman di chat ini, misalnya nomor resi, foto packing, atau video packing.";
  }

  if (/(komplain|dispute|kosong|tidak sesuai|salah barang|hold|tahan)/.test(text)) {
    return "Baik, saya bantu buka proses sengketa. Dana akan ditahan sementara sambil bukti pembeli dan penjual ditinjau oleh staff bank.";
  }

  if (senderRole === "seller") {
    return "Baik penjual, mohon tunggu konfirmasi pembayaran resmi dari sistem Rekber. Setelah dana diterima, saya akan bantu arahkan tahap pengiriman barang dan pencairan dana.";
  }

  return "Baik pembeli, silakan lanjut sesuai alur Rekber resmi. Jika pembayaran sudah dilakukan, kirim bukti transfer di chat ini agar saya bisa lanjutkan ke tahap pengiriman barang.";
}

function addSimulationFollowUps(messages: RekberChatMessage[], escrow: EscrowCase, senderRole: ChatSenderRole, message: string) {
  const text = message.toLowerCase();

  if (senderRole === "buyer" && hasTransferProof(text) && escrow.status === "Funds Secured") {
    const shippingUpdate = updateEscrowCase(escrow.caseId, {
      status: "In Transit",
      trackingNumber: "JNE-88214409-ID"
    }) ?? escrow;

    pushAutomatedMessage(
      messages,
      escrow.caseId,
      "seller",
      "Penjual",
      `Baik ${REKBER_ASSISTANT_NAME}, barang sudah saya kirim. No resi JNE-88214409-ID, foto packing dan video packing sudah saya kirim di chat ini.`
    );
    pushAutomatedMessage(
      messages,
      escrow.caseId,
      "ai",
      REKBER_ASSISTANT_NAME,
      "Bukti pengiriman dari penjual sudah saya terima. Pembeli silakan tunggu barang tiba, lalu kirim konfirmasi di chat ini jika barang sudah diterima dalam kondisi baik.",
      { automated: true, escrowStatus: shippingUpdate.status }
    );
    return;
  }

  if (senderRole === "buyer" && hasBuyerReceivedConfirmation(text) && escrow.status === "Delivered") {
    pushAutomatedMessage(
      messages,
      escrow.caseId,
      "ai",
      REKBER_ASSISTANT_NAME,
      "Penjual, silakan kirim detail rekening pencairan dana dengan format berikut:\nBank:\nNomor Rekening:\nAtas Nama:",
      { automated: true, escrowStatus: escrow.status }
    );

    pushAutomatedMessage(
      messages,
      escrow.caseId,
      "seller",
      "Penjual",
      `Baik ${REKBER_ASSISTANT_NAME}, berikut detail pencairan dana:\nBank: BRI\nNomor Rekening: 901388301900\nAtas Nama: Muhamad Arga`
    );

    const payoutUpdate = updateEscrowCase(escrow.caseId, { status: "Released to Seller" }) ?? escrow;

    pushAutomatedMessage(
      messages,
      escrow.caseId,
      "ai",
      REKBER_ASSISTANT_NAME,
      "Baik, detail rekening pencairan sudah saya catat. Dana sedang saya kirim ke rekening penjual. Transaksi selesai, terima kasih telah menggunakan AI Rekber.",
      { automated: true, escrowStatus: payoutUpdate.status }
    );
  }
}

export function addRekberChatMessage(caseId: string, senderRole: ChatSenderRole, message: string, aiReply?: string) {
  const escrow = getEscrowCase(caseId);
  if (!escrow) return undefined;
  const messages = getRekberChatMessages(caseId);
  if (!messages) return undefined;
  const senderName = senderRole === "seller" ? "Penjual" : senderRole === "buyer" ? "Pembeli" : REKBER_ASSISTANT_NAME;
  const userMessage: RekberChatMessage = {
    messageId: `${caseId}-CHAT-${String(messages.length + 1).padStart(3, "0")}`,
    caseId,
    senderRole,
    senderName,
    message,
    timestamp: new Date().toISOString(),
    metadata: buildChatMetadata(senderRole, message)
  };
  messages.push(userMessage);
  const latestEscrow = maybeAdvanceEscrowStatus(caseId, senderRole, message) ?? escrow;

  if (senderRole !== "ai") {
    messages.push({
      messageId: `${caseId}-CHAT-${String(messages.length + 1).padStart(3, "0")}`,
      caseId,
      senderRole: "ai",
      senderName: REKBER_ASSISTANT_NAME,
      message: aiReply ?? aiReplyFor(latestEscrow, message, senderRole),
      timestamp: new Date(Date.now() + 800).toISOString(),
      metadata: { automated: true, escrowStatus: latestEscrow.status }
    });
  }

  addSimulationFollowUps(messages, latestEscrow, senderRole, message);

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
