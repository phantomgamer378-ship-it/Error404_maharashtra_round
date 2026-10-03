import React from 'react';
import { 
  LayoutDashboard, 
  TrendingUp, 
  Plus, 
  Video, 
  Dna,
  Menu,
  BarChart3,
  FolderKanban,
  Library,
  Lightbulb
} from 'lucide-react';
import { NavigationTab } from '../../types';

interface BottomNavProps {
  currentTab: NavigationTab;
  onNavigate: (tab: NavigationTab) => void;
  onOpenCreateModal: () => void;
}

export const BottomNav: React.FC<BottomNavProps> = ({
  currentTab,
  onNavigate,
  onOpenCreateModal,
}) => {
  const [isMoreMenuOpen, setIsMoreMenuOpen] = React.useState(false);

  const primaryItems = [
    { id: 'dashboard' as NavigationTab, label: 'Home', icon: LayoutDashboard },
    { id: 'trend-ai' as NavigationTab, label: 'Trend.Ai', icon: TrendingUp },
    { id: 'create' as NavigationTab, label: 'Create', icon: Plus, isCreate: true },
    { id: 'editor' as NavigationTab, label: 'Studio', icon: Video },
    { id: 'creator-dna' as NavigationTab, label: 'DNA', icon: Dna },
  ];

  const moreItems = [
    { id: 'analytics' as NavigationTab, label: 'Performance & Loop', icon: BarChart3 },
    { id: 'ideas' as NavigationTab, label: 'Ideas Vault', icon: Lightbulb },
    { id: 'projects' as NavigationTab, label: 'Projects', icon: FolderKanban },
    { id: 'assets' as NavigationTab, label: 'Asset Library', icon: Library },
  ];

  return (
    <>
      {/* Mobile "More" Drawer Popup */}
      {isMoreMenuOpen && (
        <div className="fixed inset-0 z-50 flex flex-col justify-end bg-black/70 backdrop-blur-md md:hidden animate-scaleIn">
          <div 
            className="flex-1" 
            onClick={() => setIsMoreMenuOpen(false)}
          />
          <div 
            className="glass-panel-l4 rounded-t-3xl border-t border-white/15 p-5 space-y-4 shadow-2xl animate-slideUp"
            style={{ paddingBottom: 'calc(1.5rem + env(safe-area-inset-bottom, 0px))' }}
          >
            {/* Handle bar */}
            <div className="w-12 h-1 bg-white/20 rounded-full mx-auto mb-2" />
            <div className="flex items-center justify-between pb-3 border-b border-white/10">
              <span className="text-xs font-bold font-mono text-slate-300 uppercase tracking-wider">
                More Views
              </span>
              <button 
                onClick={() => setIsMoreMenuOpen(false)}
                className="text-xs text-slate-400 hover:text-white px-3 py-1.5 rounded-lg glass-button"
                aria-label="Close navigation menu"
              >
                Close
              </button>
            </div>
            <div className="grid grid-cols-2 gap-2.5">
              {moreItems.map((item) => (
                <button
                  key={item.id}
                  onClick={() => {
                    onNavigate(item.id);
                    setIsMoreMenuOpen(false);
                  }}
                  aria-label={item.label}
                  aria-current={currentTab === item.id ? 'page' : undefined}
                  className={`p-4 rounded-2xl border text-left flex items-center gap-3 transition-all active:scale-95 ${
                    currentTab === item.id 
                      ? 'bg-indigo-600/30 border-indigo-500/50 text-white' 
                      : 'bg-white/[0.03] border-white/5 text-slate-300 hover:bg-white/[0.07]'
                  }`}
                >
                  <item.icon className="w-4 h-4 text-indigo-400 shrink-0" />
                  <span className="text-xs font-semibold">{item.label}</span>
                </button>
              ))}
            </div>
          </div>
        </div>
      )}

      {/* Main Bottom Navigation Bar */}
      <nav 
        aria-label="Mobile Navigation"
        className="fixed bottom-0 left-0 right-0 z-40 flex items-center justify-around px-2 glass-panel-l4 border-t border-white/10 md:hidden backdrop-blur-2xl shadow-2xl"
        style={{ height: 'calc(4rem + env(safe-area-inset-bottom, 0px))', paddingBottom: 'env(safe-area-inset-bottom, 0px)' }}
      >
        {primaryItems.map((item) => {
          if (item.isCreate) {
            return (
              <button
                key={item.id}
                onClick={onOpenCreateModal}
                aria-label="Create New Content"
                className="relative -top-3 w-12 h-12 rounded-full glass-button-primary flex items-center justify-center text-white shadow-glow-primary active:scale-95 transition-transform"
              >
                <Plus className="w-6 h-6" />
              </button>
            );
          }

          const isActive = currentTab === item.id;
          return (
            <button
              key={item.id}
              onClick={() => onNavigate(item.id)}
              aria-label={item.label}
              aria-current={isActive ? 'page' : undefined}
              className={`flex flex-col items-center justify-center min-w-[52px] py-1.5 gap-0.5 relative transition-all active:scale-95 ${
                isActive ? 'text-indigo-300' : 'text-slate-400 hover:text-white'
              }`}
            >
              {/* Active dot indicator */}
              {isActive && (
                <span className="absolute top-0 left-1/2 -translate-x-1/2 w-6 h-0.5 rounded-full bg-indigo-400" />
              )}
              <item.icon className={`w-5 h-5 transition-all ${isActive ? 'text-indigo-400 scale-110' : 'text-slate-400'}`} />
              <span className={`text-[10px] tracking-tight font-medium ${isActive ? 'font-bold text-indigo-300' : ''}`}>
                {item.label}
              </span>
            </button>
          );
        })}

        {/* More button */}
        <button
          onClick={() => setIsMoreMenuOpen(true)}
          aria-label="Open More Tabs Menu"
          className={`flex flex-col items-center justify-center min-w-[52px] py-1.5 gap-0.5 relative transition-all active:scale-95 ${
            moreItems.some(i => i.id === currentTab) ? 'text-indigo-300' : 'text-slate-400 hover:text-white'
          }`}
        >
          {moreItems.some(i => i.id === currentTab) && (
            <span className="absolute top-0 left-1/2 -translate-x-1/2 w-6 h-0.5 rounded-full bg-indigo-400" />
          )}
          <Menu className="w-5 h-5" />
          <span className="text-[10px] tracking-tight font-medium">More</span>
        </button>
      </nav>
    </>
  );
};
