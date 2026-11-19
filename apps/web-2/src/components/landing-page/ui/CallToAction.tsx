import Image from "next/image";
import Link from "next/link";
import { Button } from "../Button";

export function CallToAction() {
  return (
    <section aria-labelledby="cta-title" className="mx-auto max-w-6xl">
      <div className="grid items-center gap-8 sm:grid-cols-6">
        <div className="sm:col-span-2">
          <h2
            id="cta-title"
            className="scroll-my-60 text-3xl font-semibold tracking-tighter text-balance text-gray-900 md:text-4xl"
          >
            See Wabrix in action
          </h2>
          <p className="mt-3 mb-8 text-lg text-gray-600">
            This is a live demo of a WhatsApp-first support workspace. Sign in
            to explore the dashboard, or read the setup guide to run the project
            yourself.
          </p>
          <div className="flex flex-wrap gap-4">
            <Button
              asChild
              className="text-md bg-violet-600 hover:bg-violet-700"
            >
              <Link href="/auth/sign-in">Open the demo</Link>
            </Button>
            <Button asChild className="text-md" variant="secondary">
              <Link href="/docs/setup">Read setup docs</Link>
            </Button>
          </div>
        </div>
        <div className="relative isolate h-64 rounded-xl overflow-hidden sm:col-span-4 sm:h-80 md:h-96">
          <Image
            aria-hidden
            alt=""
            src="/images/wabrix_cta_landscape_20260503.png"
            fill
            sizes="(min-width: 640px) 66vw, 100vw"
            className="absolute inset-0 -z-10 rounded-2xl blur-xl object-cover"
          />
          <Image
            alt="Illustrative diagram of AI-assisted WhatsApp message routing, with sample data"
            src="/images/wabrix_cta_landscape_20260503.png"
            fill
            sizes="(min-width: 640px) 66vw, 100vw"
            className="relative z-10 rounded-2xl object-contain"
          />
        </div>
      </div>
    </section>
  );
}

export default CallToAction;
