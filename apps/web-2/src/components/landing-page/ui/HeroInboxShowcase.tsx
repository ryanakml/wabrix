"use client"

import { useState } from "react"
import {
  CheckCheck,
  FileText,
  PauseCircle,
  PlayCircle,
  Search,
  Send,
  ShieldCheck,
  Smartphone,
  Sparkles,
  User,
} from "lucide-react"

type ConversationItem = {
  id: string
  name: string
  phone: string
  lastMessage: string
  time: string
  unread?: number
  status: "bot" | "operator" | "resolved"
  channel: string
  messages: {
    sender: "customer" | "bot" | "operator"
    text: string
    time: string
    citations?: string[]
    note?: string
  }[]
}

const SAMPLE_CONVERSATIONS: ConversationItem[] = [
  {
    id: "1",
    name: "Budi Santoso",
    phone: "+62 812-9921-8840",
    lastMessage: "Jam operasional toko sampai jam berapa ya?",
    time: "13:42",
    status: "bot",
    channel: "Support",
    messages: [
      {
        sender: "customer",
        text: "Halo min, mau tanya toko buka jam berapa ya? Dan kalau kirim ke Bandung bisa sampai besok?",
        time: "13:40",
      },
      {
        sender: "bot",
        text: "Halo kak Budi! Toko kami buka setiap hari pukul 09:00 – 17:00 WIB. Untuk pengiriman ke Bandung tersedia opsi Next Day (estimasi sampai esok hari) jika pesanan diselesaikan sebelum pukul 14:00 WIB hari ini. Ada yang bisa kami bantu lagi kak?",
        time: "13:41",
        citations: ["support-hours.md", "delivery-faq.pdf"],
        note: "Grounded with Gemini 2.5 Flash via RAG chunks #12 & #4",
      },
    ],
  },
  {
    id: "2",
    name: "Siti Rahmawati",
    phone: "+62 857-1102-3912",
    lastMessage: "Bisa minta tolong cek status retur #WB-102?",
    time: "12:15",
    status: "operator",
    channel: "Support",
    messages: [
      {
        sender: "customer",
        text: "Siang kak, saya mau tanyakan paket retur #WB-102 apakah sudah diterima tim gudang?",
        time: "12:10",
      },
      {
        sender: "bot",
        text: "Paket retur dengan ID #WB-102 tercatat telah tiba di fasilitas logistik pada 21 Nov, 10:30 WIB. Tim QC kami membutuhkan waktu 1x24 jam kerja untuk pemeriksaan fisik barang.",
        time: "12:11",
        citations: ["return-policy-2026.pdf"],
      },
      {
        sender: "operator",
        text: "Halo kak Siti, saya Ryan dari CX. Saya baru saja koordinasi dengan tim gudang, paket kakak sudah selesai di-cek dan dana refund sedang diproses ke rekening ya kak. Estimasi 1-2 jam lagi.",
        time: "12:15",
        note: "Operator manual takeover · Bot paused",
      },
    ],
  },
  {
    id: "3",
    name: "David Pratama",
    phone: "+62 813-7729-1092",
    lastMessage: "Apakah ada katalog untuk hampers lebaran?",
    time: "Kemarin",
    status: "resolved",
    channel: "Sales",
    messages: [
      {
        sender: "customer",
        text: "Halo kak, apakah sudah ada katalog hampers untuk corporate gift?",
        time: "Kemarin 16:20",
      },
      {
        sender: "bot",
        text: "Halo kak David! Kami memiliki katalog Corporate Hampers 2026 dengan minimum pemesanan 10 paket. File PDF katalog dan daftar harga telah kami siapkan di tautan berikut atau dapat kami kirimkan via dokumen WhatsApp.",
        time: "Kemarin 16:21",
        citations: ["corporate-catalog-2026.pdf"],
      },
    ],
  },
]

