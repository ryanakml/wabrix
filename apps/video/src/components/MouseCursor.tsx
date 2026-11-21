import React from "react";
import { MousePointer2 } from "lucide-react";
import { spring, useCurrentFrame, useVideoConfig } from "remotion";

interface MouseCursorProps {
  x: number;
  y: number;
  clickFrame?: number;
  label?: string;
}

export const MouseCursor: React.FC<MouseCursorProps> = ({
  x,
  y,
  clickFrame,
  label,
}) => {
  const frame = useCurrentFrame();
  const { fps } = useVideoConfig();

  const isClicking =
    clickFrame !== undefined && frame >= clickFrame && frame <= clickFrame + 15;

  const clickScale =
    clickFrame !== undefined && frame >= clickFrame
      ? spring({
          frame: frame - clickFrame,
          fps,
          config: { damping: 10, mass: 0.5, stiffness: 200 },
        })
      : 1;

  const rippleScale =
    clickFrame !== undefined && frame >= clickFrame
      ? (frame - clickFrame) / 15
      : 0;

  const rippleOpacity =
    clickFrame !== undefined && frame >= clickFrame
      ? Math.max(0, 1 - (frame - clickFrame) / 15)
      : 0;

  return (
    <div
      className="absolute z-50 pointer-events-none transition-all duration-75"
      style={{
        left: `${x}px`,
        top: `${y}px`,
        transform: `translate(-2px, -2px) scale(${isClicking ? 0.9 : 1})`,
      }}
    >
      {/* Ripple ring on click */}
      {clickFrame !== undefined && frame >= clickFrame && (
        <div
          className="absolute -top-3 -left-3 w-8 h-8 rounded-full border-2 border-violet-400 pointer-events-none"
          style={{
            transform: `scale(${1 + rippleScale * 1.5})`,
            opacity: rippleOpacity,
          }}
        />
      )}

      {/* Cursor arrow */}
      <MousePointer2 className="w-6 h-6 text-violet-400 fill-violet-500 drop-shadow-[0_4px_10px_rgba(0,0,0,0.8)]" />

      {/* Operator pill label */}
      {label && (
        <div className="ml-5 -mt-2 px-2 py-0.5 rounded-full bg-violet-600 text-white text-[10px] font-semibold tracking-wide shadow-lg border border-violet-400/50 whitespace-nowrap">
          {label}
        </div>
      )}
    </div>
  );
};
