'use client';

import * as React from 'react';
import Link from 'next/link';
import {
  RiPlayFill,
  RiArrowRightLine,
  RiSparklingLine,
  RiGithubFill,
} from '@remixicon/react';
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
  const [isPlaying, setIsPlaying] = React.useState(false);
  const videoRef = React.useRef<HTMLVideoElement>(null);
  const currentUrl = videoUrl || siteConfig.demoVideo.url;

  // Attempt smooth play when modal opens
  React.useEffect(() => {
    if (isOpen && videoRef.current) {
      const v = videoRef.current;
      v.currentTime = 0;
      
      const playPromise = v.play();
      if (playPromise !== undefined) {
        playPromise
          .then(() => {
            setIsPlaying(true);
          })
          .catch(() => {
            // If browser autoplay policy blocks unmuted playback, mute and retry
            v.muted = true;
            v.play()
              .then(() => setIsPlaying(true))
              .catch(() => setIsPlaying(false));
          });
      }
    } else if (!isOpen && videoRef.current) {
      videoRef.current.pause();
      setIsPlaying(false);
    }
  }, [isOpen]);

  const handleManualPlay = () => {
    if (videoRef.current) {
      if (videoRef.current.paused) {
        videoRef.current.play().then(() => setIsPlaying(true)).catch(() => {});
      } else {
        videoRef.current.pause();
        setIsPlaying(false);
      }
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
        <div className="relative aspect-video w-full bg-black group">
          <video
            key={currentUrl}
            ref={videoRef}
            src={currentUrl}
            controls
            playsInline
            preload="auto"
            onPlay={() => setIsPlaying(true)}
            onPause={() => setIsPlaying(false)}
            onEnded={() => setIsPlaying(false)}
            className="w-full h-full object-contain"
          >
            Your browser does not support HTML5 video playback.
          </video>

          {/* Big Center Play Button Overlay when paused */}
          {!isPlaying && (
            <div
              onClick={handleManualPlay}
              className="absolute inset-0 flex items-center justify-center bg-black/30 backdrop-blur-[2px] cursor-pointer transition-opacity"
            >
              <div className="flex size-16 items-center justify-center rounded-full bg-violet-600/90 text-white shadow-2xl transition-transform hover:scale-110 active:scale-95 border border-violet-400/50">
                <RiPlayFill className="size-8 fill-current ml-1" />
              </div>
            </div>
          )}
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
