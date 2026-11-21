import React from "react";
import {
  MessageSquare,
  ShieldCheck,
  Zap,
  Sparkles,
  Phone,
  Search,
  CheckCircle,
  Pause,
} from "lucide-react";
import { interpolate, spring, useCurrentFrame, useVideoConfig } from "remotion";
import { CameraRig } from "../components/CameraRig";
import { KineticText } from "../components/KineticText";
import { AppWindow } from "../components/AppWindow";
import { ChatBubble } from "../components/ChatBubble";

export const Scene3LiveMessenger: React.FC = () => {
  const frame = useCurrentFrame();
  const { fps } = useVideoConfig();

  // Subtle camera pan
  const camScale = interpolate(frame, [0, 720], [1.02, 1.08], {
    extrapolateRight: "clamp",
  });
  const camRotateX = interpolate(frame, [0, 720], [4, -2], {
    extrapolateRight: "clamp",
  });
  const camRotateY = interpolate(frame, [0, 720], [-2, 2], {
    extrapolateRight: "clamp",
  });

  // Telemetry banner pop
  const telemetryPop = spring({
    frame: frame - 100,
    fps,
    config: { damping: 12, mass: 0.6, stiffness: 140 },
  });

  return (
    <div className="relative w-full h-full bg-[#070b14] overflow-hidden flex items-center justify-center">
      {/* Background radial glow */}
      <div className="absolute inset-0 bg-[radial-gradient(circle_at_70%_30%,rgba(37,211,102,0.15),transparent_60%)]" />
      <div className="absolute inset-0 bg-[radial-gradient(circle_at_20%_80%,rgba(124,58,237,0.2),transparent_60%)]" />

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
        perspective={1400}
      >
        <div className="w-[1240px] flex flex-col items-center">
          <KineticText
            badge="Production Webhook Pipeline"
            badgeColor="emerald"
            title="Meta Cloud API webhook. Instant, verified replies."
            subtitle="HMAC signature verified in milliseconds. AI drafts responses automatically."
            delay={0}
            align="center"
          />

          <div className="mt-8 w-[1100px] h-[530px]">
            <AppWindow
              title="Wabrix Shared Messenger"
              badge="Meta WhatsApp Cloud API Connected"
              badgeColor="green"
            >
              <div className="flex-1 flex overflow-hidden">
                {/* Conversations Sidebar */}
                <div className="w-[340px] border-r border-white/10 bg-slate-900/70 p-4 flex flex-col">
                  {/* Search bar */}
                  <div className="h-9 px-3 rounded-lg bg-slate-800/80 border border-slate-700/80 flex items-center gap-2 text-xs text-slate-400 mb-3">
                    <Search className="w-3.5 h-3.5" />
                    <span>Search conversations...</span>
                  </div>

                  <div className="text-[10px] font-semibold text-slate-400 uppercase tracking-wider mb-2">
                    Active Threads (3)
                  </div>

                  {/* Thread 1: John Doe (Active) */}
                  <div className="p-3 rounded-xl bg-violet-600/20 border border-violet-500/40 mb-2 cursor-pointer">
                    <div className="flex items-center justify-between mb-1">
                      <span className="text-xs font-semibold text-white">
                        John Doe
                      </span>
                      <span className="text-[10px] text-violet-300">
                        1:40 PM
                      </span>
                    </div>
                    <div className="text-[11px] text-slate-300 truncate">
                      What are your customer support hours?
                    </div>
                    <div className="mt-2 flex items-center gap-1.5">
                      <span className="text-[9px] font-mono px-1.5 py-0.5 rounded bg-violet-500/30 text-violet-300">
                        AI Active
                      </span>
                      <span className="text-[9px] text-slate-400">Support</span>
                    </div>
                  </div>

                  {/* Thread 2: Sarah Jenkins */}
                  <div className="p-3 rounded-xl bg-slate-800/40 border border-slate-700/50 mb-2 opacity-70">
                    <div className="flex items-center justify-between mb-1">
                      <span className="text-xs font-medium text-slate-300">
                        Sarah Jenkins
                      </span>
                      <span className="text-[10px] text-slate-500">
                        12:15 PM
                      </span>
                    </div>
                    <div className="text-[11px] text-slate-400 truncate">
                      Could you check the status of return #WB-102?
                    </div>
                  </div>

                  {/* Thread 3: Alex Chen */}
                  <div className="p-3 rounded-xl bg-slate-800/40 border border-slate-700/50 opacity-60">
                    <div className="flex items-center justify-between mb-1">
                      <span className="text-xs font-medium text-slate-300">
                        Alex Chen
                      </span>
                      <span className="text-[10px] text-slate-500">
                        Yesterday
                      </span>
                    </div>
                    <div className="text-[11px] text-slate-400 truncate">
                      Do you have a catalog for corporate gift sets?
                    </div>
                  </div>
                </div>

                {/* Main Chat Stream */}
                <div className="flex-1 bg-slate-950/80 flex flex-col">
                  {/* Chat Header */}
                  <div className="h-14 px-6 border-b border-white/10 flex items-center justify-between bg-slate-900/40">
                    <div>
                      <div className="text-xs font-semibold text-white flex items-center gap-2">
                        <span>John Doe</span>
                        <span className="text-[11px] font-normal text-slate-400">
                          +1 (555) 234-5678
                        </span>
                      </div>
                      <div className="text-[10px] text-slate-400">
                        Routed to: Support • Meta Cloud API
                      </div>
                    </div>

                    <div className="flex items-center gap-2">
                      <button className="px-3 py-1.5 rounded-lg bg-slate-800 border border-slate-700 text-[11px] font-medium text-slate-300 flex items-center gap-1.5 shadow-sm">
                        <Pause className="w-3 h-3 text-amber-400" />
                        <span>Pause Bot (Handoff)</span>
                      </button>
                    </div>
                  </div>

                  {/* Messages Area */}
                  <div className="flex-1 p-6 flex flex-col justify-end space-y-3 overflow-hidden">
                    {/* Customer Message */}
                    <ChatBubble
                      sender="customer"
                      senderName="John Doe"
                      message="Hi! What are your customer support hours? And do you offer expedited shipping for overseas orders?"
                      time="1:40 PM"
                      delay={20}
                    />

                    {/* Telemetry processing event badge */}
                    {frame >= 100 && frame <= 280 && (
                      <div
                        className="self-center my-2 flex items-center gap-2 px-3.5 py-1.5 rounded-full bg-slate-900/90 border border-violet-500/30 text-[11px] font-mono text-violet-300 shadow-md backdrop-blur-md"
                        style={{
                          transform: `scale(${telemetryPop})`,
                          opacity: telemetryPop,
                        }}
                      >
                        <ShieldCheck className="w-3.5 h-3.5 text-emerald-400" />
                        <span>HMAC Validated</span>
                        <span className="text-slate-600">•</span>
                        <Zap className="w-3.5 h-3.5 text-amber-400" />
                        <span>RAG Context Injected</span>
                        <span className="text-slate-600">•</span>
                        <Sparkles className="w-3.5 h-3.5 text-violet-400" />
                        <span>Gemini 2.5 Flash</span>
                      </div>
                    )}

                    {/* AI Generated Answer */}
                    <ChatBubble
                      sender="bot"
                      message="Hello John! Our support team is available Monday through Friday, 9:00 AM – 5:00 PM EST. For overseas shipments, we offer International Priority (2–4 business days) if orders are placed before 2:00 PM EST today. How else can we help?"
                      time="1:41 PM"
                      sources={["support-hours.md", "shipping-policy.pdf"]}
                      delay={180}
                    />
                  </div>
                </div>
              </div>
            </AppWindow>
          </div>
        </div>
      </CameraRig>
    </div>
  );
};
