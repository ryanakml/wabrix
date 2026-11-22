import {
  CheckCheck,
  Database,
  ShieldCheck,
  Smartphone,
  Sparkles,
  User,
} from "lucide-react"

type WorkflowStep = {
  step: string
  title: string
  subtitle: string
  description: string
  icon: typeof ShieldCheck
  badge: string
}

const WORKFLOW_STEPS: WorkflowStep[] = [
  {
    step: "01",
    title: "Webhook Ingress",
    subtitle: "Meta Cloud API v23.0",
    description:
      "Customer sends a WhatsApp message. Meta pushes a signed POST webhook. Wabrix validates the SHA-256 signature and deduplicates message IDs.",
    icon: Smartphone,
    badge: "Verified Signature",
  },
  {
    step: "02",
    title: "RAG Retrieval",
    subtitle: "Vector Search",
    description:
      "Wabrix retrieves relevant context chunks from your uploaded policies (PDF/Markdown) using semantic embeddings to prevent hallucinations.",
    icon: Database,
    badge: "Grounded Context",
  },
  {
    step: "03",
    title: "Grounded Generation",
    subtitle: "Gemini 2.5 Flash",
    description:
      "Gemini generates a response constrained by the retrieved chunks and prompt instructions, citing the exact document sources used.",
    icon: Sparkles,
    badge: "Cited Answer",
  },
  {
    step: "04",
    title: "Operator Oversight",
    subtitle: "Human-in-the-Loop",
    description:
      "Operators can pause the bot at any time. When paused, messages hold for manual takeover so customers receive human care for complex requests.",
    icon: User,
    badge: "Full Control",
  },
]