export function HeroInboxShowcase() {
  const [selectedId, setSelectedId] = useState("1")
  const [botPaused, setBotPaused] = useState(false)
  const [replyInput, setReplyInput] = useState("")

  const activeConv =
    SAMPLE_CONVERSATIONS.find((c) => c.id === selectedId) ??
    SAMPLE_CONVERSATIONS[0]

  return (
    <div className="relative mx-auto w-full max-w-5xl rounded-2xl border border-gray-200/80 bg-white shadow-2xl shadow-violet-500/5 ring-1 ring-black/5 overflow-hidden">
      {/* App Window Header */}
      <div className="flex flex-wrap items-center justify-between border-b border-gray-100 bg-gray-50/90 px-4 py-2.5 text-xs text-gray-500 backdrop-blur-xs">
        <div className="flex items-center gap-2">
          <div className="flex gap-1.5">
            <div className="size-3 rounded-full bg-rose-400" />
            <div className="size-3 rounded-full bg-amber-400" />
            <div className="size-3 rounded-full bg-emerald-400" />
          </div>
          <span className="ml-2 font-medium text-gray-700">
            Wabrix Shared Messenger
          </span>
          <span className="rounded-md bg-violet-100 px-2 py-0.5 text-[11px] font-medium text-violet-700">
            Hosted Demo
          </span>
        </div>

        <div className="flex items-center gap-3">
          <div className="flex items-center gap-1.5 text-gray-600">
            <Smartphone className="size-3.5 text-emerald-600" />
            <span className="font-mono text-[11px]">+62 812-8840-1920</span>
            <span className="inline-flex items-center gap-1 text-[11px] text-emerald-600">
              <span className="size-1.5 rounded-full bg-emerald-500" />
              Connected
            </span>
          </div>
          <span className="rounded-full border border-gray-200 bg-white px-2 py-0.5 text-[10px] text-gray-500">
            Sample Data
          </span>
        </div>
      </div>

      {/* Main Two-Column Messenger Layout */}
      <div className="grid grid-cols-1 md:grid-cols-12 min-h-[460px]">
        {/* Left: Conversation List (4 cols) */}
        <div className="border-b md:border-b-0 md:border-r border-gray-200 bg-gray-50/50 md:col-span-5 lg:col-span-4 flex flex-col">
          <div className="p-3 border-b border-gray-200/70">
            <div className="relative">
              <Search className="absolute left-2.5 top-2.5 size-3.5 text-gray-400" />
              <input
                type="text"
                readOnly
                placeholder="Search conversations..."
                className="w-full rounded-lg border border-gray-200 bg-white py-1.5 pl-8 pr-3 text-xs text-gray-700 placeholder-gray-400 focus:outline-hidden"
              />
            </div>
            <div className="mt-2.5 flex items-center justify-between text-[11px] text-gray-500">
              <span className="font-medium">Active Threads (3)</span>
              <span className="text-gray-400">WhatsApp Ingress</span>
            </div>
          </div>

          <div className="divide-y divide-gray-100 overflow-y-auto">
            {SAMPLE_CONVERSATIONS.map((conv) => {
              const isSelected = conv.id === selectedId
              return (
                <button
                  key={conv.id}
                  onClick={() => setSelectedId(conv.id)}
                  className={`w-full text-left p-3 transition-colors ${
                    isSelected
                      ? "bg-violet-50/70 border-l-3 border-violet-600"
                      : "hover:bg-gray-100/60"
                  }`}
                >
                  <div className="flex items-center justify-between">
                    <span className="font-medium text-xs text-gray-900 truncate">
                      {conv.name}
                    </span>
                    <span className="text-[10px] text-gray-400">{conv.time}</span>
                  </div>
                  <p className="mt-1 line-clamp-1 text-xs text-gray-500">
                    {conv.lastMessage}
                  </p>
                  <div className="mt-2 flex items-center gap-1.5">
                    {conv.status === "bot" && (
                      <span className="inline-flex items-center gap-1 rounded-full bg-violet-100 px-2 py-0.5 text-[10px] font-medium text-violet-700">
                        <Sparkles className="size-2.5" />
                        Bot Active
                      </span>
                    )}
                    {conv.status === "operator" && (
                      <span className="inline-flex items-center gap-1 rounded-full bg-amber-100 px-2 py-0.5 text-[10px] font-medium text-amber-800">
                        <User className="size-2.5" />
                        Human Active
                      </span>
                    )}
                    {conv.status === "resolved" && (
                      <span className="inline-flex items-center gap-1 rounded-full bg-gray-100 px-2 py-0.5 text-[10px] font-medium text-gray-600">
                        <CheckCheck className="size-2.5" />
                        Resolved
                      </span>
                    )}
                    <span className="text-[10px] text-gray-400">
                      · {conv.channel}
                    </span>
                  </div>
                </button>
              )
            })}
          </div>

          <div className="mt-auto p-3 border-t border-gray-200/70 bg-white/50 text-[11px] text-gray-500 flex items-center justify-between">
            <span className="flex items-center gap-1">
              <ShieldCheck className="size-3 text-emerald-600" />
              Webhook verified
            </span>
            <span className="text-gray-400 font-mono">Meta v23.0</span>
          </div>
        </div>

        {/* Right: Active Chat Area (7 or 8 cols) */}
        <div className="md:col-span-7 lg:col-span-8 flex flex-col bg-white">
          {/* Chat Header */}
          <div className="flex items-center justify-between border-b border-gray-100 px-4 py-3">
            <div>
              <div className="flex items-center gap-2">
                <h3 className="font-semibold text-sm text-gray-900">
                  {activeConv.name}
                </h3>
                <span className="font-mono text-xs text-gray-400">
                  {activeConv.phone}
                </span>
              </div>
              <p className="text-[11px] text-gray-500">
                Routed to: {activeConv.channel} · Meta Cloud API
              </p>
            </div>

            <div className="flex items-center gap-2">
              <button
                onClick={() => setBotPaused(!botPaused)}
                className={`inline-flex items-center gap-1.5 rounded-lg px-2.5 py-1 text-xs font-medium transition-colors ${
                  botPaused
                    ? "bg-amber-100 text-amber-800 hover:bg-amber-200"
                    : "bg-gray-100 text-gray-700 hover:bg-gray-200"
                }`}
                title="Toggle AI bot automation for this conversation"
              >
                {botPaused ? (
                  <>
                    <PlayCircle className="size-3.5 text-amber-700" />
                    <span>Resume Bot</span>
                  </>
                ) : (
                  <>
                    <PauseCircle className="size-3.5 text-gray-600" />
                    <span>Pause Bot (Handoff)</span>
                  </>
                )}
              </button>
            </div>
          </div>

          {/* Conversation Messages */}
          <div className="flex-1 p-4 space-y-4 overflow-y-auto bg-gray-50/30">
            {activeConv.messages.map((msg, idx) => {
              if (msg.sender === "customer") {
                return (
                  <div key={idx} className="flex flex-col items-start max-w-[85%]">
                    <span className="text-[10px] text-gray-400 mb-1 ml-1">
                      {activeConv.name} · {msg.time}
                    </span>
                    <div className="rounded-2xl rounded-tl-sm bg-white p-3.5 text-xs text-gray-800 shadow-xs border border-gray-200/80 leading-relaxed">
                      {msg.text}
                    </div>
                  </div>
                )
              }

              if (msg.sender === "bot") {
                return (
                  <div key={idx} className="flex flex-col items-end ml-auto max-w-[88%]">
                    <div className="flex items-center gap-1.5 mb-1 mr-1 text-[10px] text-violet-700 font-medium">
                      <Sparkles className="size-3" />
                      <span>AI Assistant (Gemini 2.5 Flash)</span>
                      <span className="text-gray-400">· {msg.time}</span>
                    </div>
                    <div className="rounded-2xl rounded-tr-sm bg-violet-600 p-3.5 text-xs text-white shadow-xs leading-relaxed">
                      {msg.text}
                    </div>

                    {msg.citations && msg.citations.length > 0 && (
                      <div className="mt-1.5 flex flex-wrap items-center gap-1.5 mr-1">
                        <span className="text-[10px] text-gray-400">
                          Grounding sources:
                        </span>
                        {msg.citations.map((cite) => (
                          <span
                            key={cite}
                            className="inline-flex items-center gap-1 rounded bg-violet-50 px-2 py-0.5 text-[10px] font-mono text-violet-700 border border-violet-200/60"
                          >
                            <FileText className="size-2.5" />
                            {cite}
                          </span>
                        ))}
                        <span className="inline-flex items-center text-emerald-600 text-[10px] gap-0.5">
                          <CheckCheck className="size-3" /> Sent to WhatsApp
                        </span>
                      </div>
                    )}
                  </div>
                )
              }

              // Operator message
              return (
                <div key={idx} className="flex flex-col items-end ml-auto max-w-[88%]">
                  <div className="flex items-center gap-1.5 mb-1 mr-1 text-[10px] text-emerald-700 font-medium">
                    <User className="size-3" />
                    <span>Support Operator</span>
                    <span className="text-gray-400">· {msg.time}</span>
                  </div>
                  <div className="rounded-2xl rounded-tr-sm bg-emerald-700 p-3.5 text-xs text-white shadow-xs leading-relaxed">
                    {msg.text}
                  </div>
                  <span className="mt-1 inline-flex items-center text-emerald-600 text-[10px] gap-0.5 mr-1">
                    <CheckCheck className="size-3" /> Sent to WhatsApp
                  </span>
                </div>
              )
            })}

            {botPaused && (
              <div className="mx-auto max-w-md rounded-lg border border-amber-200 bg-amber-50 p-2 text-center text-xs text-amber-800">
                <span className="font-medium">Bot paused by operator.</span>{" "}
                Replies are currently manual. The AI will not answer until resumed.
              </div>
            )}
          </div>

          {/* Interactive Mock Reply Box */}
          <div className="border-t border-gray-100 p-3 bg-white">
            <form
              onSubmit={(e) => {
                e.preventDefault()
                setReplyInput("")
              }}
              className="flex items-center gap-2"
            >
              <input
                type="text"
                value={replyInput}
                onChange={(e) => setReplyInput(e.target.value)}
                placeholder={
                  botPaused
                    ? "Type manual reply as operator (sent directly to WhatsApp)..."
                    : "Type a reply or click 'Pause Bot' to take over..."
                }
                className="flex-1 rounded-lg border border-gray-200 bg-gray-50/50 px-3 py-2 text-xs text-gray-800 placeholder-gray-400 focus:border-violet-500 focus:bg-white focus:outline-hidden"
              />
              <button
                type="submit"
                className="inline-flex items-center gap-1 rounded-lg bg-violet-600 px-3 py-2 text-xs font-medium text-white transition-colors hover:bg-violet-700"
              >
                <Send className="size-3" />
                <span>Send</span>
              </button>
            </form>
          </div>
        </div>
      </div>

      {/* Footer Banner */}
      <div className="border-t border-gray-100 bg-gray-50/80 px-4 py-2 text-center text-[11px] text-gray-500">
        Interactive workspace preview with sample data · Real product interface
        running on Next.js & Convex RAG backend
      </div>
    </div>
  )
}
