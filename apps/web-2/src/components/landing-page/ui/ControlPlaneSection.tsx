"use client"

import { useState } from "react"
import {
  ArrowDown,
  CheckCircle2,
  Database,
  GitBranch,
  Phone,
  ShieldCheck,
  Users,
} from "lucide-react"

type ChannelId = "support" | "sales" | "vip"

type AuditLog = {
  time: string
  threadId: string
  action: string
  grounding: string
  latency: string
}

type ChannelConfig = {
  id: ChannelId
  label: string
  number: string
  team: string
  volume: string
  routeRule: string
  targetAgent: string
  knowledgeSource: string
  lastSync: string
  auditLogs: AuditLog[]
}

const CHANNELS: ChannelConfig[] = [
  {
    id: "support",
    label: "Support & Order Tracking",
    number: "+62 812-8840-1920",
    team: "CX Operations · 4 Agents",
    volume: "Sample channel · Support",
    routeRule: "Intent: Order / Return → Store Policies + Order Status",
    targetAgent: "Support Resolver (Gemini 2.5 Flash)",
    knowledgeSource: "Store_FAQ.md + Return_Policy_2026.pdf",
    lastSync: "Synced recently",
    auditLogs: [
      {
        time: "13:42:18",
        threadId: "wa_9921a",
        action: "Looked up order status #WB-8821 in sample catalog",
        grounding: "order_status_db",
        latency: "1.4s",
      },
      {
        time: "13:40:11",
        threadId: "wa_9918c",
        action: "Escalated damaged packaging inquiry to operator queue",
        grounding: "handoff_rule_damaged_goods",
        latency: "0.9s",
      },
      {
        time: "13:38:56",
        threadId: "wa_9914f",
        action: "Answered shipping coverage and hours for Bandung",
        grounding: "support-hours.md",
        latency: "1.2s",
      },
    ],
  },
  {
    id: "sales",
    label: "Inbound Inquiries & Catalog",
    number: "+62 811-7720-4410",
    team: "Sales Team · 2 Agents",
    volume: "Sample channel · Sales",
    routeRule: "Intent: Catalog / Hampers → Product Price List RAG",
    targetAgent: "Catalog Inquiries Assistant",
    knowledgeSource: "Hampers_Catalog_2026.pdf + Price_List.md",
    lastSync: "Synced recently",
    auditLogs: [
      {
        time: "13:41:22",
        threadId: "wa_4410b",
        action: "Shared catalog details for Corporate Hampers package",
        grounding: "catalog_pricing_matrix",
        latency: "1.6s",
      },
      {
        time: "13:35:49",
        threadId: "wa_4408e",
        action: "Verified product availability for Jakarta delivery",
        grounding: "catalog_inventory_sample",
        latency: "1.1s",
      },
      {
        time: "13:28:30",
        threadId: "wa_4401d",
        action: "Noted custom greeting card request for sales follow-up",
        grounding: "operator_internal_note",
        latency: "0.8s",
      },
    ],
  },
  {
    id: "vip",
    label: "Corporate & B2B Inquiries",
    number: "+62 815-9012-3044",
    team: "Account Team · 2 Agents",
    volume: "Sample channel · B2B",
    routeRule: "Intent: B2B / Invoicing → B2B Terms + SLA Rules",
    targetAgent: "Corporate Inquiries Assistant",
    knowledgeSource: "B2B_Terms.md + Invoicing_Guide.pdf",
    lastSync: "Synced recently",
    auditLogs: [
      {
        time: "13:39:05",
        threadId: "wa_7102x",
        action: "Answered invoice payment terms (TOP 14 days sample)",
        grounding: "b2b_terms.md",
        latency: "1.5s",
      },
      {
        time: "13:31:12",
        threadId: "wa_7099z",
        action: "Redacted phone number before logging conversation trace",
        grounding: "privacy_pii_rule",
        latency: "0.4s",
      },
      {
        time: "13:22:44",
        threadId: "wa_7095k",
        action: "Verified webhook signature from Meta Cloud API",
        grounding: "meta_signature_valid",
        latency: "1.1s",
      },
    ],
  },
]

