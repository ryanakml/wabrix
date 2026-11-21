'use client';

import * as React from 'react';
import Link from 'next/link';
import { RiPlayFill, RiArrowRightLine, RiSparklingLine, RiGithubFill } from '@remixicon/react';
import {
  Dialog,
  DialogContent,
  DialogTrigger,
  DialogTitle,
  DialogDescription,
} from '@/components/ui/dialog';
import { siteConfig } from '@/app/siteConfig';

interface DemoVideoDialogProps {
  children?: React.ReactNode;
  videoUrl?: string;
}

export function DemoVideoDialog({ children, videoUrl }: DemoVideoDialogProps) {
  const [isOpen, setIsOpen] = React.useState(false);
  const videoRef = React.useRef<HTMLVideoElement>(null);
  const [videoSrc, setVideoSrc] = React.useState(videoUrl || siteConfig.demoVideo.url);

  // Handle auto-play on open and pause on close
  React.useEffect(() => {
    if (isOpen) {
      const timer = setTimeout(() => {
        videoRef.current?.play().catch(() => {
          // Autoplay blocked by browser policy until user interacts
        });
      }, 150);
      return () => clearTimeout(timer);
    } else {
      videoRef.current?.pause();
    }
  }, [isOpen]);

  const handleVideoError = () => {
    // If remote CDN fails, fallback to local static copy
    if (videoSrc !== '/videos/wabrix-demo.mp4') {
      setVideoSrc('/videos/wabrix-demo.mp4');
    }
  };

  return (
    <Dialog open={isOpen} onOpenChange={setIsOpen}>
      <DialogTrigger asChild>
        {children || (
          <button
            type="button"
            className="inline-flex cursor-pointer items-center justify-center gap-2 rounded-lg border border-violet-200 bg-violet-50/70 px-4 py-2.5 text-sm font-semibold text-violet-700 shadow-xs transition-all hover:border-violet-300 hover:bg-violet-100/70 focus:outline-hidden focus:ring-2 focus:ring-violet-500 focus:ring-offset-2"
          >
            <div className="flex size-5 items-center justify-center rounded-full bg-violet-600 text-white">
              <RiPlayFill className="size-3 fill-current ml-0.5" />
            </div>
            <span>Watch 45s demo</span>
          </button>
        )}
      </DialogTrigger>

      <DialogContent className="sm:max-w-4xl p-0 overflow-hidden bg-slate-950 border border-white/10 text-white shadow-2xl rounded-2xl">
        {/* Header Bar */}
        <div className="px-5 py-3.5 border-b border-white/10 bg-slate-900/90 flex items-center justify-between">
          <div className="flex items-center gap-2.5">
            <div className="flex size-6 items-center justify-center rounded-full bg-violet-500/20 text-violet-400 border border-violet-500/30">
              <RiSparklingLine className="size-3.5" />
            </div>
            <div>
              <DialogTitle className="text-sm font-semibold text-white tracking-wide">
                Wabrix Product Walkthrough
              </DialogTitle>
              <DialogDescription className="text-[11px] text-slate-400">
                45s studio demo • Meta WhatsApp Cloud API + Gemini 2.5 Flash Grounding
              </DialogDescription>
            </div>
          </div>

          <div className="flex items-center gap-2 mr-6">
            <span className="hidden sm:inline-flex items-center text-[10px] font-mono px-2 py-0.5 rounded-full bg-violet-500/10 text-violet-300 border border-violet-500/20">
              Remotion 60 FPS
            </span>
          </div>
        </div>

        {/* 16:9 Video Canvas */}
        <div className="relative aspect-video w-full bg-black">
          <video
            ref={videoRef}
            src={videoSrc}
            onError={handleVideoError}
            controls
            playsInline
            preload="metadata"
            poster={siteConfig.demoVideo.poster}
            className="w-full h-full object-contain"
          >
            Your browser does not support HTML5 video playback.
          </video>
        </div>

        {/* Action Footer */}
        <div className="p-4 bg-slate-900/80 border-t border-white/10 flex flex-col sm:flex-row items-center justify-between gap-3 text-xs text-slate-300">
          <div className="text-center sm:text-left">
            <span className="text-slate-400">Ready to explore with your own WhatsApp number?</span>
          </div>

          <div className="flex items-center gap-2.5 w-full sm:w-auto justify-end">
            <a
              href={siteConfig.repositories.current}
              target="_blank"
              rel="noopener noreferrer"
              className="inline-flex items-center gap-1.5 px-3 py-1.5 rounded-lg border border-slate-700 bg-slate-800 text-slate-300 hover:text-white hover:bg-slate-700 transition-colors"
            >
              <RiGithubFill className="size-3.5" />
              <span>GitHub</span>
            </a>

            <Link
              href="/auth/sign-in"
              onClick={() => setIsOpen(false)}
              className="inline-flex items-center gap-1.5 px-4 py-1.5 rounded-lg bg-violet-600 text-white font-medium hover:bg-violet-500 transition-colors shadow-sm"
            >
              <span>Open live demo</span>
              <RiArrowRightLine className="size-3.5" />
            </Link>
          </div>
        </div>
      </DialogContent>
    </Dialog>
  );
}
