import React from "react";
import { MessageSquare, Bell, AlertCircle } from "lucide-react";
import { interpolate, spring, useCurrentFrame, useVideoConfig } from "remotion";
import { CameraRig } from "../components/CameraRig";
import { KineticText } from "../components/KineticText";
import { ChatBubble } from "../components/ChatBubble";

export const Scene1Friction: React.FC = () => {
  const frame = useCurrentFrame();
  const { fps } = useVideoConfig();

  // Subtle camera drift
  const camScale = interpolate(frame, [0, 480], [1, 1.08], {
    extrapolateRight: "clamp",
  });
  const camRotateX = interpolate(frame, [0, 480], [0, 6], {
    extrapolateRight: "clamp",
  });
  const camRotateY = interpolate(frame, [0, 480], [0, -4], {
    extrapolateRight: "clamp",
  });

  // Notification badge bounce
  const badgePop = spring({
    frame: frame - 20,
    fps,
    config: { damping: 10, mass: 0.6, stiffness: 150 },
  });

  return (
    <div className="relative w-full h-full bg-[#070b14] overflow-hidden flex items-center justify-center">
      {/* Background radial glow */}
      <div className="absolute inset-0 bg-[radial-gradient(circle_at_50%_30%,rgba(124,58,237,0.18),transparent_60%)]" />
      <div className="absolute inset-0 bg-[radial-gradient(circle_at_80%_80%,rgba(37,211,102,0.1),transparent_50%)]" />

      {/* Grid Pattern */}
      <div
        className="absolute inset-0 opacity-[0.04]"
        style={{
          backgroundImage: `linear-gradient(#fff 1px, transparent 1px), linear-gradient(90deg, #fff 1px, transparent 1px)`,
          backgroundSize: "60px 60px",
        }}
      />

      <CameraRig
        scale={camScale}
        rotateX={camRotateX}
        rotateY={camRotateY}
        perspective={1200}
      >
        <div className="w-[1200px] flex flex-col items-center">
          {/* Kinetic Headline */}
          <KineticText
            badge="Customer Support Chaos"
            badgeColor="amber"
            title="Your customers live on WhatsApp."
            subtitle="Repetitive questions shouldn't drown your support operators."
            delay={0}
            align="center"
          />

          {/* WhatsApp Notification Stream Simulator */}
          <div className="mt-10 w-[720px] relative">
            {/* Top Bar Floating Pill */}
            {frame >= 20 && (
              <div
                className="mx-auto w-fit mb-5 flex items-center gap-2.5 px-4 py-1.5 rounded-full bg-slate-900/90 border border-red-500/30 shadow-lg backdrop-blur-md"
                style={{
                  transform: `scale(${badgePop})`,
                  opacity: badgePop,
                }}
              >
                <div className="relative">
                  <Bell className="w-3.5 h-3.5 text-red-400" />
                  <span className="absolute -top-1 -right-1 w-2 h-2 rounded-full bg-red-500 animate-ping" />
                </div>
                <span className="text-xs font-semibold text-slate-200">
                  99+ Inbound Customer Messages Piling Up
                </span>
                <span className="text-[10px] font-mono px-1.5 py-0.5 rounded bg-red-950/80 text-red-400 border border-red-800/50">
                  +12/min
                </span>
              </div>
            )}

            {/* Staggered WhatsApp Inbound Bubbles */}
            <div className="flex flex-col gap-1">
              <ChatBubble
                sender="customer"
                senderName="John Doe • +1 (555) 234-5678"
                message="Hi! What are your store hours? And do you ship expedited overseas?"
                time="1:40 PM"
                delay={40}
              />

              <ChatBubble
                sender="customer"
                senderName="Sarah Jenkins • +1 (555) 871-3320"
                message="Can I return an item purchased during clearance last Friday?"
                time="1:41 PM"
                delay={110}
              />

              <ChatBubble
                sender="customer"
                senderName="Alex Chen • +44 7700 900123"
                message="Do you offer bulk wholesale catalogs for retail partners?"
                time="1:42 PM"
                delay={180}
              />

              <ChatBubble
                sender="customer"
                senderName="Emily Watson • +1 (555) 942-0192"
                message="Where is order #WB-8810? The tracking number says pending."
                time="1:43 PM"
                delay={250}
              />
            </div>
          </div>
        </div>
      </CameraRig>
    </div>
  );
};
