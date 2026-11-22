"use client"

import { useState } from "react"
import Link from "next/link"
import {
  ArrowRight,
  Check,
  Database,
  ExternalLink,
  ShieldCheck,
  Smartphone,
  Sparkles,
  Terminal,
  type LucideIcon,
} from "lucide-react"
import { siteConfig } from "@/app/siteConfig"

type DeployStep = {
  step: string
  title: string
  duration: string
  description: string
  statusLabel: string
  detailLine: string
  icon: LucideIcon
}

const DEPLOY_STEPS: DeployStep[] = [
  {
    step: "01",
    title: "Connect WhatsApp Cloud API",
    duration: "~60 sec",
    description:
      "Configure your Meta WhatsApp Business Account (WABA) credentials, Phone Number ID, and webhook verification token.",
    statusLabel: "Webhook verified",
    detailLine: "Cloud API v23.0 · HMAC SHA-256 validation",
    icon: Smartphone,
  },
  {
    step: "02",
    title: "Upload Knowledge Base Documents",
    duration: "~90 sec",
    description:
      "Upload store SOPs, return policies, or shipping FAQs in PDF or Markdown format for automatic vector chunking.",
    statusLabel: "Knowledge indexed",
    detailLine: "PDF/Markdown parsing · Gemini 2.5 Flash embeddings",
    icon: Database,
  },
  {
    step: "03",
    title: "Verify Prompts & Test in Emulator",
    duration: "~45 sec",
    description:
      "Test bot replies and inspect grounded citations in the Bot Emulator before activating the live webhook.",
    statusLabel: "Preview ready",
    detailLine: "Simulated chat · 0 live WhatsApp messages sent",
    icon: ShieldCheck,
  },
]

const TRUST_SIGNALS = [
  "Live hosted demo",
  "No credit card required",
  "Open source on GitHub",
]