export function ControlPlaneSection() {
  const [activeId, setActiveId] = useState<ChannelId>("support")
  const activeChannel =
    CHANNELS.find((channel) => channel.id === activeId) ?? CHANNELS[0]

  return (
    <section
      id="agent-orchestration"
      aria-labelledby="management-title"
      className="mx-auto w-full max-w-6xl scroll-mt-24 px-4 xl:px-0"
    >
      <div className="relative overflow-hidden rounded-2xl border border-zinc-800 bg-[#09090B] text-white shadow-2xl">
        <div className="border-b border-white/[0.08] p-6 lg:p-8">
          <div className="flex flex-wrap items-center justify-between gap-4">
            <div>
              <div className="flex items-center gap-2">
                <span className="flex size-2 rounded-full bg-emerald-400" />
                <h3
                  id="management-title"
                  className="text-xs font-semibold uppercase tracking-wider text-violet-400"
                >
                  Workspace Architecture
                </h3>
                <span className="rounded-md border border-white/20 bg-white/10 px-2 py-0.5 text-[10px] text-zinc-300">
                  Sample Data
                </span>
              </div>
              <h2 className="mt-2 text-2xl font-semibold tracking-tight text-white sm:text-3xl">
                Multi-channel routing and audit logs
              </h2>
              <p className="mt-2 max-w-2xl text-xs text-zinc-400 leading-relaxed sm:text-sm">
                Each WhatsApp number maps to a specific knowledge context, agent
                configuration, and human team, keeping execution auditable.
              </p>
            </div>
            <div className="flex items-center gap-2 rounded-lg border border-white/10 bg-white/5 px-3 py-1.5 text-xs text-zinc-400 font-mono">
              <ShieldCheck className="size-4 text-emerald-400" />
              <span>Signed Webhook Ingress</span>
            </div>
          </div>
        </div>

        <div className="grid grid-cols-1 lg:grid-cols-12 divide-y lg:divide-y-0 lg:divide-x divide-white/[0.08]">
          {/* Channel selector (4 cols) */}
          <div className="p-5 lg:col-span-4 space-y-3">
            <span className="font-mono text-[11px] uppercase tracking-wider text-zinc-400 block mb-3">
              1. Configured WhatsApp Channels
            </span>

            {CHANNELS.map((ch) => {
              const isSelected = ch.id === activeId
              return (
                <button
                  key={ch.id}
                  onClick={() => setActiveId(ch.id)}
                  className={`w-full text-left p-3.5 rounded-xl border transition-all ${
                    isSelected
                      ? "border-violet-500 bg-violet-500/10 text-white"
                      : "border-white/[0.07] bg-white/[0.02] text-zinc-400 hover:border-white/20 hover:text-zinc-200"
                  }`}
                >
                  <div className="flex items-center justify-between">
                    <span className="font-medium text-xs text-zinc-100">
                      {ch.label}
                    </span>
                    <span className="font-mono text-[10px] text-emerald-400">
                      Active
                    </span>
                  </div>
                  <div className="mt-1 flex items-center gap-2 text-[11px] text-zinc-400 font-mono">
                    <Phone className="size-3 text-zinc-500" />
                    <span>{ch.number}</span>
                  </div>
                  <div className="mt-2 text-[10px] text-zinc-500 flex items-center gap-1.5">
                    <Users className="size-3" />
                    <span>{ch.team}</span>
                  </div>
                </button>
              )
            })}
          </div>

          {/* Active routing flow (4 cols) */}
          <div className="p-5 lg:col-span-4 space-y-4">
            <span className="font-mono text-[11px] uppercase tracking-wider text-zinc-400 block">
              2. Routing Policy & Context
            </span>

            <div className="rounded-xl border border-white/10 bg-black/40 p-4 space-y-3">
              <div className="flex items-center justify-between text-xs">
                <span className="font-medium text-zinc-200 flex items-center gap-1.5">
                  <GitBranch className="size-3.5 text-violet-400" />
                  Routing Rule
                </span>
                <span className="font-mono text-[10px] text-violet-400">
                  Evaluated on Ingress
                </span>
              </div>
              <p className="font-mono text-xs text-zinc-300 bg-black/60 p-2.5 rounded-lg border border-white/5">
                {activeChannel.routeRule}
              </p>
            </div>

            <div className="flex justify-center text-zinc-600">
              <ArrowDown className="size-4" />
            </div>

            <div className="rounded-xl border border-white/10 bg-black/40 p-4 space-y-2">
              <div className="flex items-center justify-between text-xs">
                <span className="font-medium text-zinc-200 flex items-center gap-1.5">
                  <Database className="size-3.5 text-emerald-400" />
                  Connected Knowledge
                </span>
                <span className="font-mono text-[10px] text-emerald-400">
                  {activeChannel.lastSync}
                </span>
              </div>
              <p className="font-mono text-xs text-zinc-400 bg-black/60 p-2.5 rounded-lg border border-white/5">
                {activeChannel.knowledgeSource}
              </p>
            </div>
          </div>

          {/* Audit Logs (4 cols) */}
          <div className="p-5 lg:col-span-4 space-y-3">
            <div className="flex items-center justify-between">
              <span className="font-mono text-[11px] uppercase tracking-wider text-zinc-400">
                3. Sample Audit Trace
              </span>
              <span className="font-mono text-[10px] text-zinc-500">
                Recent Events
              </span>
            </div>

            <div className="space-y-2.5">
              {activeChannel.auditLogs.map((log, idx) => (
                <div
                  key={idx}
                  className="rounded-xl border border-white/[0.08] bg-black/50 p-3 text-xs"
                >
                  <div className="flex items-center justify-between font-mono text-[10px] text-zinc-500">
                    <span>
                      {log.time} · {log.threadId}
                    </span>
                    <span className="text-zinc-400">{log.latency}</span>
                  </div>
                  <p className="mt-1 text-zinc-200 leading-snug">{log.action}</p>
                  <div className="mt-2 flex items-center gap-1 font-mono text-[10px] text-emerald-400">
                    <CheckCircle2 className="size-3" />
                    <span className="truncate">Source: {log.grounding}</span>
                  </div>
                </div>
              ))}
            </div>
          </div>
        </div>
      </div>
    </section>
  )
}
