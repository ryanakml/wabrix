import Image from "next/image"
import {
  RiCheckDoubleFill,
  RiDatabase2Fill,
  RiPauseCircleFill,
  RiShieldCheckFill,
  RiWhatsappFill,
} from "@remixicon/react"

export default function Features() {
  return (
    <section
      aria-label="Wabrix product features"
      id="solutions"
      className="relative mx-auto max-w-6xl scroll-my-24"
    >
      {/* Background Grid Lines */}
      <div className="pointer-events-none inset-0 select-none">
        <div
          className="absolute inset-y-0 -my-20 w-px"
          style={{
            maskImage:
              "linear-gradient(transparent, white 5rem, white calc(100% - 5rem), transparent)",
          }}
        >
          <svg className="h-full w-full" preserveAspectRatio="none">
            <line
              x1="0"
              y1="0"
              x2="0"
              y2="100%"
              className="stroke-gray-300"
              strokeWidth="2"
              strokeDasharray="3 3"
            />
          </svg>
        </div>
        <div
          className="absolute inset-y-0 right-0 -my-20 w-px"
          style={{
            maskImage:
              "linear-gradient(transparent, white 5rem, white calc(100% - 5rem), transparent)",
          }}
        >
          <svg className="h-full w-full" preserveAspectRatio="none">
            <line
              x1="0"
              y1="0"
              x2="0"
              y2="100%"
              className="stroke-gray-300"
              strokeWidth="2"
              strokeDasharray="3 3"
            />
          </svg>
        </div>
      </div>

      {/* Section Header */}
      <div className="text-center px-4">
        <h2 className="text-xs font-semibold uppercase tracking-wider text-violet-600">
          Core Capabilities
        </h2>
        <p className="mt-3 text-3xl font-semibold tracking-tight text-gray-900 sm:text-4xl md:text-5xl">
          Built for small WhatsApp support operations
        </p>
        <p className="mt-4 max-w-2xl mx-auto text-base text-gray-600 leading-relaxed">
          A shared workspace where AI answers routine questions using verified
          documents, and human operators maintain full oversight through a common inbox.
        </p>
      </div>

      {/* Feature 1: Bot Studio & Knowledge Base (Hero feature) */}
      <div className="mt-16 rounded-2xl border border-gray-200/80 bg-linear-to-b from-gray-50/70 to-white p-6 sm:p-10 shadow-xs">
        <div className="grid grid-cols-1 lg:grid-cols-12 gap-8 items-center">
          <div className="lg:col-span-5">
            <div className="inline-flex items-center gap-1.5 rounded-full bg-violet-100 px-2.5 py-0.5 text-xs font-medium text-violet-700">
              <RiDatabase2Fill className="size-3.5" />
              <span>Grounding & Knowledge Base</span>
            </div>
            <h3 className="mt-4 text-2xl font-semibold tracking-tight text-gray-900 sm:text-3xl">
              Answers grounded in your documents, not AI hallucinations
            </h3>
            <p className="mt-3 text-sm text-gray-600 leading-relaxed">
              Upload store SOPs, return policies, shipping schedules, and FAQ
              documents. When a customer messages, Wabrix chunks the text,
              retrieves relevant snippets, and instructs Gemini 2.5 Flash to cite
              the source chunk used in its response.
            </p>

            <ul className="mt-6 space-y-3 text-xs text-gray-600">
              <li className="flex items-center gap-2">
                <span className="flex size-5 items-center justify-center rounded-full bg-violet-100 text-violet-700">
                  ✓
                </span>
                <span>Markdown & PDF ingestion with token-aware chunking</span>
              </li>
              <li className="flex items-center gap-2">
                <span className="flex size-5 items-center justify-center rounded-full bg-violet-100 text-violet-700">
                  ✓
                </span>
                <span>Bot Emulator preview to test prompts before live deployment</span>
              </li>
              <li className="flex items-center gap-2">
                <span className="flex size-5 items-center justify-center rounded-full bg-violet-100 text-violet-700">
                  ✓
                </span>
                <span>Grounded citations tagged directly on generated messages</span>
              </li>
            </ul>
          </div>

          <div className="lg:col-span-7">
            <div className="relative rounded-xl border border-gray-200 bg-white p-2 shadow-sm overflow-hidden">
              <Image
                src="/images/wabrix-bot-studio-preview.webp"
                alt="Wabrix Knowledge Base source beside a bot preview showing a response drawn from that source"
                width={1125}
                height={500}
                className="w-full rounded-lg object-contain"
                priority
              />
              <div className="mt-2 text-center text-[11px] text-gray-500">
                Wabrix Knowledge Base and Bot Emulator — interface preview with
                fictional demo knowledge; preview only, no WhatsApp message sent.
              </div>
            </div>
          </div>
        </div>
      </div>

      {/* Feature 2 & 3: Shared Inbox & Human Handoff (Side-by-side) */}
      <div className="mt-8 grid grid-cols-1 md:grid-cols-2 gap-8">
        {/* Shared Inbox */}
        <div className="rounded-2xl border border-gray-200/80 bg-white p-6 sm:p-8 shadow-xs flex flex-col justify-between">
          <div>
            <div className="inline-flex items-center gap-1.5 rounded-full bg-emerald-100 px-2.5 py-0.5 text-xs font-medium text-emerald-800">
              <RiWhatsappFill className="size-3.5 text-emerald-600" />
              <span>Multi-Operator Inbox</span>
            </div>
            <h3 className="mt-4 text-xl font-semibold tracking-tight text-gray-900">
              Single shared inbox for your team
            </h3>
            <p className="mt-2 text-sm text-gray-600 leading-relaxed">
              Eliminate forwarding phones or lost customer threads. Connect your
              Meta WhatsApp Business Cloud API number so multiple support
              operators can view conversations, claim tickets, and reply simultaneously.
            </p>

            <div className="mt-6 space-y-2.5 rounded-xl border border-gray-100 bg-gray-50 p-4 text-xs text-gray-600">
              <div className="flex items-center justify-between">
                <span className="font-medium text-gray-800">Webhook ingress</span>
                <span className="font-mono text-emerald-600">Meta Cloud API v23.0</span>
              </div>
              <div className="flex items-center justify-between">
                <span className="font-medium text-gray-800">Delivery status</span>
                <span className="text-gray-500">Sent · Delivered · Read receipts</span>
              </div>
              <div className="flex items-center justify-between">
                <span className="font-medium text-gray-800">Internal notes</span>
                <span className="text-gray-500">Private operator annotations</span>
              </div>
            </div>
          </div>

          <div className="mt-6 pt-4 border-t border-gray-100 text-xs text-gray-500 flex items-center gap-2">
            <RiCheckDoubleFill className="size-4 text-emerald-600" />
            <span>Real-time updates powered by Convex reactive queries</span>
          </div>
        </div>

        {/* Human Handoff */}
        <div className="rounded-2xl border border-gray-200/80 bg-white p-6 sm:p-8 shadow-xs flex flex-col justify-between">
          <div>
            <div className="inline-flex items-center gap-1.5 rounded-full bg-amber-100 px-2.5 py-0.5 text-xs font-medium text-amber-800">
              <RiPauseCircleFill className="size-3.5 text-amber-700" />
              <span>Human-in-the-Loop</span>
            </div>
            <h3 className="mt-4 text-xl font-semibold tracking-tight text-gray-900">
              Instant handoff and bot pausing
            </h3>
            <p className="mt-2 text-sm text-gray-600 leading-relaxed">
              When a customer request is sensitive, nuanced, or requires custom
              handling, an operator can pause AI automation with a single click.
              The bot remains silent while the human resolves the issue.
            </p>

            <div className="mt-6 space-y-2.5 rounded-xl border border-gray-100 bg-gray-50 p-4 text-xs text-gray-600">
              <div className="flex items-center justify-between">
                <span className="font-medium text-gray-800">Handoff controls</span>
                <span className="text-amber-700 font-medium">One-click Pause / Resume</span>
              </div>
              <div className="flex items-center justify-between">
                <span className="font-medium text-gray-800">Channel routing</span>
                <span className="text-gray-500">Support, Sales, VIP tiering</span>
              </div>
              <div className="flex items-center justify-between">
                <span className="font-medium text-gray-800">Template messages</span>
                <span className="text-gray-500">Pre-approved WhatsApp HSM templates</span>
              </div>
            </div>
          </div>

          <div className="mt-6 pt-4 border-t border-gray-100 text-xs text-gray-500 flex items-center gap-2">
            <RiShieldCheckFill className="size-4 text-violet-600" />
            <span>Zero unexpected automated replies while humans are active</span>
          </div>
        </div>
      </div>
    </section>
  )
}
