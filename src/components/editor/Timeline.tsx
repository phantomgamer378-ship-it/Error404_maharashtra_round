import React, { useRef, useState, useEffect } from 'react';
import { 
  Play, 
  Pause, 
  Scissors, 
  Trash2, 
  ZoomIn, 
  ZoomOut, 
  RotateCcw, 
  RotateCw, 
  Volume2, 
  VolumeX, 
  Lock, 
  Unlock,
  Type,
  Film,
  Music,
  Sliders,
  ChevronLeft,
  ChevronRight
} from 'lucide-react';
import { EditorState, TimelineTrack, TimelineClip } from '../../features/editor/types';

interface TimelineProps {
  state: EditorState;
  onSetPlayhead: (time: number) => void;
  onTogglePlay: () => void;
  onSelectClip: (clipId: string | null) => void;
  onTrimClip: (clipId: string, newStart: number, newEnd: number) => void;
  onSplitClip: () => void;
  onDeleteClip: () => void;
  onUpdateClipText: (clipId: string, text: string) => void;
  onSetZoom: (zoom: number) => void;
  onUndo: () => void;
  onRedo: () => void;
}

export const Timeline: React.FC<TimelineProps> = ({
  state,
  onSetPlayhead,
  onTogglePlay,
  onSelectClip,
  onTrimClip,
  onSplitClip,
  onDeleteClip,
  onUpdateClipText,
  onSetZoom,
  onUndo,
  onRedo,
}) => {
  const containerRef = useRef<HTMLDivElement | null>(null);
  const [isScrubbing, setIsScrubbing] = useState(false);
  const [inlineEditingClipId, setInlineEditingClipId] = useState<string | null>(null);

  const { tracks, playhead, zoomLevel, selectedClipId, project } = state;
  const totalDuration = project.duration;

  // Global Keyboard Shortcuts
  useEffect(() => {
    const handleKeyDown = (e: KeyboardEvent) => {
      // Don't trigger shortcuts if user is typing in an input/textarea
      const targetTag = (e.target as HTMLElement)?.tagName?.toLowerCase();
      if (targetTag === 'input' || targetTag === 'textarea') {
        return;
      }

      // Space: Toggle Play
      if (e.code === 'Space') {
        e.preventDefault();
        onTogglePlay();
      }

      // S: Split at playhead
      if (e.key === 's' || e.key === 'S') {
        e.preventDefault();
        onSplitClip();
      }

      // Delete / Backspace: Delete selected clip
      if (e.key === 'Delete' || e.key === 'Backspace') {
        e.preventDefault();
        onDeleteClip();
      }

      // Undo: Cmd+Z
      if ((e.metaKey || e.ctrlKey) && !e.shiftKey && e.key.toLowerCase() === 'z') {
        e.preventDefault();
        onUndo();
      }

      // Redo: Cmd+Shift+Z or Ctrl+Y
      if (((e.metaKey || e.ctrlKey) && e.shiftKey && e.key.toLowerCase() === 'z') || ((e.metaKey || e.ctrlKey) && e.key.toLowerCase() === 'y')) {
        e.preventDefault();
        onRedo();
      }
    };

    window.addEventListener('keydown', handleKeyDown);
    return () => window.removeEventListener('keydown', handleKeyDown);
  }, [onTogglePlay, onSplitClip, onDeleteClip, onUndo, onRedo]);

  // Scrubbing & seeking playhead
  const handleTimelineMouseDown = (e: React.MouseEvent<HTMLDivElement>) => {
    if (!containerRef.current) return;
    const rect = containerRef.current.getBoundingClientRect();
    const clickX = e.clientX - rect.left;
    const newTime = Math.max(0, Math.min(totalDuration, clickX / zoomLevel));
    onSetPlayhead(newTime);
    setIsScrubbing(true);
  };

  const handleTimelineTouchStart = (e: React.TouchEvent<HTMLDivElement>) => {
    if (!containerRef.current) return;
    const touch = e.touches[0];
    if (!touch) return;
    const rect = containerRef.current.getBoundingClientRect();
    const clickX = touch.clientX - rect.left;
    const newTime = Math.max(0, Math.min(totalDuration, clickX / zoomLevel));
    onSetPlayhead(newTime);
    setIsScrubbing(true);
  };

  const handleMouseMove = (e: MouseEvent) => {
    if (!isScrubbing || !containerRef.current) return;
    const rect = containerRef.current.getBoundingClientRect();
    const currentX = e.clientX - rect.left;
    const newTime = Math.max(0, Math.min(totalDuration, currentX / zoomLevel));
    onSetPlayhead(newTime);
  };

  const handleMouseUp = () => {
    if (isScrubbing) {
      setIsScrubbing(false);
    }
  };

  const handleTouchMove = (e: TouchEvent) => {
    if (!isScrubbing || !containerRef.current) return;
    const touch = e.touches[0];
    if (!touch) return;
    const rect = containerRef.current.getBoundingClientRect();
    const currentX = touch.clientX - rect.left;
    const newTime = Math.max(0, Math.min(totalDuration, currentX / zoomLevel));
    onSetPlayhead(newTime);
  };

  useEffect(() => {
    if (isScrubbing) {
      window.addEventListener('mousemove', handleMouseMove);
      window.addEventListener('mouseup', handleMouseUp);
      window.addEventListener('touchmove', handleTouchMove);
      window.addEventListener('touchend', handleMouseUp);
      return () => {
        window.removeEventListener('mousemove', handleMouseMove);
        window.removeEventListener('mouseup', handleMouseUp);
        window.removeEventListener('touchmove', handleTouchMove);
        window.removeEventListener('touchend', handleMouseUp);
      };
    }
  }, [isScrubbing]);

  // Format seconds to mm:ss.s
  const formatTime = (seconds: number) => {
    const mins = Math.floor(seconds / 60);
    const secs = (seconds % 60).toFixed(1);
    return `${mins.toString().padStart(2, '0')}:${+secs < 10 ? '0' : ''}${secs}`;
  };

  return (
    <div className="h-56 glass-panel-l3 border-t border-white/10 flex flex-col justify-between shrink-0 select-none overflow-hidden">
      {/* 1. TIMELINE TOP TOOLBAR */}
      <div className="h-10 px-4 border-b border-white/10 flex items-center justify-between text-xs text-slate-400 shrink-0 bg-[#07080E]/80">
        
        {/* Playback Controls & Time */}
        <div className="flex items-center gap-3">
          <button 
            onClick={onTogglePlay}
            className="p-1.5 rounded-lg bg-indigo-600 text-white hover:bg-indigo-500 shadow-glow-primary transition-all"
            title="Play / Pause (Space)"
          >
            {state.isPlaying ? <Pause className="w-3.5 h-3.5" /> : <Play className="w-3.5 h-3.5 fill-white" />}
          </button>

          <div className="flex items-center gap-1 font-mono text-[11px]">
            <span className="text-white font-bold">{formatTime(playhead)}</span>
            <span className="text-slate-500">/</span>
            <span className="text-slate-400">{formatTime(totalDuration)}</span>
          </div>

          <div className="h-4 w-[1px] bg-white/10 mx-1" />

          {/* Split at playhead action */}
          <button
            onClick={onSplitClip}
            className="px-2.5 py-1 rounded-lg glass-button text-[11px] font-semibold text-slate-200 hover:text-white flex items-center gap-1"
            title="Split clip at playhead (S)"
          >
            <Scissors className="w-3 h-3 text-indigo-400" />
            <span>Split</span>
            <kbd className="text-[9px] font-mono text-slate-500 bg-white/5 px-1 rounded">S</kbd>
          </button>

          {/* Delete selected clip action */}
          <button
            onClick={onDeleteClip}
            disabled={!selectedClipId}
            className="px-2.5 py-1 rounded-lg glass-button text-[11px] font-semibold text-slate-200 hover:text-rose-400 flex items-center gap-1 disabled:opacity-30 disabled:cursor-not-allowed"
            title="Delete selected clip (Del)"
          >
            <Trash2 className="w-3 h-3 text-rose-400" />
            <span>Delete</span>
            <kbd className="text-[9px] font-mono text-slate-500 bg-white/5 px-1 rounded">Del</kbd>
          </button>
        </div>

        {/* Zoom Controls */}
        <div className="flex items-center gap-3">
          <div className="flex items-center gap-2">
            <ZoomOut 
              className="w-3.5 h-3.5 text-slate-400 cursor-pointer hover:text-white" 
              onClick={() => onSetZoom(zoomLevel - 6)}
            />
            <input
              type="range"
              min="12"
              max="50"
              value={zoomLevel}
              onChange={(e) => onSetZoom(+e.target.value)}
              className="w-20 accent-indigo-500 cursor-pointer h-1 bg-white/10 rounded-lg"
            />
            <ZoomIn 
              className="w-3.5 h-3.5 text-slate-400 cursor-pointer hover:text-white" 
              onClick={() => onSetZoom(zoomLevel + 6)}
            />
          </div>

          <span className="text-[10px] text-slate-500 font-mono hidden md:inline">
            Zoom: {zoomLevel}px/s
          </span>
        </div>
      </div>

      {/* 2. MAIN TRACKS & RULER AREA */}
      <div className="flex-1 flex overflow-hidden relative">
        
        {/* Track Headers (Left sidebar) */}
        <div className="w-36 sm:w-44 border-r border-white/10 bg-[#06070B] flex flex-col shrink-0 select-none z-20">
          {/* Ruler spacer */}
          <div className="h-6 border-b border-white/10 px-3 flex items-center text-[10px] font-mono text-slate-500">
            TRACKS
          </div>

          {/* Track Labels */}
          {tracks.map((track) => (
            <div
              key={track.id}
              className="px-3 border-b border-white/5 flex items-center justify-between text-[11px] font-semibold text-slate-300"
              style={{ height: `${track.height}px` }}
            >
              <div className="flex items-center gap-1.5 truncate">
                {track.type === 'video' && <Film className="w-3 h-3 text-indigo-400 shrink-0" />}
                {track.type === 'audio' && <Music className="w-3 h-3 text-pink-400 shrink-0" />}
                {track.type === 'captions' && <Type className="w-3 h-3 text-amber-400 shrink-0" />}
                {track.type === 'text' && <Type className="w-3 h-3 text-purple-400 shrink-0" />}
                {track.type === 'b-roll' && <Sliders className="w-3 h-3 text-cyan-400 shrink-0" />}
                <span className="truncate">{track.label}</span>
              </div>
            </div>
          ))}
        </div>

        {/* Scrollable Tracks Canvas with Ruler & Playhead */}
        <div 
          className="flex-1 overflow-x-auto overflow-y-hidden relative bg-[#040509]"
          onMouseDown={handleTimelineMouseDown}
        >
          <div 
            ref={containerRef}
            className="relative h-full"
            style={{ width: `${Math.max(800, totalDuration * zoomLevel + 120)}px` }}
          >
            {/* Timeline Seconds Ruler */}
            <div className="h-6 border-b border-white/10 flex items-center relative text-[9px] font-mono text-slate-500 pointer-events-none">
              {Array.from({ length: Math.ceil(totalDuration) + 1 }).map((_, sec) => (
                <div
                  key={sec}
                  className="absolute flex flex-col items-center"
                  style={{ left: `${sec * zoomLevel}px` }}
                >
                  <div className="h-2 w-[1px] bg-white/20" />
                  {sec % 2 === 0 && (
                    <span className="mt-0.5">{sec}s</span>
                  )}
                </div>
              ))}
            </div>

            {/* Playhead Scrub Line */}
            <div
              className="absolute top-0 bottom-0 w-[2px] bg-rose-500 z-30 pointer-events-none transition-all duration-75"
              style={{ left: `${playhead * zoomLevel}px` }}
            >
              <div className="w-3 h-3 rounded-full bg-rose-500 -ml-[5px] -mt-1 shadow-glow-primary flex items-center justify-center">
                <div className="w-1 h-1 rounded-full bg-white" />
              </div>
            </div>

            {/* Tracks Body */}
            {tracks.map((track) => (
              <div
                key={track.id}
                className="relative border-b border-white/5 relative"
                style={{ height: `${track.height}px` }}
              >
                {track.clips.map((clip) => {
                  const isSelected = selectedClipId === clip.id;
                  const clipLeft = clip.startSeconds * zoomLevel;
                  const clipWidth = Math.max(30, clip.duration * zoomLevel);

                  return (
                    <div
                      key={clip.id}
                      onClick={(e) => {
                        e.stopPropagation();
                        onSelectClip(clip.id);
                      }}
                      className={`absolute top-1 bottom-1 rounded-lg px-2 flex items-center justify-between text-[11px] font-mono cursor-pointer transition-all border group overflow-hidden ${
                        isSelected
                          ? 'border-indigo-400 ring-2 ring-indigo-500/60 shadow-glow-primary z-20 brightness-110'
                          : 'border-white/15 hover:border-white/40'
                      }`}
                      style={{
                        left: `${clipLeft}px`,
                        width: `${clipWidth}px`,
                        backgroundColor: clip.color ? `${clip.color}35` : 'rgba(99, 102, 241, 0.25)',
                        borderColor: isSelected ? '#818CF8' : clip.color || '#4338CA'
                      }}
                    >
                      {/* Left Trim Handle */}
                      <div
                        className="absolute left-0 top-0 bottom-0 w-2.5 bg-white/20 hover:bg-indigo-400 cursor-ew-resize opacity-0 group-hover:opacity-100 transition-opacity z-10 flex items-center justify-center"
                        title="Drag to trim start"
                        onMouseDown={(e) => {
                          e.stopPropagation();
                          const startX = e.clientX;
                          const initialStart = clip.startSeconds;
                          const handleMove = (ev: MouseEvent) => {
                            const deltaSec = (ev.clientX - startX) / zoomLevel;
                            onTrimClip(clip.id, initialStart + deltaSec, clip.endSeconds);
                          };
                          const handleUp = () => {
                            window.removeEventListener('mousemove', handleMove);
                            window.removeEventListener('mouseup', handleUp);
                          };
                          window.addEventListener('mousemove', handleMove);
                          window.addEventListener('mouseup', handleUp);
                        }}
                      >
                        <ChevronLeft className="w-2.5 h-2.5 text-white pointer-events-none" />
                      </div>

                      {/* Clip Title & Editable Content */}
                      <div className="truncate px-1.5 flex items-center gap-1.5 w-full">
                        {inlineEditingClipId === clip.id ? (
                          <input
                            type="text"
                            value={clip.content || clip.title}
                            autoFocus
                            onClick={(e) => e.stopPropagation()}
                            onChange={(e) => onUpdateClipText(clip.id, e.target.value)}
                            onBlur={() => setInlineEditingClipId(null)}
                            onKeyDown={(e) => e.key === 'Enter' && setInlineEditingClipId(null)}
                            className="bg-black/80 text-white px-1.5 py-0.5 rounded text-[10px] w-full border border-indigo-400 focus:outline-none"
                          />
                        ) : (
                          <span 
                            onDoubleClick={(e) => {
                              e.stopPropagation();
                              if (clip.trackType === 'text' || clip.trackType === 'captions') {
                                setInlineEditingClipId(clip.id);
                              }
                            }}
                            className="truncate text-white font-medium drop-shadow text-[10px]"
                            title="Double-click to edit text inline"
                          >
                            {clip.content ? `"${clip.content}"` : clip.title}
                          </span>
                        )}
                      </div>

                      {/* Right Trim Handle */}
                      <div
                        className="absolute right-0 top-0 bottom-0 w-2.5 bg-white/20 hover:bg-indigo-400 cursor-ew-resize opacity-0 group-hover:opacity-100 transition-opacity z-10 flex items-center justify-center"
                        title="Drag to trim end"
                        onMouseDown={(e) => {
                          e.stopPropagation();
                          const startX = e.clientX;
                          const initialEnd = clip.endSeconds;
                          const handleMove = (ev: MouseEvent) => {
                            const deltaSec = (ev.clientX - startX) / zoomLevel;
                            onTrimClip(clip.id, clip.startSeconds, initialEnd + deltaSec);
                          };
                          const handleUp = () => {
                            window.removeEventListener('mousemove', handleMove);
                            window.removeEventListener('mouseup', handleUp);
                          };
                          window.addEventListener('mousemove', handleMove);
                          window.addEventListener('mouseup', handleUp);
                        }}
                      >
                        <ChevronRight className="w-2.5 h-2.5 text-white pointer-events-none" />
                      </div>
                    </div>
                  );
                })}
              </div>
            ))}
          </div>
        </div>
      </div>
    </div>
  );
};
