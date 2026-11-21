import type { SVGProps } from "react"

export const LineChartIllustration = (props: SVGProps<SVGSVGElement>) => (
  <svg
    aria-hidden="true"
    fill="none"
    xmlns="http://www.w3.org/2000/svg"
    viewBox="0 0 980 330"
    {...props}
  >
    {/* Grid Lines */}
    <path d="M60 280H980" stroke="#E6E6E6" strokeWidth="1" />
    <path d="M60 210H980" stroke="#E6E6E6" strokeWidth="1" />
    <path d="M60 140H980" stroke="#E6E6E6" strokeWidth="1" />
    <path d="M60 70H980" stroke="#E6E6E6" strokeWidth="1" />
    <path d="M60 5H980" stroke="#E6E6E6" strokeWidth="1" />

    {/* Decorative trend lines. No labels or values are rendered. */}
    {/* Series A - Violet */}
    <path
      d="M60 250 Q 150 200, 240 230 T 420 150 T 600 180 T 780 80 T 960 110"
      stroke="#8b5cf6"
      strokeWidth="3"
      strokeLinecap="round"
      strokeLinejoin="round"
    />
    {/* Series B - Fuchsia */}
    <path
      d="M60 200 Q 150 180, 240 210 T 420 120 T 600 140 T 780 60 T 960 90"
      stroke="#d946ef"
      strokeWidth="3"
      strokeLinecap="round"
      strokeLinejoin="round"
      opacity="0.8"
    />
    {/* Series C - Indigo */}
    <path
      d="M60 150 Q 150 140, 240 170 T 420 100 T 600 110 T 780 40 T 960 60"
      stroke="#6366f1"
      strokeWidth="3"
      strokeLinecap="round"
      strokeLinejoin="round"
      opacity="0.6"
    />
  </svg>
)
