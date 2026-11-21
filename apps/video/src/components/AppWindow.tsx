import React from "react";

interface AppWindowProps {
  title: string;
  badge?: string;
  badgeColor?: "green" | "purple" | "amber" | "blue";
  children: React.ReactNode;
  width?: string | number;
  height?: string | number;
  className?: string;
}

export const AppWindow: React.FC<AppWindowProps> = ({
  title,
  badge,
  badgeColor = "purple",
  children,
  width = "100%",
  height = "100%",
  className = "",
}) => {
  const badgeColors = {
    green: "bg-emerald-500/10 text-emerald-400 border-emerald-500/20",
    purple: "bg-violet-500/10 text-violet-400 border-violet-500/20",
    amber: "bg-amber-500/10 text-amber-400 border-amber-500/20",
    blue: "bg-blue-500/10 text-blue-400 border-blue-500/20",
  };

  return (
    <div
      className={`relative rounded-2xl border border-white/10 bg-[#0f172a]/95 backdrop-blur-xl shadow-2xl overflow-hidden flex flex-col ${className}`}
      style={{
        width,
        height,
        boxShadow:
          "0 25px 60px -15px rgba(0, 0, 0, 0.7), 0 0 40px 0 rgba(139, 92, 246, 0.15)",
      }}
    >
      {/* Top Header Bar */}
      <div className="h-11 px-4 border-b border-white/10 bg-slate-900/80 flex items-center justify-between select-none shrink-0">
        <div className="flex items-center gap-2">
          <div className="w-3 h-3 rounded-full bg-[#ff5f56] border border-[#e0443e]/50" />
          <div className="w-3 h-3 rounded-full bg-[#ffbd2e] border border-[#dea123]/50" />
          <div className="w-3 h-3 rounded-full bg-[#27c93f] border border-[#1aab29]/50" />
        </div>

        <div className="flex items-center gap-2">
          <span className="text-xs font-medium text-slate-300 tracking-wide">
            {title}
          </span>
          {badge && (
            <span
              className={`text-[10px] px-2 py-0.5 rounded-full border font-medium ${badgeColors[badgeColor]}`}
            >
              {badge}
            </span>
          )}
        </div>

        <div className="w-12 flex justify-end">
          <div className="w-2 h-2 rounded-full bg-slate-700" />
        </div>
      </div>

      {/* Main Body */}
      <div className="flex-1 flex flex-col overflow-hidden relative">
        {children}
      </div>
    </div>
  );
};
