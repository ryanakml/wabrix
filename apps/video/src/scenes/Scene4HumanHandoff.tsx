import React from "react";
import { Pause, Play, UserCheck, ShieldAlert } from "lucide-react";
import { interpolate, spring, useCurrentFrame, useVideoConfig } from "remotion";
import { CameraRig } from "../components/CameraRig";
import { KineticText } from "../components/KineticText";
import { AppWindow } from "../components/AppWindow";
import { ChatBubble } from "../components/ChatBubble";
import { MouseCursor } from "../components/MouseCursor";

export const Scene4HumanHandoff: React.FC = () => {
  const frame = useCurrentFrame();
  const { fps } = useVideoConfig();

  // Camera framing
  const camScale = interpolate(frame, [0, 480], [1.02, 1.07], {
    extrapolateRight: "clamp",
  });
  const camRotateX = interpolate(frame, [0, 480], [3, 0], {
    extrapolateRight: "clamp",
  });

  // Cursor navigation to the "Pause Bot" button
  const cursorX = interpolate(frame, [0, 90, 120, 160], [850, 940, 960, 980], {
    extrapolateRight: "clamp",
  });
  const cursorY = interpolate(frame, [0, 90, 120, 160], [450, 310, 305, 330], {
    extrapolateRight: "clamp",
  });

  // Handoff state (clicks at frame 110)
  const isPaused = frame >= 110;

  // Status tag animation
  const statusSpring = spring({
    frame: frame - 110,
    fps,
    config: { damping: 12, mass: 0.6, stiffness: 140 },
  });

  return (
    <div className="relative w-full h-full bg-[#070b14] overflow-hidden flex items-center justify-center">
      {/* Background radial glow */}
      <div className="absolute inset-0 bg-[radial-gradient(circle_at_60%_40%,rgba(245,158,11,0.15),transparent_60%)]" />
      <div className="absolute inset-0 bg-[radial-gradient(circle_at_30%_70%,rgba(124,58,237,0.15),transparent_60%)]" />

      {/* Grid Pattern */}
      <div
        className="absolute inset-0 opacity-[0.04]"
        style={{
          backgroundImage: `linear-gradient(#fff 1px, transparent 1px), linear-gradient(90deg, #fff 1px, transparent 1px)`,
          backgroundSize: "60px 60px",
        }}
      />

      <CameraRig scale={camScale} rotateX={camRotateX} perspective={1400}>
        <div className="w-[1240px] flex flex-col items-center relative">
          <KineticText
            badge="Human-in-the-Loop Architecture"
            badgeColor="amber"
            title="Full operator control. 1-click human handoff."
            subtitle="When sensitive issues arise, pause automation instantly and step in."
            delay={0}
            align="center"
          />

          <div className="mt-8 w-[1100px] h-[520px] relative">
            <AppWindow
              title="Wabrix Operator Console"
              badge={isPaused ? "Human Operator Active" : "Bot Active"}
              badgeColor={isPaused ? "amber" : "purple"}
            >
              <div className="flex-1 bg-slate-950/80 flex flex-col">
                {/* Header with 1-click handoff button */}
                <div className="h-16 px-8 border-b border-white/10 flex items-center justify-between bg-slate-900/50">
                  <div>
                    <div className="text-sm font-semibold text-white flex items-center gap-2">
                      <span>Sarah Jenkins</span>
                      <span className="text-xs font-normal text-slate-400">
                        +1 (555) 871-3320
                      </span>
                    </div>
                    <div className="text-xs text-slate-400 flex items-center gap-2 mt-0.5">
                      <span>Thread #WB-102</span>
                      <span className="text-slate-600">•</span>
                      <span
                        className={
                          isPaused
                            ? "text-amber-400 font-medium"
                            : "text-violet-400"
                        }
                      >
                        {isPaused
                          ? "Operator Takeover Active"
                          : "AI Monitoring"}
                      </span>
                    </div>
                  </div>

                  {/* The Handoff Toggle Button */}
                  <div className="relative">
                    <button
                      className={`px-4 py-2 rounded-xl text-xs font-semibold flex items-center gap-2 transition-all duration-200 shadow-lg ${
                        isPaused
                          ? "bg-amber-500/20 text-amber-300 border border-amber-500/40"
                          : "bg-slate-800 text-slate-200 border border-slate-700 hover:border-violet-500"
                      }`}
                    >
                      {isPaused ? (
                        <>
                          <Play className="w-3.5 h-3.5 text-emerald-400 fill-emerald-400" />
                          <span>Resume Bot Automation</span>
                        </>
                      ) : (
                        <>
                          <Pause className="w-3.5 h-3.5 text-amber-400 fill-amber-400" />
                          <span>Pause Bot (Handoff)</span>
                        </>
                      )}
                    </button>

                    {/* Operator Takeover Pill Banner */}
                    {isPaused && (
                      <div
                        className="absolute -bottom-8 right-0 whitespace-nowrap text-[10px] font-mono px-2 py-0.5 rounded bg-amber-950/90 text-amber-300 border border-amber-600/40 shadow-md"
                        style={{
                          transform: `scale(${statusSpring})`,
                          opacity: statusSpring,
                        }}
                      >
                        ✓ AI generation paused by operator
                      </div>
                    )}
                  </div>
                </div>

                {/* Messages stream */}
                <div className="flex-1 p-8 flex flex-col justify-end space-y-4 overflow-hidden">
                  {/* Sensitive Customer Escalation */}
                  <ChatBubble
                    sender="customer"
                    senderName="Sarah Jenkins"
                    message="Hi, my package arrived with damaged items and I need a replacement right away."
                    time="1:41 PM"
                    delay={10}
                  />

                  {/* Operator Manual Response after taking over */}
                  {isPaused && (
                    <ChatBubble
                      sender="operator"
                      message="Hi Sarah, Support Team here. We sincerely apologize for the inconvenience. We have approved and initiated a priority replacement for order #WB-102 immediately. Your new tracking link has been sent to your email."
                      time="1:42 PM"
                      delay={180}
                    />
                  )}
                </div>
              </div>
            </AppWindow>

            {/* Programmatic Mouse Cursor clicking the Pause Bot button */}
            {frame < 220 && (
              <MouseCursor
                x={cursorX}
                y={cursorY}
                clickFrame={110}
                label="Operator Takeover"
              />
            )}
          </div>
        </div>
      </CameraRig>
    </div>
  );
};
