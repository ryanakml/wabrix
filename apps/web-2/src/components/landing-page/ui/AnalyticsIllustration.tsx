import { LineChartIllustration } from "../LineChartIllustration"

const previewCapabilities = [
  {
    title: "Conversation volume",
    description:
      "See message activity across bots and channels in one workspace view.",
  },
  {
    title: "Human handoff",
    description:
      "Track which conversations need an operator and where the bot paused.",
  },
  {
    title: "AI usage",
    description:
      "Review token usage and automation coverage for each workspace.",
  },
]

export default function FieldPerformance() {
  return (
    <div className="h-150 shrink-0 overflow-hidden mask-[radial-gradient(white_30%,transparent_90%)] perspective-[4000px] perspective-origin-center">
      <div className="-translate-y-10 -translate-z-10 rotate-x-10 rotate-y-20 -rotate-z-10 transform-3d">
        <div className="flex flex-wrap items-center gap-3">
          <h3 className="text-sm text-gray-500">Analytics workspace preview</h3>
          <span className="rounded-full border border-amber-300 bg-amber-50 px-2.5 py-0.5 text-xs font-medium text-amber-800">
            Sample data
          </span>
        </div>
        <p className="mt-1 text-sm text-gray-500">
          Illustrative interface only. No live usage or performance data is
          shown.
        </p>

        <LineChartIllustration className="mt-8 w-full min-w-200 shrink-0" />

        <div className="mt-8 grid min-w-200 grid-cols-1 gap-4 sm:grid-cols-3">
          {previewCapabilities.map((capability) => (
            <div
              key={capability.title}
              className="rounded-xl border border-gray-200 bg-white/80 p-4 shadow-sm"
            >
              <p className="text-sm font-semibold text-gray-900">
                {capability.title}
              </p>
              <p className="mt-1 text-sm leading-6 text-gray-500">
                {capability.description}
              </p>
            </div>
          ))}
        </div>
      </div>
    </div>
  )
}
