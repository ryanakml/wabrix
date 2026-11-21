import { RiArrowRightUpLine, RiGithubFill } from "@remixicon/react"
import Link from "next/link"
import { siteConfig } from "@/app/siteConfig"
import { FadeContainer, FadeDiv } from "../Fade"
import GameOfLife from "./HeroBackground"
import { HeroInboxShowcase } from "./HeroInboxShowcase"

export function Hero() {
  return (
    <section aria-label="hero" className="relative pt-6 pb-16 sm:pb-20">
      <FadeContainer className="relative flex flex-col items-center justify-center">
        {/* Model Badge */}
        <FadeDiv className="mx-auto">
          <Link
            aria-label="Read the Wabrix documentation"
            href={siteConfig.baseLinks.docs}
            className="mx-auto"
          >
            <div className="inline-flex items-center gap-2 rounded-full border border-gray-200 bg-white/80 px-3 py-1 text-xs font-medium text-gray-800 shadow-xs backdrop-blur-xs transition-colors hover:border-violet-300 hover:bg-violet-50/50">
              <span className="rounded-full bg-violet-100 px-2 py-0.5 text-[11px] font-semibold text-violet-700">
                AI Model
              </span>
              <span className="flex items-center gap-1 text-gray-700">
                Gemini 2.5 Flash integration
                <RiArrowRightUpLine className="size-3.5 text-gray-400" />
              </span>
            </div>
          </Link>
        </FadeDiv>

        {/* Honest, Clear Title without cliches */}
        <h1 className="mt-6 max-w-4xl text-center text-4xl font-semibold tracking-tight text-gray-900 sm:text-6xl sm:leading-tight lg:text-7xl">
          WhatsApp shared inbox with AI-assisted replies
        </h1>

        {/* Clear, Specific Subtitle */}
        <p className="mt-5 max-w-2xl text-center text-base text-balance text-gray-600 sm:text-lg sm:leading-relaxed">
          Connect WhatsApp Cloud API, upload business documents, and let an AI
          assistant draft grounded answers while operators keep full control with
          one-click handoff.
        </p>

        {/* CTA Buttons */}
        <FadeDiv className="mt-7 flex flex-wrap items-center justify-center gap-3">
          <Link
            className="inline-flex cursor-pointer items-center justify-center rounded-lg bg-violet-600 px-5 py-2.5 text-sm font-medium text-white shadow-sm transition-colors hover:bg-violet-700 focus:outline-hidden focus:ring-2 focus:ring-violet-500 focus:ring-offset-2"
            href="/auth/sign-in"
          >
            Open the demo
          </Link>
          <a
            className="inline-flex cursor-pointer items-center justify-center gap-1.5 rounded-lg border border-gray-300 bg-white px-5 py-2.5 text-sm font-medium text-gray-700 shadow-sm transition-colors hover:bg-gray-50 focus:outline-hidden focus:ring-2 focus:ring-gray-400 focus:ring-offset-2"
            href={siteConfig.repositories.current}
            target="_blank"
            rel="noopener noreferrer"
          >
            <RiGithubFill className="size-4" />
            View on GitHub
          </a>
          <Link
            className="inline-flex cursor-pointer items-center justify-center rounded-lg px-4 py-2.5 text-sm font-medium text-gray-600 hover:text-gray-900 transition-colors"
            href={siteConfig.baseLinks.setup}
          >
            Read setup docs
          </Link>
        </FadeDiv>

        {/* Required Portfolio Disclosure */}
        <FadeDiv className="mt-4">
          <p className="max-w-xl text-center text-xs text-balance text-gray-500">
            Portfolio project and live demo. Not a commercial product. Source:{" "}
            <a
              href={siteConfig.repositories.current}
              target="_blank"
              rel="noopener noreferrer"
              className="font-medium text-gray-700 underline decoration-gray-300 underline-offset-4 transition-colors hover:text-gray-900"
            >
              github.com/ryanakml/wabrix
            </a>
            .
          </p>
        </FadeDiv>

        {/* Real Product Showcase (WhatsApp Messenger) */}
        <div className="mt-12 w-full px-4 sm:px-6">
          <HeroInboxShowcase />
        </div>

        {/* Subtle Canvas Dot Pattern */}
        <div className="absolute inset-0 -z-10 flex items-center justify-center opacity-30">
          <GameOfLife />
        </div>
      </FadeContainer>
    </section>
  )
}
