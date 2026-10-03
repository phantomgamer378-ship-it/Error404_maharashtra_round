import React, { useState } from 'react';
import { 
  RotateCcw, 
  RotateCw, 
  Smartphone, 
  Monitor, 
  Square, 
  Download, 
  Check, 
  Film, 
  Sliders, 
  Share2, 
  Edit2, 
  Eye, 
  EyeOff,
  Sparkles
} from 'lucide-react';
import { EditorState } from '../../features/editor/types';

interface EditorTopBarProps {
  state: EditorState;
  onSetTitle: (title: string) => void;
  onSetAspectRatio: (ratio: '9:16' | '16:9' | '1:1') => void;
  onToggleSafeArea: () => void;
  onUndo: () => void;
  onRedo: () => void;
  onExport: () => void;
  onOpenPlatformDrawer: () => void;
  onOpenWhatIf?: () => void;
  onBack: () => void;
}

export const EditorTopBar: React.FC<EditorTopBarProps> = ({
  state,
  onSetTitle,
  onSetAspectRatio,
  onToggleSafeArea,
  onUndo,
  onRedo,
  onExport,
  onOpenPlatformDrawer,
  onOpenWhatIf,
  onBack,
}) => {
  const [isEditingTitle, setIsEditingTitle] = useState(false);
  const [tempTitle, setTempTitle] = useState(state.project.title);
  const [isExported, setIsExported] = useState(false);

  const canUndo = state.history.past.length > 0;
  const canRedo = state.history.future.length > 0;

  const handleTitleSubmit = () => {
    if (tempTitle.trim()) {
      onSetTitle(tempTitle.trim());
    }
    setIsEditingTitle(false);
  };

  const handleExportClick = () => {
    onExport();
    setIsExported(true);
    setTimeout(() => setIsExported(false), 2500);
  };

  return (
    <div className="h-14 px-4 glass-panel-l2 border-b border-white/10 flex items-center justify-between shrink-0 select-none">
      {/* Left: Back & Editable Project Title */}
      <div className="flex items-center gap-3 min-w-0">
        <button 
          onClick={onBack}
          className="p-1.5 rounded-xl text-slate-400 hover:text-white hover:bg-white/10 text-xs font-semibold shrink-0"
        >
          ← Back
        </button>

        <div className="h-4 w-[1px] bg-white/10 shrink-0" />

        {isEditingTitle ? (
          <input
            type="text"
            value={tempTitle}
            onChange={(e) => setTempTitle(e.target.value)}
            onBlur={handleTitleSubmit}
            onKeyDown={(e) => e.key === 'Enter' && handleTitleSubmit()}
            autoFocus
            className="bg-black/40 border border-indigo-400 rounded-lg px-2.5 py-1 text-xs text-white font-bold focus:outline-none max-w-xs"
          />
        ) : (
          <div 
            onClick={() => setIsEditingTitle(true)}
            className="flex items-center gap-1.5 cursor-pointer group truncate max-w-xs sm:max-w-md"
            title="Click to edit project title"
          >
            <Film className="w-4 h-4 text-indigo-400 shrink-0" />
            <span className="text-xs font-bold text-white group-hover:text-indigo-300 truncate">
              {state.project.title}
            </span>
            <Edit2 className="w-3 h-3 text-slate-500 opacity-0 group-hover:opacity-100 transition-opacity shrink-0" />
          </div>
        )}

        <span className="hidden sm:inline-flex px-2 py-0.5 rounded-full bg-emerald-500/20 text-emerald-300 text-[10px] font-mono font-bold border border-emerald-500/30 shrink-0">
          AUTOSAVED
        </span>
      </div>

      {/* Center: Aspect Ratio & Safe-Area guides */}
      <div className="flex items-center gap-2">
        <div className="flex items-center gap-1 p-0.5 rounded-xl bg-white/[0.04] border border-white/10 text-xs">
          <button
            onClick={() => onSetAspectRatio('9:16')}
            className={`px-2.5 py-1 rounded-lg flex items-center gap-1 text-[11px] transition-all ${
              state.project.aspectRatio === '9:16' 
                ? 'bg-indigo-600 text-white font-semibold shadow-sm' 
                : 'text-slate-400 hover:text-white'
            }`}
          >
            <Smartphone className="w-3 h-3" /> 9:16
          </button>
          <button
            onClick={() => onSetAspectRatio('16:9')}
            className={`px-2.5 py-1 rounded-lg flex items-center gap-1 text-[11px] transition-all ${
              state.project.aspectRatio === '16:9' 
                ? 'bg-indigo-600 text-white font-semibold shadow-sm' 
                : 'text-slate-400 hover:text-white'
            }`}
          >
            <Monitor className="w-3 h-3" /> 16:9
          </button>
          <button
            onClick={() => onSetAspectRatio('1:1')}
            className={`px-2.5 py-1 rounded-lg flex items-center gap-1 text-[11px] transition-all ${
              state.project.aspectRatio === '1:1' 
                ? 'bg-indigo-600 text-white font-semibold shadow-sm' 
                : 'text-slate-400 hover:text-white'
            }`}
          >
            <Square className="w-3 h-3" /> 1:1
          </button>
        </div>

        {/* Safe-Area Guide Toggle */}
        <button
          onClick={onToggleSafeArea}
          title={state.safeAreaGuide ? "Hide social safe-area guides" : "Show social safe-area guides"}
          className={`p-1.5 rounded-xl border text-xs transition-all ${
            state.safeAreaGuide 
              ? 'bg-indigo-500/20 text-indigo-300 border-indigo-500/40' 
              : 'text-slate-500 border-white/5 hover:text-white'
          }`}
        >
          {state.safeAreaGuide ? <Eye className="w-3.5 h-3.5" /> : <EyeOff className="w-3.5 h-3.5" />}
        </button>
      </div>

      {/* Right: Undo, Redo, Export Preview, Adapt Platform */}
      <div className="flex items-center gap-2">
        <button
          onClick={onUndo}
          disabled={!canUndo}
          title="Undo (⌘Z)"
          className="p-1.5 rounded-xl glass-button text-xs font-semibold text-slate-300 disabled:opacity-30 disabled:cursor-not-allowed hover:text-white"
        >
          <RotateCcw className="w-3.5 h-3.5" />
        </button>
        <button
          onClick={onRedo}
          disabled={!canRedo}
          title="Redo (⌘⇧Z)"
          className="p-1.5 rounded-xl glass-button text-xs font-semibold text-slate-300 disabled:opacity-30 disabled:cursor-not-allowed hover:text-white"
        >
          <RotateCw className="w-3.5 h-3.5" />
        </button>

        <div className="h-4 w-[1px] bg-white/10 mx-1 hidden sm:block" />

        {onOpenWhatIf && (
          <button
            onClick={onOpenWhatIf}
            className="hidden sm:inline-flex px-3 py-1.5 rounded-xl glass-button text-xs font-semibold text-purple-300 border-purple-500/30 items-center gap-1.5 hover:bg-purple-500/10 transition-colors"
            title="Explore A/B/C Hook & Style Variants"
          >
            <Sparkles className="w-3.5 h-3.5 text-purple-400" />
            <span>Explore What-If</span>
          </button>
        )}

        <button
          onClick={onOpenPlatformDrawer}
          className="hidden md:inline-flex px-3 py-1.5 rounded-xl glass-button text-xs font-semibold text-cyan-300 border-cyan-500/30 items-center gap-1.5"
        >
          <Share2 className="w-3.5 h-3.5 text-cyan-400" />
          <span>Adapt Platform</span>
        </button>

        <button
          onClick={handleExportClick}
          className="px-4 py-1.5 rounded-xl glass-button-primary text-xs font-bold text-white shadow-glow-primary flex items-center gap-1.5"
        >
          {isExported ? <Check className="w-3.5 h-3.5 text-white" /> : <Download className="w-3.5 h-3.5" />}
          <span>{isExported ? 'Project Exported!' : 'Export Preview'}</span>
        </button>
      </div>
    </div>
  );
};
