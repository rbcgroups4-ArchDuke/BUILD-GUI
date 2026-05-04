export function riskLevelLabel(value: string) {
  const labels: Record<string, string> = {
    Safe: "Aman",
    Caution: "Waspada",
    "High Risk": "Risiko Tinggi",
    Critical: "Risiko Kritis"
  };
  return labels[value] ?? value;
}

export function statusLabel(value: string) {
  const labels: Record<string, string> = {
    Draft: "Draf",
    "Link Created": "Link Dibuat",
    "Funds Secured": "Dana Diamankan",
    "Waiting Shipment": "Menunggu Pengiriman",
    "In Transit": "Dalam Pengiriman",
    Delivered: "Terkirim",
    "Waiting Buyer Confirmation": "Menunggu Konfirmasi Pembeli",
    "Auto-release Pending": "Menunggu Rilis Otomatis",
    "Released to Seller": "Dicairkan ke Penjual",
    Disputed: "Disengketakan",
    New: "Baru",
    "Under Review": "Sedang Ditinjau",
    "Waiting Evidence": "Menunggu Bukti",
    Escalated: "Dieskalasi",
    Resolved: "Selesai",
    Uploaded: "Diunggah",
    Reviewed: "Ditinjau",
    "Pending Upload": "Menunggu Unggahan",
    None: "Tidak Ada",
    Open: "Terbuka",
    Verified: "Terverifikasi",
    Partial: "Sebagian",
    Pending: "Menunggu"
  };
  return labels[value] ?? riskLevelLabel(value);
}

export function caseTypeLabel(value: string) {
  const labels: Record<string, string> = {
    "Fraud Alert": "Peringatan Fraud",
    "Rekber Dispute": "Sengketa Rekber",
    "Reported Account": "Rekening Dilaporkan"
  };
  return labels[value] ?? value;
}

export function fraudCategoryLabel(value: string) {
  const labels: Record<string, string> = {
    "Triangle transaction": "Transaksi segitiga",
    "Fake marketplace seller": "Penjual marketplace palsu",
    "Fake rekber group impersonation": "Penyamaran grup rekber palsu",
    "Rapid cash-out mule": "Mule dengan cash-out cepat",
    "Account takeover": "Pengambilalihan rekening",
    "Escrow impersonation": "Penyamaran escrow"
  };
  return labels[value] ?? value;
}

export function graphNodeLabel(value: string) {
  const labels: Record<string, string> = {
    "Victim A": "Korban A",
    "Victim B": "Korban B",
    "Victim C": "Korban C",
    "Suspicious Account": "Rekening Mencurigakan",
    "Mule Account": "Rekening Mule",
    "External Account": "Rekening Eksternal"
  };
  return labels[value] ?? value;
}

export function caseTitleLabel(value: string) {
  const labels: Record<string, string> = {
    "Triangle fraud pattern linked to account ending 7890": "Pola fraud segitiga terkait rekening berakhiran 7890",
    "Empty package dispute for RKB-2026-000129": "Sengketa paket kosong untuk RKB-2026-000129",
    "Reported seller account requires evidence review": "Rekening penjual dilaporkan dan perlu tinjauan bukti",
    "Rapid incoming transfers from unrelated senders": "Transfer masuk cepat dari pengirim tidak terkait",
    "Courier evidence mismatch in escrow case": "Bukti kurir tidak cocok dalam kasus escrow",
    "Mule chain connected to external wallet": "Rantai mule terhubung ke wallet eksternal",
    "Customer report pending verification": "Laporan nasabah menunggu verifikasi",
    "Potential account takeover signal": "Sinyal potensi pengambilalihan rekening",
    "Resolved rekber release request": "Permintaan pencairan rekber selesai",
    "Social commerce transaction cluster": "Klaster transaksi social commerce"
  };
  return labels[value] ?? value;
}
