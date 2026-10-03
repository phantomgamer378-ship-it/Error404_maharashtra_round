import React, { useState } from 'react';
import { 
  Film, 
  Layers, 
  Wrench, 
  Music, 
  Type, 
  Sparkles, 
  Plus, 
  Lock, 
  Unlock, 
  Volume2, 
  VolumeX, 
  Scissors,
  Video
} from 'lucide-react';
import { TimelineTrack, TimelineClip } from '../../features/editor/types';

interface LeftToolsPanelProps {
  tracks: TimelineTrack[];
  onAddTextClip: () => void;
  onAddCaptionClip: () => void;
}

export const LeftToolsPanel: React.FC<LeftToolsPanelProps> = ({
  tracks,
  onAddTextClip,
  onAddCaptionClip,
}) => {
  const [activeTab, setActiveTab] = useState<'media' | 'layers' | 'tools'>('media');

  return (
    <div className="w-full lg:w-64 glass-panel-l2 border-r border-white/10 flex flex-col shrink-0 select-none overflow-hidden bg-[#06070B]">
      {/* Tab Switcher Icons */}
      <div className="h-11 px-3 border-b border-white/10 flex items-center justify-between shrink-0 bg-[#080910]">
        <div className="flex items-center gap-1">
          <button
            onClick={() => setActiveTab('media')}
            className={`p-1.5 rounded-lg text-xs font-bold transition-all flex items-center gap-1.5 ${
              activeTab === 'media'
                ? 'bg-indigo-600 text-white shadow-sm'
                : 'text-slate-400 hover:text-white'
            }`}
          >
            <Film className="w-3.5 h-3.5" />
            <span>Media</span>
          </button>
          <button
            onClick={() => setActiveTab('layers')}
            className={`p-1.5 rounded-lg text-xs font-bold transition-all flex items-center gap-1.5 ${
              activeTab === 'layers'
                ? 'bg-indigo-600 text-white shadow-sm'
                : 'text-slate-400 hover:text-white'
            }`}
          >
            <Layers className="w-3.5 h-3.5" />
            <span>Layers</span>
          </button>
          <button
            onClick={() => setActiveTab('tools')}
            className={`p-1.5 rounded-lg text-xs font-bold transition-all flex items-center gap-1.5 ${
              activeTab === 'tools'
                ? 'bg-indigo-600 text-white shadow-sm'
                : 'text-slate-400 hover:text-white'
            }`}
          >
            <Wrench className="w-3.5 h-3.5" />
            <span>Tools</span>
          </button>
        </div>
      </div>

      {/* Content Body */}
      <div className="flex-1 p-3 space-y-3 overflow-y-auto">
        {/* MEDIA TAB */}
        {activeTab === 'media' && (
          <div className="space-y-3 text-xs">
            <span className="text-[10px] font-mono text-slate-400 uppercase font-bold block">
              Source & B-Roll Assets
            </span>

            {/* Source A-Roll Item */}
            <div className="p-2.5 rounded-xl bg-white/[0.03] border border-white/5 space-y-1.5 hover:border-indigo-400 transition-colors cursor-pointer">
              <div className="relative h-20 rounded-lg overflow-hidden bg-slate-900">
                <img
                  src="https://images.unsplash.com/photo-1590602847861-f357a9332bbc?w=600&auto=format&fit=crop&q=80"
                  alt="Raw Studio"
                  className="w-full h-full object-cover"
                />
                <span className="absolute bottom-1 right-1 px-1.5 py-0.2 rounded bg-black/80 text-[9px] font-mono text-white">
                  44:18
                </span>
              </div>
              <p className="font-bold text-white text-[11px] truncate">
                EP42_AI_SECURITY_RAW.mp4
              </p>
              <span className="text-[9px] text-slate-500 font-mono block">
                Source Range: 00:17:20 - 00:18:02
              </span>
            </div>

            {/* B-Roll Item */}
            <div className="p-2.5 rounded-xl bg-white/[0.03] border border-white/5 space-y-1.5 hover:border-cyan-400 transition-colors cursor-pointer">
              <div className="relative h-16 rounded-lg overflow-hidden bg-slate-900">
                <img
                  src="https://images.unsplash.com/photo-1526374965328-7f61d4dc18c5?w=600&auto=format&fit=crop&q=80"
                  alt="Hacker Waveform"
                  className="w-full h-full object-cover"
                />
                <span className="absolute bottom-1 right-1 px-1.5 py-0.2 rounded bg-black/80 text-[9px] font-mono text-cyan-300">
                  B-ROLL
                </span>
              </div>
              <p className="font-bold text-white text-[11px] truncate">
                Waveform_Glitch_Overlay.mp4
              </p>
            </div>
          </div>
        )}

        {/* LAYERS TAB */}
        {activeTab === 'layers' && (
          <div className="space-y-2 text-xs">
            <span className="text-[10px] font-mono text-slate-400 uppercase font-bold block">
              Active Timeline Tracks
            </span>

            {tracks.map((track) => (
              <div
                key={track.id}
                className="p-2.5 rounded-xl bg-white/[0.02] border border-white/5 flex items-center justify-between"
              >
                <div className="flex items-center gap-2 truncate">
                  <span className="text-white font-medium text-[11px] truncate">{track.label}</span>
                </div>
                <span className="text-[10px] text-slate-500 font-mono">
                  {track.clips.length} clip{track.clips.length !== 1 ? 's' : ''}
                </span>
              </div>
            ))}
          </div>
        )}

        {/* TOOLS TAB */}
        {activeTab === 'tools' && (
          <div className="space-y-2 text-xs">
            <span className="text-[10px] font-mono text-slate-400 uppercase font-bold block">
              Quick Generators
            </span>

            <button
              onClick={onAddTextClip}
              className="w-full p-2.5 rounded-xl glass-button text-xs font-semibold text-slate-200 hover:text-white flex items-center gap-2"
            >
              <Type className="w-4 h-4 text-purple-400" />
              <span>+ Add Text Overlay</span>
            </button>

            <button
              onClick={onAddCaptionClip}
              className="w-full p-2.5 rounded-xl glass-button text-xs font-semibold text-slate-200 hover:text-white flex items-center gap-2"
            >
              <Sparkles className="w-4 h-4 text-amber-400" />
              <span>+ Add Caption Block</span>
            </button>
          </div>
        )}
      </div>
    </div>
  );
};
