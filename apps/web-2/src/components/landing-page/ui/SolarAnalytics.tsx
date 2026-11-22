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
        <p className="relative scroll-my-24 text-xs font-semibold uppercase tracking-wider text-violet-600">
          Wabrix Insights
          <span className="absolute top-0.5 -left-[8px] h-4 w-[2px] rounded-r-sm bg-violet-600" />
        </p>
        <h2
          id="wabrix-analytics"
          className="mt-2 max-w-lg text-3xl font-semibold tracking-tight text-balance text-gray-950 md:text-4xl"
        >
          Review workspace activity and delivery health
        </h2>
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
