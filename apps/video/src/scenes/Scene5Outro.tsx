import React from "react";
import { MessageSquare, ArrowRight, Github, ExternalLink } from "lucide-react";
import { interpolate, spring, useCurrentFrame, useVideoConfig } from "remotion";
import { CameraRig } from "../components/CameraRig";

export const Scene5Outro: React.FC = () => {
  const frame = useCurrentFrame();
  const { fps } = useVideoConfig();

  // Intro spring
  const logoScale = spring({
    frame: frame - 15,
    fps,
    config: { damping: 12, mass: 0.8, stiffness: 120 },
  });

  const contentSpring = spring({
    frame: frame - 45,
    fps,
    config: { damping: 14, mass: 0.8, stiffness: 100 },
  });

  // Outro fade to black
  const fadeOut = interpolate(frame, [380, 420], [1, 0], {
    extrapolateRight: "clamp",
    extrapolateLeft: "clamp",
  });

  return (
    <div
      className="relative w-full h-full bg-[#070b14] overflow-hidden flex items-center justify-center select-none"
      style={{ opacity: fadeOut }}
    >
      {/* Background radial glow */}
      <div className="absolute inset-0 bg-[radial-gradient(circle_at_50%_45%,rgba(124,58,237,0.28),transparent_65%)]" />
      <div className="absolute inset-0 bg-[radial-gradient(circle_at_50%_55%,rgba(37,211,102,0.12),transparent_50%)]" />

      {/* Grid Pattern */}
      <div
        className="absolute inset-0 opacity-[0.04]"
        style={{
          backgroundImage: `linear-gradient(#fff 1px, transparent 1px), linear-gradient(90deg, #fff 1px, transparent 1px)`,
          backgroundSize: "60px 60px",
        }}
      />

      <CameraRig scale={1} perspective={1200}>
        <div className="flex flex-col items-center text-center max-w-4xl px-8">
          {/* Wabrix Wordmark / Logo Badge */}
          <div
            className="flex items-center gap-4 mb-6"
            style={{
              transform: `scale(${logoScale})`,
              opacity: logoScale,
            }}
          >
            <div className="w-16 h-16 rounded-2xl bg-gradient-to-tr from-violet-600 via-violet-500 to-emerald-400 p-0.5 shadow-[0_0_50px_rgba(139,92,246,0.6)] flex items-center justify-center">
              <div className="w-full h-full bg-[#0a0f1d] rounded-2xl flex items-center justify-center">
                <MessageSquare className="w-8 h-8 text-violet-400 fill-violet-400/20" />
              </div>
            </div>
            <span className="text-6xl font-bold tracking-tight text-white font-sans">
              wa<span className="text-violet-400">brix</span>
            </span>
          </div>

          {/* Tagline */}
          <h1
            className="text-3xl sm:text-4xl font-semibold tracking-tight text-slate-100 max-w-2xl leading-snug"
            style={{
              transform: `translateY(${(1 - contentSpring) * 20}px)`,
              opacity: contentSpring,
            }}
          >
            WhatsApp shared inbox with AI-assisted replies.
          </h1>

          <p
            className="mt-4 text-base sm:text-lg text-slate-400 max-w-xl"
            style={{
              transform: `translateY(${(1 - contentSpring) * 15}px)`,
              opacity: contentSpring,
            }}
          >
            Connect Cloud API, upload business documents, and empower your
            support operators with grounded AI drafting and 1-click control.
          </p>

          {/* Feature Pillars Pill Bar */}
          {frame >= 60 && (
            <div className="mt-8 flex flex-wrap items-center justify-center gap-2.5 max-w-2xl">
              {[
                "Meta Cloud API",
                "Gemini 2.5 Flash",
                "Vector Grounding",
                "1-Click Handoff",
                "Convex Realtime",
              ].map((feat, i) => (
                <span
                  key={i}
                  className="px-3 py-1 rounded-full text-xs font-medium bg-slate-900/80 border border-white/10 text-slate-300 shadow-sm backdrop-blur-md"
                >
                  {feat}
                </span>
              ))}
            </div>
          )}

          {/* CTA & URLs */}
          {frame >= 90 && (
            <div className="mt-10 flex items-center gap-4">
              <div className="px-6 py-3 rounded-xl bg-violet-600 text-white font-medium text-sm flex items-center gap-2 shadow-[0_0_30px_rgba(124,58,237,0.5)]">
                <span>Explore Live Demo: wabrix.nylo.me</span>
                <ExternalLink className="w-4 h-4" />
              </div>

              <div className="px-5 py-3 rounded-xl bg-slate-900/90 border border-slate-700 text-slate-300 font-medium text-sm flex items-center gap-2">
                <Github className="w-4 h-4" />
                <span>github.com/ryanakml/wabrix</span>
              </div>
            </div>
          )}
        </div>
      </CameraRig>
    </div>
  );
};
