import {
  RiPieChartFill,
  RiRobot3Fill,
  RiTeamFill,
  RiTranslate2,
} from "@remixicon/react"

import { Divider } from "../Divider"
import AnalyticsIllustration from "./AnalyticsIllustration"
import { StickerCard } from "./StickerCard"

export function SolarAnalytics() {
  return (
    <section
      aria-labelledby="wabrix-analytics"
      className="relative mx-auto w-full max-w-6xl overflow-hidden"
    >
      <div>
        <h2
          id="wabrix-analytics"
          className="relative scroll-my-24 text-lg font-semibold tracking-tight text-violet-500"
        >
          Wabrix Insights
          <div className="absolute top-1 -left-[8px] h-5 w-[3px] rounded-r-sm bg-violet-500" />
        </h2>
        <p className="mt-2 max-w-lg text-3xl font-semibold tracking-tighter text-balance text-gray-900 md:text-4xl">
          Review workspace activity and delivery health
        </p>
      </div>
      <div className="*:pointer-events-none">
        <AnalyticsIllustration />
      </div>
      <Divider className="mt-0"></Divider>
      <div className="grid grid-cols-1 grid-rows-2 gap-6 md:grid-cols-4 md:grid-rows-1">
        <StickerCard
          Icon={RiPieChartFill}
          title="Delivery visibility"
          description="Review sent, delivered, read, and failed message states."
        />
        <StickerCard
          Icon={RiRobot3Fill}
          title="Token usage"
          description="Track AI consumption against workspace limits."
        />
        <StickerCard
          Icon={RiTeamFill}
          title="Human handoff"
          description="Request or clear handoff from the conversation view."
        />
        <StickerCard
          Icon={RiTranslate2}
          title="Language-aware replies"
          description="Configure bot language defaults for English, Indonesian, or automatic handling."
        />
      </div>
    </section>

  )
}
