"use client";

import { useState } from "react";
import { Play, Maximize2, Volume2 } from "lucide-react";
import { cn } from "@/lib/utils";

interface VideoPreviewProps {
  projectName: string;
  className?: string;
}

export function VideoPreview({ projectName, className }: VideoPreviewProps) {
  const [isPlaying, setIsPlaying] = useState(false);

  return (
    <div className={cn("aspect-video relative group rounded-lg overflow-hidden bg-slate-900", className)}>
      {/* 3D Grid Background Pattern */}
      <div className="absolute inset-0 opacity-30">
        <svg className="w-full h-full" xmlns="http://www.w3.org/2000/svg">
          <defs>
            <pattern id="grid" width="40" height="40" patternUnits="userSpaceOnUse">
              <path
                d="M 40 0 L 0 0 0 40"
                fill="none"
                stroke="rgba(255,255,255,0.1)"
                strokeWidth="1"
              />
            </pattern>
          </defs>
          <rect width="100%" height="100%" fill="url(#grid)" />
        </svg>
      </div>

      {/* Simulated 3D Model Preview */}
      <div className="absolute inset-0 flex items-center justify-center">
        <div className="relative">
          {/* Isometric Building Wireframe */}
          <svg
            width="200"
            height="200"
            viewBox="0 0 200 200"
            className="opacity-60"
          >
            {/* Base */}
            <path
              d="M100 180 L20 140 L20 60 L100 100 L180 60 L180 140 Z"
              fill="none"
              stroke="#facc15"
              strokeWidth="1.5"
            />
            {/* Top */}
            <path
              d="M100 100 L20 60 L100 20 L180 60 Z"
              fill="none"
              stroke="#facc15"
              strokeWidth="1.5"
            />
            {/* Vertical Lines */}
            <line x1="20" y1="60" x2="20" y2="140" stroke="#facc15" strokeWidth="1.5" />
            <line x1="100" y1="100" x2="100" y2="180" stroke="#facc15" strokeWidth="1.5" />
            <line x1="180" y1="60" x2="180" y2="140" stroke="#facc15" strokeWidth="1.5" />
            <line x1="100" y1="20" x2="100" y2="100" stroke="#facc15" strokeWidth="1.5" />
            
            {/* Internal Structure */}
            <line x1="60" y1="40" x2="60" y2="160" stroke="#facc15" strokeWidth="0.5" strokeDasharray="4" />
            <line x1="140" y1="40" x2="140" y2="160" stroke="#facc15" strokeWidth="0.5" strokeDasharray="4" />
            <path d="M20 100 L100 140 L180 100" fill="none" stroke="#facc15" strokeWidth="0.5" strokeDasharray="4" />
          </svg>

          {/* Animated rotation indicator */}
          <div className="absolute -bottom-8 left-1/2 -translate-x-1/2 flex items-center gap-2 text-xs text-slate-400">
            <svg className="w-4 h-4 animate-spin" style={{ animationDuration: "3s" }} viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2">
              <path d="M21 12a9 9 0 11-6.219-8.56" />
            </svg>
            <span>3D Preview</span>
          </div>
        </div>
      </div>

      {/* Play Button Overlay */}
      {!isPlaying && (
        <div className="absolute inset-0 flex items-center justify-center bg-black/20 group-hover:bg-black/30 transition-colors">
          <button
            onClick={() => setIsPlaying(true)}
            className="w-20 h-20 rounded-full bg-amber-400 hover:bg-amber-300 flex items-center justify-center shadow-lg transform group-hover:scale-105 transition-all"
          >
            <Play className="w-8 h-8 text-charcoal ml-1" fill="currentColor" />
          </button>
        </div>
      )}

      {/* Video Controls (shown when playing) */}
      {isPlaying && (
        <div className="absolute bottom-0 left-0 right-0 bg-gradient-to-t from-black/80 to-transparent p-4 opacity-0 group-hover:opacity-100 transition-opacity">
          <div className="flex items-center justify-between text-white">
            <div className="flex items-center gap-3">
              <button onClick={() => setIsPlaying(false)} className="hover:text-amber-400 transition-colors">
                <Play className="w-5 h-5" />
              </button>
              <span className="text-sm">0:00 / 0:30</span>
              <button className="hover:text-amber-400 transition-colors">
                <Volume2 className="w-5 h-5" />
              </button>
            </div>
            <button className="hover:text-amber-400 transition-colors">
              <Maximize2 className="w-5 h-5" />
            </button>
          </div>
        </div>
      )}

      {/* Project Name Badge */}
      <div className="absolute top-4 left-4 px-3 py-1.5 bg-black/50 backdrop-blur-sm rounded-md">
        <p className="text-sm font-medium text-white">{projectName}</p>
      </div>
    </div>
  );
}
