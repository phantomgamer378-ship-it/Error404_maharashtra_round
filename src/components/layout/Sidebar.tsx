import React from 'react';
import { motion } from 'framer-motion';
import { 
  LayoutDashboard, 
  TrendingUp, 
  Lightbulb, 
  PlusCircle, 
  FolderKanban, 
  Library, 
  BarChart3, 
  Dna, 
  Bell, 
  Settings, 
  Sparkles,
  ChevronLeft,
  ChevronRight,
  ShieldCheck,
  Video
} from 'lucide-react';
import { NavigationTab, CreatorProfile } from '../../types';

interface SidebarProps {
  currentTab: NavigationTab;
  onNavigate: (tab: NavigationTab) => void;
  onOpenCreateModal: () => void;
  creator: CreatorProfile;
  isCollapsed: boolean;
  onToggleCollapse: () => void;
}

export const Sidebar: React.FC<SidebarProps> = ({
  currentTab,
  onNavigate,
  onOpenCreateModal,
  creator,
  isCollapsed,
  onToggleCollapse,
}) => {
  const navItems = [
    { id: 'dashboard' as NavigationTab, label: 'Dashboard', icon: LayoutDashboard },
    { id: 'trend-ai' as NavigationTab, label: 'Trend.Ai', icon: TrendingUp, badge: 'HOT' },
    { id: 'ideas' as NavigationTab, label: 'Ideas', icon: Lightbulb, count: '4' },
    { id: 'create' as NavigationTab, label: 'Create Studio', icon: PlusCircle, isHighlight: true },
    { id: 'editor' as NavigationTab, label: 'Video Studio', icon: Video, badge: 'PRO' },
    { id: 'projects' as NavigationTab, label: 'Projects', icon: FolderKanban },
    { id: 'assets' as NavigationTab, label: 'Assets', icon: Library },
    { id: 'analytics' as NavigationTab, label: 'Analytics', icon: BarChart3 },
    { id: 'creator-dna' as NavigationTab, label: 'Creator DNA', icon: Dna, isDna: true },
  ];

  return (
    <aside 
      className={`fixed top-0 left-0 bottom-0 z-30 hidden md:flex flex-col glass-panel-l2 border-r border-white/10 transition-all duration-300 select-none ${
        isCollapsed ? 'w-20' : 'w-64'
      }`}
    >
      {/* Top Logo Area */}
      <div className="h-16 px-4 flex items-center justify-between border-b border-white/10">
        {!isCollapsed ? (
          <div className="flex items-center gap-2.5 cursor-pointer" onClick={() => onNavigate('dashboard')}>
            <div className="w-9 h-9 rounded-xl bg-gradient-to-tr from-indigo-600 via-violet-600 to-cyan-400 p-[1px] shadow-glow-primary flex items-center justify-center">
              <div className="w-full h-full bg-[#0b0d17] rounded-[11px] flex items-center justify-center">
                <Sparkles className="w-4 h-4 text-indigo-300" />
              </div>
            </div>
            <div>
              <div className="flex items-center gap-1.5">
                <span className="font-extrabold tracking-tight text-base font-sans bg-gradient-to-r from-white via-indigo-200 to-cyan-400 bg-clip-text text-transparent">
                  VIDORA
                </span>
                <span className="text-[9px] px-1.5 py-0.2 rounded-full bg-indigo-500/20 text-indigo-300 font-mono border border-indigo-500/30 font-bold">
                  OS
                </span>
              </div>
              <p className="text-[10px] text-slate-400 font-medium tracking-tight">Know what to create</p>
            </div>
          </div>
        ) : (
          <div className="mx-auto cursor-pointer" onClick={() => onNavigate('dashboard')}>
            <div className="w-10 h-10 rounded-xl bg-gradient-to-tr from-indigo-600 to-cyan-400 p-[1px] flex items-center justify-center">
              <div className="w-full h-full bg-[#0b0d17] rounded-[11px] flex items-center justify-center">
                <Sparkles className="w-5 h-5 text-indigo-300" />
              </div>
            </div>
          </div>
        )}

        <button 
          onClick={onToggleCollapse}
          className="p-1 rounded-lg text-slate-400 hover:text-white hover:bg-white/10 transition-colors hidden md:block"
        >
          {isCollapsed ? <ChevronRight className="w-4 h-4" /> : <ChevronLeft className="w-4 h-4" />}
        </button>
      </div>

      {/* Primary Action Button */}
      <div className="p-3">
        {!isCollapsed ? (
          <button
            onClick={onOpenCreateModal}
            className="w-full py-2.5 px-4 rounded-xl glass-button-primary font-semibold text-xs text-white flex items-center justify-center gap-2 group shadow-glow-primary"
          >
            <PlusCircle className="w-4 h-4 text-white group-hover:rotate-90 transition-transform duration-300" />
            <span>+ Create Content</span>
          </button>
        ) : (
          <button
            onClick={onOpenCreateModal}
            title="Create Content"
            className="w-full h-10 rounded-xl glass-button-primary flex items-center justify-center text-white"
          >
            <PlusCircle className="w-5 h-5" />
          </button>
        )}
      </div>

      {/* Navigation Items */}
      <nav className="flex-1 px-3 py-2 space-y-1 overflow-y-auto">
        {navItems.map((item) => {
          const Icon = item.icon;
          const isActive = currentTab === item.id;

          return (
            <button
              key={item.id}
              onClick={() => {
                if (item.id === 'create') {
                  onOpenCreateModal();
                } else {
                  onNavigate(item.id);
                }
              }}
              className={`w-full flex items-center justify-between px-3 py-2.5 rounded-xl text-xs font-medium transition-all relative group ${
                isActive 
                  ? 'text-white bg-indigo-600/20 border border-indigo-500/30 shadow-glass-sm' 
                  : 'text-slate-400 hover:text-slate-100 hover:bg-white/[0.04]'
              }`}
            >
              {/* Active Glow Accent Indicator */}
              {isActive && (
                <motion.div
                  layoutId="activeNavIndicator"
                  className="absolute left-0 top-2 bottom-2 w-1 bg-indigo-400 rounded-r-full shadow-glow-primary"
                  transition={{ type: 'spring', stiffness: 300, damping: 30 }}
                />
              )}

              <div className="flex items-center gap-3">
                <Icon className={`w-4 h-4 transition-colors ${
                  isActive ? 'text-indigo-400' : item.isDna ? 'text-violet-400' : 'text-slate-400 group-hover:text-slate-200'
                }`} />
                {!isCollapsed && (
                  <span className={`tracking-wide ${isActive ? 'font-semibold' : ''}`}>
                    {item.label}
                  </span>
                )}
              </div>

              {!isCollapsed && (
                <div className="flex items-center gap-1.5">
                  {item.badge && (
                    <span className={`text-[9px] px-1.5 py-0.5 rounded-full font-mono font-bold ${
                      item.badge === 'HOT' ? 'bg-rose-500/20 text-rose-300 border border-rose-500/30' : 'bg-cyan-500/20 text-cyan-300 border border-cyan-500/30'
                    }`}>
                      {item.badge}
                    </span>
                  )}
                  {item.count && (
                    <span className="text-[10px] text-slate-400 bg-white/10 px-1.5 py-0.5 rounded-full">
                      {item.count}
                    </span>
                  )}
                </div>
              )}
            </button>
          );
        })}
      </nav>

      {/* Creator Profile & Footer */}
      <div className="p-3 border-t border-white/10 space-y-2 bg-white/[0.01]">
        {!isCollapsed ? (
          <div 
            onClick={() => onNavigate('creator-dna')}
            className="p-2 rounded-xl glass-panel-l1 hover:glass-panel-l2 transition-all cursor-pointer flex items-center justify-between border border-white/5 hover:border-indigo-500/30 group"
          >
            <div className="flex items-center gap-2.5">
              <div className="relative">
                <img 
                  src={creator.avatar} 
                  alt={creator.name} 
                  className="w-8 h-8 rounded-full object-cover border border-indigo-400/40"
                />
                <div className="absolute -bottom-0.5 -right-0.5 w-2.5 h-2.5 rounded-full bg-emerald-500 border-2 border-[#08090D]" />
              </div>
              <div className="text-left">
                <p className="text-xs font-semibold text-white group-hover:text-indigo-300 transition-colors">{creator.name}</p>
                <div className="flex items-center gap-1 text-[10px] text-slate-400">
                  <ShieldCheck className="w-3 h-3 text-cyan-400" />
                  <span className="truncate max-w-[100px]">Tech + Security</span>
                </div>
              </div>
            </div>
            <Dna className="w-4 h-4 text-violet-400 opacity-60 group-hover:opacity-100 transition-opacity" />
          </div>
        ) : (
          <div 
            onClick={() => onNavigate('creator-dna')}
            className="w-10 h-10 mx-auto rounded-full overflow-hidden border border-indigo-500/40 cursor-pointer hover:scale-105 transition-transform"
          >
            <img src={creator.avatar} alt={creator.name} className="w-full h-full object-cover" />
          </div>
        )}

        {!isCollapsed && (
          <div className="px-2 pt-1 border-t border-white/5 text-[9px] text-slate-400 leading-tight">
            <span className="font-semibold text-slate-300">About: </span>
            <span>Visual Intelligence for Digital Optimization, Reach &amp; Amplification.</span>
          </div>
        )}
      </div>
    </aside>
  );
};
