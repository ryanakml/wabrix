import React from "react";
import { spring, useCurrentFrame, useVideoConfig } from "remotion";

interface KineticTextProps {
  badge?: string;
  badgeColor?: "purple" | "emerald" | "amber" | "blue";
  title: string;
  subtitle?: string;
  delay?: number;
  align?: "left" | "center" | "right";
  className?: string;
}

export const KineticText: React.FC<KineticTextProps> = ({
  badge,
  badgeColor = "purple",
  title,
  subtitle,
  delay = 0,
  align = "center",
  className = "",
}) => {
  const frame = useCurrentFrame();
  const { fps } = useVideoConfig();

  const titleProgress = spring({
    frame: frame - delay,
    fps,
    config: { damping: 14, mass: 0.8, stiffness: 100 },
  });

  const subtitleProgress = spring({
    frame: frame - (delay + 10),
    fps,
    config: { damping: 14, mass: 0.8, stiffness: 100 },
  });

  const badgeColors = {
    purple: "bg-violet-500/10 text-violet-300 border-violet-500/30",
    emerald: "bg-emerald-500/10 text-emerald-300 border-emerald-500/30",
    amber: "bg-amber-500/10 text-amber-300 border-amber-500/30",
    blue: "bg-blue-500/10 text-blue-300 border-blue-500/30",
  };

  const alignClasses = {
    left: "text-left items-start",
    center: "text-center items-center",
    right: "text-right items-end",
  };

  if (frame < delay) return null;

  return (
    <div
      className={`flex flex-col select-none ${alignClasses[align]} ${className}`}
    >
      {badge && (
        <div
          className="mb-3"
          style={{
            transform: `translateY(${(1 - titleProgress) * 15}px)`,
            opacity: titleProgress,
          }}
        >
          <span
            className={`inline-flex items-center px-3 py-1 rounded-full text-xs font-semibold tracking-wider uppercase border backdrop-blur-md ${badgeColors[badgeColor]}`}
          >
            {badge}
          </span>
        </div>
      )}

      <h2
        className="text-4xl sm:text-5xl font-bold tracking-tight text-white max-w-3xl leading-tight"
        style={{
          transform: `translateY(${(1 - titleProgress) * 25}px)`,
          opacity: titleProgress,
        }}
      >
        {title}
      </h2>

      {subtitle && frame >= delay + 10 && (
        <p
          className="mt-3 text-lg sm:text-xl text-slate-300/90 max-w-2xl font-normal leading-relaxed"
          style={{
            transform: `translateY(${(1 - subtitleProgress) * 20}px)`,
            opacity: subtitleProgress,
          }}
        >
          {subtitle}
        </p>
      )}
    </div>
  );
};
