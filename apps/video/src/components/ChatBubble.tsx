import React from "react";
import { CheckCheck, Bot, User, FileText } from "lucide-react";
import { spring, useCurrentFrame, useVideoConfig } from "remotion";

interface ChatBubbleProps {
  sender: "customer" | "bot" | "operator";
  senderName?: string;
  message: string;
  time?: string;
  sources?: string[];
  delay?: number;
  className?: string;
}

export const ChatBubble: React.FC<ChatBubbleProps> = ({
  sender,
  senderName,
  message,
  time = "1:42 PM",
  sources = [],
  delay = 0,
  className = "",
}) => {
  const frame = useCurrentFrame();
  const { fps } = useVideoConfig();

  const progress = spring({
    frame: frame - delay,
    fps,
    config: {
      damping: 14,
      mass: 0.8,
      stiffness: 120,
    },
  });

  const isIncoming = sender === "customer";
  const isBot = sender === "bot";
  const isOperator = sender === "operator";

  if (frame < delay) {
    return null;
  }

  return (
    <div
      className={`flex flex-col my-2 max-w-[85%] ${
        isIncoming ? "self-start items-start" : "self-end items-end"
      } ${className}`}
      style={{
        transform: `translateY(${(1 - progress) * 20}px) scale(${0.85 + progress * 0.15})`,
        opacity: progress,
        transformOrigin: isIncoming ? "bottom left" : "bottom right",
      }}
    >
      {/* Sender Header if AI / Operator */}
      {!isIncoming && (
        <div className="flex items-center gap-1.5 mb-1 px-1">
          {isBot ? (
            <>
              <Bot className="w-3 h-3 text-violet-400" />
              <span className="text-[11px] font-medium text-violet-400">
                AI Assistant (Gemini 2.5 Flash)
              </span>
            </>
          ) : (
            <>
              <User className="w-3 h-3 text-amber-400" />
              <span className="text-[11px] font-medium text-amber-400">
                Support Team (Operator Takeover)
              </span>
            </>
          )}
        </div>
      )}

      {isIncoming && senderName && (
        <div className="text-[11px] font-medium text-slate-400 mb-1 px-1">
          {senderName}
        </div>
      )}

      {/* Bubble Container */}
      <div
        className={`rounded-2xl px-4 py-3 text-sm leading-relaxed shadow-md backdrop-blur-md relative ${
          isIncoming
            ? "bg-slate-800/90 text-slate-100 border border-slate-700/80 rounded-tl-sm"
            : isBot
              ? "bg-violet-900/60 text-slate-50 border border-violet-500/40 rounded-tr-sm"
              : "bg-emerald-950/70 text-slate-50 border border-emerald-500/40 rounded-tr-sm"
        }`}
      >
        <p className="whitespace-pre-wrap">{message}</p>

        {/* Grounding Sources Badge */}
        {sources.length > 0 && (
          <div className="mt-2.5 pt-2 border-t border-white/10 flex flex-wrap items-center gap-1.5">
            <span className="text-[10px] text-slate-400 font-medium">
              Grounding sources:
            </span>
            {sources.map((src, i) => (
              <span
                key={i}
                className="inline-flex items-center gap-1 text-[10px] font-mono px-1.5 py-0.5 rounded bg-black/40 text-violet-300 border border-violet-500/30"
              >
                <FileText className="w-2.5 h-2.5" />
                {src}
              </span>
            ))}
          </div>
        )}

        {/* Footer: Time & WhatsApp Checkmarks */}
        <div className="mt-1.5 flex items-center justify-end gap-1 select-none">
          <span className="text-[10px] text-slate-400/80">{time}</span>
          {!isIncoming && (
            <CheckCheck className="w-3.5 h-3.5 text-sky-400 shrink-0 inline-block ml-0.5" />
          )}
        </div>
      </div>
    </div>
  );
};
