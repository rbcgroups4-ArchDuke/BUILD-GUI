"use client";

import Link from "next/link";
import { motion } from "framer-motion";
import { AlertTriangle, CheckCircle2, Network, ShieldCheck, Wallet } from "lucide-react";
import { buttonVariants } from "@/components/ui/button";
import { Card, CardContent } from "@/components/ui/card";
import { RiskScoreCard } from "@/components/risk-score-card";

function AnimatedLines() {
  return (
    <svg className="absolute inset-0 h-full w-full opacity-60" aria-hidden="true">
      <defs>
        <linearGradient id="line" x1="0" x2="1" y1="0" y2="0">
          <stop offset="0%" stopColor="#2563eb" stopOpacity="0" />
          <stop offset="50%" stopColor="#06b6d4" stopOpacity=".9" />
          <stop offset="100%" stopColor="#10b981" stopOpacity="0" />
        </linearGradient>
      </defs>
      {[80, 160, 240].map((y, index) => (
        <motion.path
          key={y}
          d={`M 30 ${y} C 210 ${y - 90}, 260 ${y + 90}, 470 ${y - 20}`}
          stroke="url(#line)"
          strokeWidth="2"
          fill="none"
          strokeDasharray="9 12"
          animate={{ strokeDashoffset: [0, -80] }}
          transition={{ duration: 4 + index, repeat: Infinity, ease: "linear" }}
        />
      ))}
    </svg>
  );
}

export function HeroSection() {
  return (
    <section className="relative overflow-hidden bg-[#020617]">
      <div className="absolute inset-0 bg-radial-grid" />
      <div className="animated-grid absolute inset-0" />
      <div className="mx-auto grid min-h-[calc(100vh-4rem)] max-w-7xl items-center gap-10 px-4 pb-44 pt-20 sm:px-6 lg:grid-cols-[0.9fr_1.1fr] lg:px-8 lg:pb-48 lg:pt-20">
        <motion.div initial={{ opacity: 0, y: 24 }} animate={{ opacity: 1, y: 0 }} transition={{ duration: 0.7 }}>
          <p className="mb-4 inline-flex rounded-full border border-cyan-400/25 bg-cyan-500/10 px-3 py-1 text-sm text-cyan-100">
            Pendukung keputusan fraud setara bank untuk social commerce
          </p>
          <h1 className="max-w-3xl text-balance text-5xl font-semibold tracking-normal text-white sm:text-6xl">
            mAIst
          </h1>
          <p className="mt-6 max-w-2xl text-balance text-lg leading-8 text-slate-300">
            Deteksi fraud real-time, skor risiko rekening, dan rekber bank aman untuk mencegah penipuan transaksi segitiga.
          </p>
          <div className="mt-8 flex flex-col gap-3 sm:flex-row">
            <Link href="/fraud-check" className={buttonVariants({ size: "lg" })}>
              <ShieldCheck className="h-4 w-4" />
              Coba Demo Cek Fraud
            </Link>
            <Link href="/dashboard" className={buttonVariants({ variant: "outline", size: "lg" })}>
              <Network className="h-4 w-4" />
              Buka Dashboard Analis
            </Link>
          </div>
          <p className="mt-5 text-sm text-slate-500">
            Data demo saja. Integrasi masa depan dimungkinkan, tetapi belum terhubung ke bank, regulator, marketplace, kurir, atau sistem pelaporan rekening mana pun.
          </p>
        </motion.div>

        <motion.div
          initial={{ opacity: 0, scale: 0.96, y: 24 }}
          animate={{ opacity: 1, scale: 1, y: 0 }}
          transition={{ duration: 0.8, delay: 0.12 }}
          className="relative min-h-[560px]"
        >
          <AnimatedLines />
          <div className="absolute right-0 top-10 w-[86%] animate-float">
            <Card className="overflow-hidden border-blue-400/25">
              <CardContent className="p-5">
                <div className="mb-5 flex items-center justify-between">
                  <div>
                    <p className="text-sm text-slate-400">Kokpit analis</p>
                    <p className="font-semibold">Klaster fraud segitiga</p>
                  </div>
                  <span className="rounded-full border border-red-400/30 bg-red-500/10 px-3 py-1 text-xs text-red-200">
            Peringatan kritis
                  </span>
                </div>
                <div className="grid gap-4 md:grid-cols-[0.8fr_1.2fr]">
                  <RiskScoreCard score={87} level="Critical" compact />
                  <div className="rounded-lg border border-slate-500/20 bg-slate-950/45 p-4">
                    <div className="mb-4 flex items-center gap-2 text-sm font-semibold">
                      <Network className="h-4 w-4 text-cyan-300" />
                      Graf rekening mencurigakan
                    </div>
                    <div className="relative h-44">
                          {["Korban A", "Korban B", "Mencurigakan", "Mule", "E-wallet"].map((label, index) => (
                        <div
                          key={label}
                          className="absolute flex h-16 w-16 items-center justify-center rounded-full border text-center text-[10px]"
                          style={{
                            left: [0, 0, 120, 260, 260][index],
                            top: [0, 100, 52, 10, 108][index],
                            borderColor: ["#2563eb", "#2563eb", "#ef4444", "#8b5cf6", "#06b6d4"][index],
                            background: "rgba(15,23,42,.9)"
                          }}
                        >
                          {label}
                        </div>
                      ))}
                    </div>
                  </div>
                </div>
                <div className="mt-4 grid gap-4 md:grid-cols-2">
                  <div className="rounded-lg border border-emerald-400/20 bg-emerald-500/10 p-4">
                    <p className="mb-2 flex items-center gap-2 text-sm font-semibold text-emerald-100">
                      <Wallet className="h-4 w-4" />
                      Status transaksi rekber
                    </p>
                    <p className="text-sm text-slate-300">Dana diamankan. Menunggu pengiriman penjual.</p>
                  </div>
                  <div className="rounded-lg border border-amber-400/20 bg-amber-500/10 p-4">
                    <p className="mb-2 flex items-center gap-2 text-sm font-semibold text-amber-100">
                      <AlertTriangle className="h-4 w-4" />
                      Panel peringatan fraud
                    </p>
                    <p className="text-sm text-slate-300">Cash-out cepat dan laporan terkait terdeteksi.</p>
                  </div>
                </div>
              </CardContent>
            </Card>
          </div>
          <div className="absolute -bottom-28 left-1/2 w-80 -translate-x-1/2 rounded-lg border border-cyan-400/20 bg-slate-950/88 p-4 shadow-panel backdrop-blur-xl">
            <p className="mb-3 flex items-center gap-2 text-sm font-semibold">
              <CheckCircle2 className="h-4 w-4 text-emerald-300" />
              Tinjauan manusia tetap wajib
            </p>
            <p className="text-sm text-slate-400">
              mAIst membantu menjelaskan risiko. Keputusan sengketa dan pembekuan tetap dibuat oleh staff bank berwenang.
            </p>
          </div>
        </motion.div>
      </div>
    </section>
  );
}
