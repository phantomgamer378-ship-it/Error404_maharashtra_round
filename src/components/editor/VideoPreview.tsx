import React, { useRef, useEffect } from 'react';
import { Play, Pause, Volume2, VolumeX, Maximize2, ShieldAlert, Sparkles, Check, BrainCircuit } from 'lucide-react';
import { EditorState, TimelineClip } from '../../features/editor/types';
import { ContextualFloatingToolbar } from './ContextualFloatingToolbar';

interface VideoPreviewProps {
  state: EditorState;
  onSetPlayhead: (time: number) => void;
  onTogglePlay: () => void;
  onSelectClip: (clipId: string) => void;
  onApplyPreset?: (promptText: string) => void;
  isAiProcessing?: boolean;
}

export const VideoPreview: React.FC<VideoPreviewProps> = ({
  state,
  onSetPlayhead,
  onTogglePlay,
  onSelectClip,
  onApplyPreset,
  isAiProcessing = false,
}) => {
  const videoRef = useRef<HTMLVideoElement | null>(null);

  // Find active video clip
  const videoTrack = state.tracks.find(t => t.type === 'video');
  const activeVideoClip = videoTrack?.clips[0];

  // Find currently selected clip across all tracks
  const selectedClip = state.tracks
    .flatMap(t => t.clips)
    .find(c => c.id === state.selectedClipId) || null;

  // Find all active overlays matching current playhead
  const activeClipsAtTime = state.tracks
    .flatMap(t => t.clips)
    .filter(clip => state.playhead >= clip.startSeconds && state.playhead <= clip.endSeconds);

  const activeTextClips = activeClipsAtTime.filter(c => c.trackType === 'text');
  const activeCaptionClips = activeClipsAtTime.filter(c => c.trackType === 'captions');

  // Handle video playback synchronization
  useEffect(() => {
    const video = videoRef.current;
    if (!video) return;

    if (state.isPlaying) {
      video.play().catch(() => {});
    } else {
      video.pause();
    }
  }, [state.isPlaying]);

  // Sync video time to state playhead if difference is noticeable
  useEffect(() => {
    const video = videoRef.current;
    if (!video) return;

    if (Math.abs(video.currentTime - state.playhead) > 0.3) {
      video.currentTime = state.playhead;
    }
  }, [state.playhead]);

  // Handle video timeupdate loop
  const handleTimeUpdate = () => {
    const video = videoRef.current;
    if (!video || !state.isPlaying) return;

    if (video.currentTime >= state.project.duration) {
      onSetPlayhead(0);
      onTogglePlay();
    } else {
      onSetPlayhead(video.currentTime);
    }
  };

  // Dimensions based on aspect ratio
  const frameClass = 
    state.project.aspectRatio === '9:16'
      ? 'w-[270px] sm:w-[290px] h-[480px] sm:h-[515px]'
      : state.project.aspectRatio === '16:9'
      ? 'w-[560px] sm:w-[620px] h-[315px] sm:h-[350px]'
      : 'w-[380px] h-[380px]';

  return (
    <div className="flex-1 bg-[#040508] relative flex flex-col items-center justify-center p-4 overflow-hidden select-none">
      
      {/* 9:16 Canvas Device Frame */}
      <div 
        className={`relative rounded-3xl overflow-hidden border border-white/20 bg-slate-950 shadow-2xl transition-all duration-300 flex items-center justify-center ${frameClass}`}
      >
        {/* Real HTML5 Video */}
        <video
          ref={videoRef}
          src={activeVideoClip?.sourceUrl || "https://commondatastorage.googleapis.com/gtv-videos-bucket/sample/ForBiggerBlazes.mp4"}
          onTimeUpdate={handleTimeUpdate}
          onEnded={() => onTogglePlay()}
          playsInline
          muted={videoTrack?.isMuted || false}
          className="w-full h-full object-cover"
        />

        {/* Ambient Dark Gradient */}
        <div className="absolute inset-0 bg-gradient-to-t from-black/85 via-transparent to-black/30 pointer-events-none" />

        {/* SOCIAL SAFE-AREA GUIDES (TIKTOK / REELS ENGAGEMENT UI OVERLAY) */}
        {state.safeAreaGuide && state.project.aspectRatio === '9:16' && (
          <div className="absolute inset-0 pointer-events-none z-10 border-2 border-indigo-400/20 m-2 rounded-2xl flex flex-col justify-between p-3">
            {/* Top Bar Header Safe Bounds */}
            <div className="flex items-center justify-between text-[10px] text-white/50 font-mono">
              <span className="bg-black/40 px-2 py-0.5 rounded">Safe Top: 80px</span>
              <span className="bg-indigo-500/20 text-indigo-300 px-2 py-0.5 rounded border border-indigo-500/30">
                Safe Area Active
              </span>
            </div>

            {/* Right Engagement Icons (Mock TikTok/Reels UI) */}
            <div className="self-end space-y-4 pr-1 mb-8 opacity-40">
              <div className="w-8 h-8 rounded-full bg-white/20 flex items-center justify-center text-[10px] text-white">❤️</div>
              <div className="w-8 h-8 rounded-full bg-white/20 flex items-center justify-center text-[10px] text-white">💬</div>
              <div className="w-8 h-8 rounded-full bg-white/20 flex items-center justify-center text-[10px] text-white">↗️</div>
            </div>

            {/* Bottom Caption Safe Bounds */}
            <div className="text-[10px] text-white/40 font-mono bg-black/40 px-2 py-0.5 rounded self-start">
              Safe Bottom: 95px
            </div>
          </div>
        )}

        {/* DYNAMIC TEXT OVERLAYS */}
        {activeTextClips.map((clip) => {
          const isSelected = state.selectedClipId === clip.id;
          const isRecentlyChanged = state.recentlyChangedClipId === clip.id;
          const posStyle = 
            clip.style?.position === 'top' ? 'top-10' :
            clip.style?.position === 'bottom' ? 'bottom-20' : 'top-1/2 -translate-y-1/2';

          return (
            <div
              key={clip.id}
              onClick={() => onSelectClip(clip.id)}
              className={`absolute ${posStyle} left-4 right-4 p-2.5 rounded-xl cursor-pointer transition-all z-20 ${
                isRecentlyChanged
                  ? 'border-2 border-emerald-400 ring-4 ring-emerald-500/50 bg-emerald-950/80 shadow-glow-primary scale-[1.02]'
                  : isSelected
                  ? 'border-2 border-indigo-400 ring-2 ring-indigo-500/50 bg-indigo-950/80 shadow-glow-primary'
                  : 'border border-white/20 bg-black/60 hover:border-white/40'
              }`}
              style={{
                backgroundColor: clip.style?.backgroundColor || 'rgba(0,0,0,0.7)'
              }}
            >
              {/* Contextual Floating Toolbar attached to selected element */}
              {isSelected && onApplyPreset && (
                <ContextualFloatingToolbar
                  selectedClip={clip}
                  onApplyPreset={onApplyPreset}
                  isAiProcessing={isAiProcessing}
                />
              )}

              {/* INLINE AI THINKING STATE (Specific element only, never full-screen blocker!) */}
              {isAiProcessing && isSelected && (
                <div className="absolute inset-0 bg-indigo-950/90 backdrop-blur-sm rounded-xl flex items-center justify-center gap-2 text-indigo-300 font-mono text-xs z-30 border border-indigo-400/50 animate-pulse">
                  <Sparkles className="w-4 h-4 animate-spin text-indigo-400" />
                  <span>Refining with Creator DNA...</span>
                </div>
              )}

              {/* RECENTLY CHANGED DIFF CHIP */}
              {isRecentlyChanged && (
                <div className="absolute -bottom-8 left-1/2 -translate-x-1/2 z-30 px-2 py-0.5 rounded-lg bg-emerald-500/30 text-emerald-300 border border-emerald-400/50 text-[10px] font-mono whitespace-nowrap shadow-lg flex items-center gap-1 backdrop-blur-md">
                  <Check className="w-3 h-3 text-emerald-400" />
                  <span>Scoped AI Edit Applied</span>
                </div>
              )}

              <div className="flex items-center justify-between text-[9px] font-mono text-indigo-300 mb-0.5">
                <span>{clip.title}</span>
                {isSelected && <span>✓ SELECTED</span>}
              </div>
              <p 
                className="font-extrabold text-center leading-snug drop-shadow-md text-white"
                style={{
                  fontSize: clip.style?.fontSize ? `${clip.style.fontSize}px` : '15px',
                  color: clip.style?.color || '#ffffff'
                }}
              >
                {clip.content}
              </p>
            </div>
          );
        })}

        {/* DYNAMIC CAPTIONS (SUBTITLES) OVERLAY */}
        {activeCaptionClips.map((clip) => {
          const isSelected = state.selectedClipId === clip.id;
          const isRecentlyChanged = state.recentlyChangedClipId === clip.id;

          return (
            <div
              key={clip.id}
              onClick={() => onSelectClip(clip.id)}
              className={`absolute bottom-8 left-3 right-3 text-center cursor-pointer transition-all z-20 ${
                isRecentlyChanged
                  ? 'ring-2 ring-emerald-400 rounded-xl p-1 bg-black/90 scale-105'
                  : isSelected ? 'ring-2 ring-amber-400 rounded-xl p-1 bg-black/80' : ''
              }`}
            >
              {isSelected && onApplyPreset && (
                <ContextualFloatingToolbar
                  selectedClip={clip}
                  onApplyPreset={onApplyPreset}
                  isAiProcessing={isAiProcessing}
                />
              )}

              {/* Inline AI Thinking for Captions */}
              {isAiProcessing && isSelected && (
                <div className="absolute inset-0 bg-amber-950/80 backdrop-blur-sm rounded-lg flex items-center justify-center gap-1.5 text-amber-300 font-mono text-[10px] z-30 animate-pulse">
                  <Sparkles className="w-3 h-3 animate-spin text-amber-400" />
                  <span>Adapting subtitles...</span>
                </div>
              )}

              <span 
                className="px-3 py-1 rounded-lg bg-black/85 text-amber-300 font-extrabold text-xs uppercase tracking-wide shadow-2xl inline-block"
                style={{
                  color: clip.style?.color || '#FBBF24',
                  fontSize: clip.style?.fontSize ? `${clip.style.fontSize}px` : '14px'
                }}
              >
                {clip.content}
              </span>
            </div>
          );
        })}

        {/* Play / Pause Center Overlay Button */}
        <button
          onClick={onTogglePlay}
          className="absolute inset-0 m-auto w-14 h-14 rounded-full bg-indigo-600/80 hover:bg-indigo-500 text-white flex items-center justify-center backdrop-blur-md shadow-glow-primary transition-transform hover:scale-110 z-30"
        >
          {state.isPlaying ? <Pause className="w-6 h-6" /> : <Play className="w-6 h-6 ml-1" />}
        </button>
      </div>

      {/* Floating Canvas Meta Pill */}
      <div className="mt-3 flex items-center gap-3 text-[11px] font-mono text-slate-400 bg-white/[0.03] px-3 py-1 rounded-full border border-white/5">
        <span>Playhead: <strong className="text-white">{state.playhead.toFixed(1)}s</strong> / {state.project.duration}s</span>
        <span>• Aspect: <strong className="text-indigo-300">{state.project.aspectRatio}</strong></span>
        <span>• FPS: 30</span>
      </div>
    </div>
  );
};