export function CtaSection() {
  const [activeStep, setActiveStep] = useState<number>(1)
  const current = DEPLOY_STEPS[activeStep]

  return (
    <section
      id="deploy"
      aria-labelledby="cta-title"
      className="mx-auto w-full max-w-6xl scroll-mt-28 px-4 xl:px-0"
    >
      <div className="relative overflow-hidden rounded-2xl border border-zinc-200/90 bg-white p-8 sm:p-12 lg:p-16 shadow-xs">
        <div
          aria-hidden="true"
          className="pointer-events-none absolute inset-0 bg-[linear-gradient(to_right,#f4f4f5_1px,transparent_1px),linear-gradient(to_bottom,#f4f4f5_1px,transparent_1px)] bg-[size:4rem_4rem] [mask-image:radial-gradient(ellipse_70%_70%_at_80%_50%,#000_40%,transparent_100%)]"
        />

        <div className="relative grid grid-cols-1 items-center gap-12 lg:grid-cols-12 lg:gap-10">
          <div className="lg:col-span-6">
            <div className="mb-5 inline-flex items-center gap-2 rounded-full border border-violet-200/80 bg-violet-50/70 px-3 py-1 text-xs font-medium text-violet-700">
              <Sparkles className="h-3.5 w-3.5 text-violet-600" aria-hidden="true" />
              WhatsApp Workspace Setup
            </div>

            <h2
              id="cta-title"
              className="text-3xl font-semibold tracking-tight text-balance text-zinc-950 sm:text-4xl lg:leading-[1.15]"
            >
              Explore the demo or run Wabrix locally
            </h2>

            <p className="mt-4 max-w-lg text-base leading-relaxed text-zinc-600">
              Sign in to explore the live hosted workspace with sample data, or
              read the setup documentation to run the Next.js and Convex
              monorepo on your local machine.
            </p>

            <div className="mt-8 flex flex-wrap items-center gap-3.5">
              <Link
                href="/auth/sign-in"
                className="inline-flex items-center justify-center gap-2 rounded-xl bg-violet-600 px-5 py-3 text-sm font-semibold text-white shadow-sm transition hover:bg-violet-700 focus-visible:outline-2 focus-visible:outline-offset-2 focus-visible:outline-violet-600"
              >
                Open the demo
                <ArrowRight className="h-4 w-4" aria-hidden="true" />
              </Link>
              <Link
                href={siteConfig.baseLinks.setup}
                className="inline-flex items-center justify-center rounded-xl border border-zinc-200 bg-white px-5 py-3 text-sm font-semibold text-zinc-800 shadow-sm transition hover:border-zinc-300 hover:bg-zinc-50 focus-visible:outline-2 focus-visible:outline-offset-2 focus-visible:outline-zinc-400"
              >
                Read setup docs
              </Link>
            </div>

            <div className="mt-7 flex flex-wrap items-center gap-x-6 gap-y-2 border-t border-zinc-100 pt-6 text-xs font-medium text-zinc-500">
              {TRUST_SIGNALS.map((signal) => (
                <span key={signal} className="inline-flex items-center gap-1.5">
                  <Check className="h-3.5 w-3.5 text-emerald-600" aria-hidden="true" />
                  {signal}
                </span>
              ))}
              <a
                href={siteConfig.repositories.current}
                target="_blank"
                rel="noopener noreferrer"
                className="inline-flex items-center gap-1 text-zinc-600 hover:text-zinc-900 transition-colors"
              >
                <span>GitHub Source</span>
                <ExternalLink className="size-3" />
              </a>
            </div>
          </div>

          <div className="lg:col-span-6">
            <div className="overflow-hidden rounded-2xl border border-zinc-200/90 bg-zinc-50/90 p-5 sm:p-6 shadow-xs">
              <div className="mb-4 flex flex-wrap items-center justify-between gap-2 border-b border-zinc-200/80 pb-3">
                <div className="flex items-center gap-2">
                  <Terminal className="h-4 w-4 text-violet-600" aria-hidden="true" />
                  <span className="font-mono text-xs font-semibold text-zinc-800">
                    setup-overview
                  </span>
                </div>
                <div className="flex flex-wrap items-center gap-2">
                  <span className="rounded-md border border-zinc-200 bg-white px-2 py-0.5 font-mono text-[10px] text-zinc-500">
                    3-step workflow
                  </span>
                </div>
              </div>

              <div className="space-y-2.5">
                {DEPLOY_STEPS.map((item, index) => {
                  const Icon = item.icon
                  const isActive = index === activeStep

                  return (
                    <button
                      key={item.step}
                      type="button"
                      onClick={() => setActiveStep(index)}
                      aria-expanded={isActive}
                      className={`w-full rounded-xl border p-3.5 text-left transition ${
                        isActive
                          ? "border-violet-300 bg-white shadow-xs"
                          : "border-zinc-200/70 bg-white/50 hover:border-zinc-300 hover:bg-white"
                      }`}
                    >
                      <div className="flex items-start justify-between gap-2">
                        <div className="flex min-w-0 items-start gap-2.5">
                          <span
                            className={`flex h-6 w-6 shrink-0 items-center justify-center rounded-md font-mono text-[11px] font-semibold ${
                              isActive
                                ? "bg-violet-600 text-white"
                                : "bg-zinc-100 text-zinc-600"
                            }`}
                          >
                            {item.step}
                          </span>
                          <span className="break-words text-sm font-semibold text-zinc-900">
                            {item.title}
                          </span>
                        </div>
                        <span className="shrink-0 font-mono text-[11px] text-zinc-400">
                          {item.duration}
                        </span>
                      </div>

                      {isActive && (
                        <div className="mt-2.5 pl-9">
                          <p className="text-xs leading-relaxed text-zinc-600">
                            {item.description}
                          </p>
                          <div className="mt-2.5 flex flex-wrap items-center justify-between gap-2 rounded-lg border border-zinc-100 bg-zinc-50 px-2.5 py-1.5 font-mono text-[11px]">
                            <span className="min-w-0 break-words text-zinc-600">
                              {item.detailLine}
                            </span>
                            <span className="inline-flex shrink-0 items-center gap-1 font-medium text-emerald-600">
                              <Icon className="h-3 w-3" aria-hidden="true" />
                              {item.statusLabel}
                            </span>
                          </div>
                        </div>
                      )}
                    </button>
                  )
                })}
              </div>

              <div className="mt-4 flex flex-wrap items-center justify-between gap-2 px-1 text-[11px] text-zinc-500">
                <span>Selected: {current.title}</span>
                <span className="font-mono text-violet-600 text-[11px]">
                  Estimated setup: ~3 mins
                </span>
              </div>
            </div>
          </div>
        </div>
      </div>
    </section>
  )
}