export function ProofSection() {
  return (
    <section
      aria-label="How Wabrix handles WhatsApp conversations"
      className="mx-auto max-w-6xl"
    >
      <div className="text-center px-4">
        <p className="text-xs font-semibold uppercase tracking-wider text-violet-600">
          Message Lifecycle
        </p>
        <h2 className="mt-3 text-3xl font-semibold tracking-tight text-gray-950 sm:text-4xl">
          How a WhatsApp conversation is processed
        </h2>
        <p className="mt-4 max-w-2xl mx-auto text-base text-gray-600 leading-relaxed">
          From webhook signature verification to semantic retrieval and human
          handoff, every conversation follows an explicit and auditable path.
        </p>
      </div>

      {/* 4 Architecture Steps */}
      <div className="mt-12 grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-6 px-4 xl:px-0">
        {WORKFLOW_STEPS.map((s) => {
          const Icon = s.icon
          return (
            <div
              key={s.step}
              className="rounded-2xl border border-gray-200/80 bg-white p-6 shadow-xs flex flex-col justify-between"
            >
              <div>
                <div className="flex items-center justify-between">
                  <span className="font-mono text-xs font-bold text-violet-600">
                    STAGE {s.step}
                  </span>
                  <span className="rounded-full bg-gray-100 px-2.5 py-0.5 text-[10px] font-medium text-gray-600">
                    {s.badge}
                  </span>
                </div>
                <div className="mt-4 flex items-center gap-2">
                  <div className="flex size-8 items-center justify-center rounded-lg bg-violet-50 text-violet-700">
                    <Icon className="size-4" />
                  </div>
                  <div>
                    <h3 className="text-sm font-semibold text-gray-900">
                      {s.title}
                    </h3>
                    <p className="text-[11px] text-gray-500 font-mono">
                      {s.subtitle}
                    </p>
                  </div>
                </div>
                <p className="mt-3 text-xs text-gray-600 leading-relaxed">
                  {s.description}
                </p>
              </div>
            </div>
          )
        })}
      </div>

      {/* Sample Walkthrough Card */}
      <div
        data-ui="message-trace"
        className="mt-8 mx-4 xl:mx-0 rounded-2xl border border-gray-200/80 bg-linear-to-b from-gray-50/80 to-white p-6 sm:p-8 shadow-xs"
      >
        <div className="flex flex-wrap items-center justify-between gap-3 border-b border-gray-200/80 pb-4">
          <div className="flex items-center gap-2">
            <span className="flex size-2 rounded-full bg-emerald-500" />
            <h3 className="text-sm font-semibold text-gray-900">
              Message Execution Trace
            </h3>
            <span className="rounded-md bg-violet-50 px-2 py-0.5 text-[11px] font-mono font-medium text-violet-700 border border-violet-200">
              Verified Pipeline
            </span>
          </div>
          <span className="text-xs text-gray-500 font-mono">
            Thread ID: #conv-sample-8821
          </span>
        </div>

        <div className="mt-6 grid grid-cols-1 lg:grid-cols-12 gap-6 items-start">
          {/* Left: WhatsApp Chat Excerpt */}
          <div className="lg:col-span-7 rounded-xl border border-gray-200 bg-white p-4 space-y-3">
            <div className="text-[11px] text-gray-400 flex items-center justify-between">
              <span>Customer Message via WhatsApp</span>
              <span>2:02 PM EST</span>
            </div>
            <div className="rounded-xl bg-gray-100 p-3 text-xs text-gray-800 max-w-[90%]">
              What is your return policy if an item does not fit properly?
            </div>

            <div className="pt-2 border-t border-gray-100">
              <div className="flex items-center gap-1.5 text-[11px] text-violet-700 font-medium mb-1">
                <Sparkles className="size-3 text-violet-600" />
                <span>AI Bot Response (Grounded)</span>
                <span className="text-gray-400">· 2:02 PM EST</span>
              </div>
              <div className="rounded-2xl rounded-tr-sm bg-violet-600 p-3 text-xs text-white leading-relaxed">
                Items in their original, unworn condition with tags attached can
                be returned or exchanged within 14 days of delivery. Return
                shipping is free for size exchanges, and refunds are issued back
                to the original payment method upon warehouse inspection.
              </div>
              <div className="mt-2 flex items-center gap-2 text-[10px] text-gray-500">
                <span className="font-mono text-violet-700 bg-violet-50 px-2 py-0.5 rounded border border-violet-200">
                  📄 Source: return-policy.pdf (Chunk #2)
                </span>
                <span className="flex items-center gap-0.5 text-emerald-600">
                  <CheckCheck className="size-3" /> Delivered
                </span>
              </div>
            </div>
          </div>

          {/* Right: Technical Audit Telemetry */}
          <div className="lg:col-span-5 rounded-xl border border-gray-200/80 bg-gray-50/70 p-4 space-y-3 text-xs">
            <h4 className="font-semibold text-gray-800 text-xs">
              Backend Processing Breakdown
            </h4>

            <div className="space-y-2">
              <div className="rounded-lg bg-white p-2.5 border border-gray-200/70 flex items-center justify-between">
                <span className="text-gray-600">Ingress Validation</span>
                <span className="font-mono text-emerald-700 font-medium">
                  HMAC SHA-256 Valid
                </span>
              </div>
              <div className="rounded-lg bg-white p-2.5 border border-gray-200/70 flex items-center justify-between">
                <span className="text-gray-600">Knowledge Matched</span>
                <span className="font-mono text-violet-700 font-medium">
                  return-policy.pdf
                </span>
              </div>
              <div className="rounded-lg bg-white p-2.5 border border-gray-200/70 flex items-center justify-between">
                <span className="text-gray-600">AI Model</span>
                <span className="font-mono text-gray-800">
                  gemini-2.5-flash
                </span>
              </div>
              <div className="rounded-lg bg-white p-2.5 border border-gray-200/70 flex items-center justify-between">
                <span className="text-gray-600">Human Handoff</span>
                <span className="text-gray-500">
                  Standby (Operator can pause)
                </span>
              </div>
            </div>

            <p className="text-[11px] text-gray-500 leading-normal pt-1">
              Demonstration of how the backend validates WhatsApp payloads,
              queries Convex RAG chunks, and returns cited responses without
              unverified metrics.
            </p>
          </div>
        </div>
      </div>
    </section>
  )
}
