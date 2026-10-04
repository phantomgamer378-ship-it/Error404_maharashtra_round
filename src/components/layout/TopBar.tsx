import React from 'react';
import { 
  Search, 
  Sparkles, 
  Bell, 
  Plus, 
  ChevronDown, 
  Layers, 
  Command,
  Zap,
  Globe
} from 'lucide-react';
import { CreatorProfile } from '../../types';
import { ThemeToggle } from '../common/ThemeToggle';

interface TopBarProps {
  onOpenCreateModal: () => void;
  onOpenAskModal: () => void;
  creator: CreatorProfile;
  isSidebarCollapsed: boolean;
}

export const TopBar: React.FC<TopBarProps> = ({
  onOpenCreateModal,
  onOpenAskModal,
  creator,
  isSidebarCollapsed
}) => {
  return (
    <header className={`h-16 px-4 md:px-6 glass-panel-l1 border-b border-white/10 flex items-center justify-between sticky top-0 z-20 backdrop-blur-xl transition-all duration-300 ${
      isSidebarCollapsed ? 'md:ml-20' : 'md:ml-64'
    } ml-0`}>
      {/* Left Context Selector */}
      <div className="flex items-center gap-3">
        {/* Mobile: Logo pill shown only on mobile */}
        <div className="flex md:hidden items-center gap-1.5">
          <div className="w-7 h-7 rounded-lg bg-gradient-to-tr from-indigo-600 to-cyan-400 p-[1px] flex items-center justify-center">
            <div className="w-full h-full bg-[#0b0d17] rounded-[7px] flex items-center justify-center">
              <Sparkles className="w-3.5 h-3.5 text-indigo-300" />
            </div>
          </div>
          <span className="font-extrabold text-sm bg-gradient-to-r from-white via-indigo-200 to-cyan-400 bg-clip-text text-transparent">VIDORA</span>
        </div>

        <div className="hidden sm:flex items-center gap-2 px-3 py-1.5 rounded-xl glass-panel-l2 border border-white/10 text-xs font-medium text-slate-300 hover:text-white cursor-pointer transition-all">
          <Layers className="w-3.5 h-3.5 text-indigo-400" />
          <span className="text-white font-semibold hidden lg:inline">Sarth's Workspace</span>
          <span className="text-slate-500 font-mono hidden lg:inline">/</span>
          <span className="text-slate-300 truncate max-w-[120px]">AI Voice Scams</span>
          <ChevronDown className="w-3.5 h-3.5 text-slate-400 ml-1" />
        </div>

        {/* Live Signal Status Pill */}
        <div className="hidden md:flex items-center gap-1.5 px-2.5 py-1 rounded-full bg-emerald-500/10 border border-emerald-500/20 text-emerald-300 text-[11px] font-medium">
          <span className="w-1.5 h-1.5 rounded-full bg-emerald-400 animate-pulse" />
          <span>Trend Engine Active</span>
        </div>
      </div>

      {/* Center Search / Ask Command Bar */}
      <div className="flex-1 max-w-xl mx-3 md:mx-4">
        <button
          onClick={onOpenAskModal}
          className="w-full py-2 px-3 md:px-4 rounded-xl glass-panel-l2 border border-white/10 hover:border-indigo-500/40 text-left flex items-center justify-between text-xs text-slate-400 hover:text-slate-200 transition-all group shadow-sm"
        >
          <div className="flex items-center gap-2">
            <Search className="w-3.5 h-3.5 text-slate-400 group-hover:text-indigo-400 transition-colors shrink-0" />
            <span className="truncate hidden sm:inline">Search content, ideas or ask VIDORA...</span>
            <span className="truncate sm:hidden">Ask VIDORA...</span>
          </div>

          <div className="flex items-center gap-1.5 shrink-0">
            <span className="px-2 py-0.5 rounded-md bg-indigo-500/20 border border-indigo-500/30 text-indigo-300 text-[10px] font-mono font-medium flex items-center gap-1">
              <Sparkles className="w-2.5 h-2.5 text-indigo-400" />
              <span className="hidden sm:inline">Ask AI</span>
              <span className="sm:hidden">AI</span>
            </span>
            <kbd className="hidden sm:inline-flex items-center gap-0.5 px-2 py-0.5 rounded bg-white/10 text-slate-400 text-[10px] font-mono border border-white/10">
              <Command className="w-2.5 h-2.5" /> K
            </kbd>
          </div>
        </button>
      </div>

      {/* Right Controls & Profile */}
      <div className="flex items-center gap-2 md:gap-3">
        {/* Ask VIDORA Quick Button */}
        <button
          onClick={onOpenAskModal}
          className="hidden lg:flex items-center gap-1.5 px-3 py-1.5 rounded-xl glass-button text-xs font-semibold text-indigo-300 hover:text-white border-indigo-500/30 shadow-glass-sm"
        >
          <Sparkles className="w-3.5 h-3.5 text-indigo-400 animate-pulse" />
          <span>Ask VIDORA</span>
        </button>

        {/* Theme Toggle */}
        <ThemeToggle />

        {/* Notification Bell */}
        <button className="relative p-2 rounded-xl glass-button text-slate-400 hover:text-white" aria-label="Notifications">
          <Bell className="w-4 h-4" />
          <span className="absolute top-1.5 right-1.5 w-2 h-2 rounded-full bg-indigo-500 shadow-glow-primary" />
        </button>

        {/* Main CTA - hidden on mobile (bottom nav handles it) */}
        <button
          onClick={onOpenCreateModal}
          className="hidden sm:flex py-2 px-4 rounded-xl glass-button-primary font-semibold text-xs text-white items-center gap-1.5 shadow-glow-primary hover:scale-[1.02] transition-transform"
        >
          <Plus className="w-4 h-4" />
          <span>+ Create</span>
        </button>
      </div>
    </header>
  );
};
