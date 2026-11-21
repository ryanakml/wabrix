import React from "react";
import {
  FileText,
  UploadCloud,
  CheckCircle2,
  Sparkles,
  Bot,
  Send,
  Database,
  Search,
} from "lucide-react";
import { interpolate, spring, useCurrentFrame, useVideoConfig } from "remotion";
import { CameraRig } from "../components/CameraRig";
import { KineticText } from "../components/KineticText";
import { AppWindow } from "../components/AppWindow";

export const Scene2KnowledgeBase: React.FC = () => {
  const frame = useCurrentFrame();
  const { fps } = useVideoConfig();

  // Camera choreography
  const camScale = interpolate(frame, [0, 600], [0.95, 1.05], {
    extrapolateRight: "clamp",
  });
  const camRotateX = interpolate(frame, [0, 300, 600], [5, 0, -2], {
    extrapolateRight: "clamp",
  });
  const camRotateY = interpolate(frame, [0, 300, 600], [-3, 0, 3], {
    extrapolateRight: "clamp",
  });

  // Animated document drop
  const dropProgress = spring({
    frame: frame - 60,
    fps,
    config: { damping: 12, mass: 0.8, stiffness: 130 },
  });

  // Chunking particle pulse
  const chunkingAnim = frame >= 120;

  // Bot emulator typing progress
  const emulatorResponseProgress = spring({
    frame: frame - 240,
    fps,
    config: { damping: 14, mass: 0.9, stiffness: 110 },
  });

  return (
    <div className="relative w-full h-full bg-[#070b14] overflow-hidden flex items-center justify-center">
      {/* Ambient background glow */}
      <div className="absolute inset-0 bg-[radial-gradient(circle_at_20%_40%,rgba(139,92,246,0.22),transparent_55%)]" />
      <div className="absolute inset-0 bg-[radial-gradient(circle_at_80%_60%,rgba(59,130,246,0.15),transparent_60%)]" />

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
            badge="Vector Knowledge Grounding"
            badgeColor="purple"
            title="Grounded in your business docs. Zero hallucinations."
            subtitle="Upload PDFs and Markdown manuals. AI retrieves exact citations in real time."
            delay={0}
            align="center"
          />

          <div className="mt-8 w-[1100px] h-[520px]">
            <AppWindow
              title="Wabrix Knowledge Base & RAG Studio"
              badge="Gemini 2.5 Flash Grounded"
              badgeColor="purple"
            >
              <div className="flex-1 flex overflow-hidden">
                {/* Left Panel: Document Ingestion */}
                <div className="w-[480px] border-r border-white/10 bg-slate-900/60 p-6 flex flex-col">
                  <div className="flex items-center justify-between mb-4">
                    <div className="flex items-center gap-2">
                      <Database className="w-4 h-4 text-violet-400" />
                      <span className="text-xs font-semibold text-slate-200 uppercase tracking-wider">
                        Document Sources
                      </span>
                    </div>
                    <span className="text-[11px] font-mono text-emerald-400 bg-emerald-500/10 px-2 py-0.5 rounded-full border border-emerald-500/20">
                      Sync Active
                    </span>
                  </div>

                  {/* Existing Document */}
                  <div className="p-3 rounded-xl bg-slate-800/80 border border-slate-700/80 mb-3 flex items-center justify-between">
                    <div className="flex items-center gap-3">
                      <div className="p-2 rounded-lg bg-violet-500/10 border border-violet-500/20 text-violet-400">
                        <FileText className="w-4 h-4" />
                      </div>
                      <div>
                        <div className="text-xs font-medium text-slate-100">
                          support_hours_2026.md
                        </div>
                        <div className="text-[10px] text-slate-400">
                          Markdown • 4 chunks • 100% indexed
                        </div>
                      </div>
                    </div>
                    <CheckCircle2 className="w-4 h-4 text-emerald-400" />
                  </div>

                  {/* Animated Incoming Document Drop */}
                  {frame >= 60 && (
                    <div
                      className="p-3 rounded-xl bg-violet-950/40 border border-violet-500/50 mb-3 flex items-center justify-between shadow-lg"
                      style={{
                        transform: `translateY(${(1 - dropProgress) * -40}px)`,
                        opacity: dropProgress,
                      }}
                    >
                      <div className="flex items-center gap-3">
                        <div className="p-2 rounded-lg bg-violet-500/20 border border-violet-500/40 text-violet-300">
                          <FileText className="w-4 h-4" />
                        </div>
                        <div>
                          <div className="text-xs font-semibold text-violet-200">
                            shipping_policy.pdf
                          </div>
                          <div className="text-[10px] text-violet-300/80">
                            PDF • 6 chunks • Embedding generated
                          </div>
                        </div>
                      </div>
                      <span className="text-[10px] font-mono text-violet-300 bg-violet-500/20 px-2 py-0.5 rounded-full">
                        Indexed
                      </span>
                    </div>
                  )}

                  {/* Upload Dropzone */}
                  <div className="mt-auto border-2 border-dashed border-slate-700/80 rounded-xl p-4 flex flex-col items-center justify-center text-center bg-slate-900/40">
                    <UploadCloud className="w-6 h-6 text-slate-400 mb-1" />
                    <span className="text-xs font-medium text-slate-300">
                      Drop SOP manuals or product FAQs
                    </span>
                    <span className="text-[10px] text-slate-500 mt-0.5">
                      PDF, Markdown, TXT (Auto-chunked & embedded)
                    </span>
                  </div>
                </div>

                {/* Right Panel: Interactive Bot Emulator */}
                <div className="flex-1 bg-slate-950/70 p-6 flex flex-col">
                  <div className="flex items-center justify-between mb-4 pb-3 border-b border-white/10">
                    <div className="flex items-center gap-2">
                      <Sparkles className="w-4 h-4 text-violet-400" />
                      <span className="text-xs font-semibold text-slate-200 uppercase tracking-wider">
                        RAG Grounding Emulator
                      </span>
                    </div>
                    <span className="text-[11px] font-mono text-violet-300">
                      Model: Gemini 2.5 Flash
                    </span>
                  </div>

                  {/* Playground Conversation */}
                  <div className="flex-1 flex flex-col justify-end space-y-3 pb-4">
                    {/* Test Prompt */}
                    {frame >= 180 && (
                      <div className="self-end max-w-[80%] rounded-2xl bg-slate-800 text-slate-100 px-4 py-2.5 text-xs border border-slate-700 shadow-sm">
                        What are your customer support hours and overseas
                        delivery options?
                      </div>
                    )}

                    {/* Grounded AI Answer */}
                    {frame >= 240 && (
                      <div
                        className="self-start max-w-[88%] rounded-2xl bg-violet-950/60 text-slate-100 p-4 text-xs border border-violet-500/40 shadow-lg"
                        style={{
                          transform: `translateY(${(1 - emulatorResponseProgress) * 20}px)`,
                          opacity: emulatorResponseProgress,
                        }}
                      >
                        <div className="flex items-center gap-1.5 text-violet-400 font-medium mb-1.5">
                          <Bot className="w-3.5 h-3.5" />
                          <span>Wabrix Assistant</span>
                        </div>
                        <p className="leading-relaxed">
                          Our support team is available Monday through Friday
                          from 9:00 AM to 5:00 PM EST. For overseas shipments,
                          we offer International Priority (2–4 business days).
                        </p>

                        <div className="mt-3 pt-2.5 border-t border-white/10 flex items-center gap-2">
                          <span className="text-[10px] text-slate-400 font-medium">
                            Grounded Citations:
                          </span>
                          <span className="inline-flex items-center gap-1 text-[10px] font-mono px-2 py-0.5 rounded bg-violet-900/60 text-violet-300 border border-violet-500/30">
                            📄 support_hours_2026.md:L12
                          </span>
                          <span className="inline-flex items-center gap-1 text-[10px] font-mono px-2 py-0.5 rounded bg-violet-900/60 text-violet-300 border border-violet-500/30">
                            📄 shipping_policy.pdf:P2
                          </span>
                        </div>
                      </div>
                    )}
                  </div>

                  {/* Input bar */}
                  <div className="h-10 rounded-xl bg-slate-900 border border-slate-700/80 px-3 flex items-center justify-between text-xs text-slate-400">
                    <span>Ask a question against your knowledge base...</span>
                    <Send className="w-3.5 h-3.5 text-slate-500" />
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
