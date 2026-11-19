import { RiArrowRightUpLine } from "@remixicon/react";
import { siteConfig } from "@/app/siteConfig";
import { FadeContainer, FadeDiv, FadeSpan } from "../Fade";
import GameOfLife from "./HeroBackground";

export function Hero() {
  return (
    <section aria-label="hero">
      <FadeContainer className="relative flex flex-col items-center justify-center pb-10 sm:pb-12">
        <FadeDiv className="mx-auto">
          <a
            aria-label="Read the Wabrix documentation"
            href={siteConfig.baseLinks.docs}
            className="mx-auto w-full"
          >
            <div className="inline-flex max-full items-center gap-3 rounded-full bg-white/5 px-2.5 py-0.5 pr-3 pl-0.5 font-medium text-gray-900 ring-1 shadow-lg shadow-violet-400/20 ring-black/10 filter backdrop-blur-[1px] transition-colors hover:bg-violet-500/2.5 focus:outline-hidden sm:text-sm">
              <span className="shrink-0 truncate rounded-full border bg-gray-50 px-2.5 py-1 text-sm text-gray-600 sm:text-xs">
                Model
              </span>
              <span className="flex items-center gap-1 truncate">
                <span className="w-full truncate">
                  Gemini 2.5 Flash integration
                </span>

                <RiArrowRightUpLine className="size-4 shrink-0 text-gray-700" />
              </span>
            </div>
          </a>
        </FadeDiv>
        <h1 className="mt-8 text-center text-5xl font-semibold tracking-tighter text-gray-900 sm:text-8xl sm:leading-22">
          <FadeSpan>Scale</FadeSpan> <FadeSpan>your</FadeSpan>
          <br />
          <FadeSpan>WhatsApp</FadeSpan> <FadeSpan>with</FadeSpan>{" "}
          <FadeSpan>AI</FadeSpan>
        </h1>
        <p className="mt-5 max-w-xl text-center text-base text-balance text-gray-700 sm:mt-8 sm:text-xl">
          <FadeSpan>Explore intelligent bots, real-time analytics,</FadeSpan>{" "}
          <FadeSpan>and human-in-the-loop collaboration</FadeSpan>{" "}
          <FadeSpan>in a working WhatsApp support demo.</FadeSpan>
        </p>
        <FadeDiv>
          <a
            className="mt-6 inline-flex cursor-pointer flex-row items-center justify-center gap-1 rounded-md border-b-[1.5px] border-violet-700 bg-linear-to-b from-violet-400 to-violet-500 px-5 py-3 leading-4 font-medium tracking-wide whitespace-nowrap text-white shadow-[0_0_0_2px_rgba(0,0,0,0.04),0_0_14px_0_rgba(255,255,255,0.19)] transition-all duration-200 ease-in-out hover:shadow-violet-300"
            href="/auth/sign-in"
          >
            Open the demo
          </a>
        </FadeDiv>

        <FadeDiv>
          <p className="mt-5 max-w-xl text-center text-sm text-balance text-gray-500">
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

        <div className="absolute inset-0 -z-10 flex items-center justify-center">
          <GameOfLife />
        </div>
      </FadeContainer>
    </section>
  );
}
