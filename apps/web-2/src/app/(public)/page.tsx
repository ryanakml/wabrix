import { ControlPlaneSection } from "@/components/landing-page/ui/ControlPlaneSection"
import { CtaSection } from "@/components/landing-page/ui/CtaSection"
import FeatureDivider from "@/components/landing-page/ui/FeatureDivider"
import Features from "@/components/landing-page/ui/Features"
import { Hero } from "@/components/landing-page/ui/Hero"
import { ProofSection } from "@/components/landing-page/ui/ProofSection"
import { SolarAnalytics } from "@/components/landing-page/ui/SolarAnalytics"

export default function Home() {
  return (
    <main className="relative mx-auto flex flex-col">
      <Hero />
      <div className="mt-20 sm:mt-28 px-4 xl:px-0">
        <Features />
      </div>
      <div className="mt-24 sm:mt-32 px-4 xl:px-0">
        <ProofSection />
      </div>
      <FeatureDivider className="my-16 max-w-6xl" />
      <div className="px-4 xl:px-0">
        <ControlPlaneSection />
      </div>
      <FeatureDivider className="my-16 max-w-6xl" />
      <div className="mt-8 mb-24 px-4 xl:px-0">
        <SolarAnalytics />
      </div>
      <div className="mt-6 mb-28 px-4 xl:px-0">
        <CtaSection />
      </div>
    </main>
  )
}
