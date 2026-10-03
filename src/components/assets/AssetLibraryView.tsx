import React, { useState, useMemo } from 'react';
import { motion, AnimatePresence } from 'framer-motion';
import { 
  Library, 
  Search, 
  Sparkles, 
  Film, 
  FileText, 
  Music, 
  Image as ImageIcon, 
  Filter, 
  Plus, 
  FolderKanban, 
  Send, 
  Scissors, 
  ExternalLink, 
  Clock, 
  Tag, 
  Link as LinkIcon,
  UploadCloud,
  CheckCircle2,
  Video
} from 'lucide-react';
import { Asset, NavigationTab } from '../../types';
import { DemoDataBadge } from '../ui/DemoDataBadge';
import { EmptyState } from '../ui/EmptyState';

interface AssetLibraryViewProps {
  assets: Asset[];
  onNavigate: (tab: NavigationTab) => void;
  onOpenVideoEditor: () => void;
  onOpenFootageAnalysis?: () => void;
}

export const AssetLibraryView: React.FC<AssetLibraryViewProps> = ({
  assets,
  onNavigate,
  onOpenVideoEditor,
  onOpenFootageAnalysis,
}) => {
  const [searchQuery, setSearchQuery] = useState('');
  const [activeTab, setActiveTab] = useState<string>('All');
  const [selectedTag, setSelectedTag] = useState<string>('All');

  const tabs = [
    'All',
    'Videos',
    'Generated',
    'Projects',
    'Published',
    'Scripts',
    'Audio',
    'Images'
  ] as const;

  // Extract unique tags for tag filter
  const allTags = useMemo(() => {
    const set = new Set<string>();
    assets.forEach(a => a.tags.forEach(t => set.add(t)));
    return Array.from(set).slice(0, 8);
  }, [assets]);

  // Tab mapping
  const matchesTab = (asset: Asset, tab: string) => {
    if (tab === 'All') return true;
    if (tab === 'Videos') return asset.type === 'Video';
    if (tab === 'Generated') return asset.type === 'Generated';
    if (tab === 'Projects') return asset.type === 'Project';
    if (tab === 'Published') return asset.type === 'Published';
    if (tab === 'Scripts') return asset.type === 'Script';
    if (tab === 'Audio') return asset.type === 'Audio';
    if (tab === 'Images') return asset.type === 'Image';
    return true;
  };

  const filteredAssets = useMemo(() => {
    return assets.filter(asset => {
      const matchT = matchesTab(asset, activeTab);
      const matchTag = selectedTag === 'All' || asset.tags.includes(selectedTag);
      
      const q = searchQuery.toLowerCase().trim();
      const matchSearch = !q ||
        asset.title.toLowerCase().includes(q) ||
        asset.aiDescription.toLowerCase().includes(q) ||
        (asset.transcriptSnippet && asset.transcriptSnippet.toLowerCase().includes(q)) ||
        asset.tags.some(t => t.toLowerCase().includes(q));

      return matchT && matchTag && matchSearch;
    });
  }, [assets, activeTab, selectedTag, searchQuery]);

  return (
    <div className="space-y-8 pb-16 animate-fadeIn">
      {/* Header */}
      <div className="flex flex-col md:flex-row md:items-center justify-between gap-4 border-b border-white/10 pb-5">
        <div>
          <div className="flex items-center gap-2 mb-1.5 flex-wrap">
            <span className="inline-flex items-center gap-1.5 px-3 py-1 rounded-full bg-cyan-500/20 border border-cyan-500/30 text-cyan-300 text-xs font-semibold">
              <Library className="w-3.5 h-3.5 text-cyan-400" />
              <span>AI-ORGANIZED MEDIA VAULT</span>
            </span>
            <DemoDataBadge />
          </div>

          <h1 className="text-2xl sm:text-3xl font-extrabold text-white">
            Asset <span className="text-gradient-accent">Library</span>
          </h1>

          <p className="text-xs sm:text-sm text-slate-300 mt-1 max-w-2xl">
            "Drop your first video and VIDORA will organize and understand it." Raw master footage, derived 9:16 short clips, scripts, and production audio.
          </p>
        </div>

        <div className="flex items-center gap-3 self-start md:self-auto flex-wrap">
          {onOpenFootageAnalysis && (
            <button
              onClick={onOpenFootageAnalysis}
              className="px-4 py-2.5 rounded-xl glass-button text-xs font-semibold text-slate-200 flex items-center gap-2 hover:text-white"
            >
              <Video className="w-4 h-4 text-cyan-400" />
              <span>Analyze Raw Footage</span>
            </button>
          )}

          <button
            onClick={onOpenFootageAnalysis || onOpenVideoEditor}
            className="px-4 py-2.5 rounded-xl glass-button-primary text-xs font-semibold text-white flex items-center gap-2 shadow-glow-primary shrink-0"
          >
            <Plus className="w-4 h-4" />
            <span>Upload Media</span>
          </button>
        </div>
      </div>

      {/* AI Search Bar */}
      <div className="relative">
        <div className="relative flex items-center px-4 py-3.5 rounded-2xl glass-panel-l3 border border-indigo-500/30 shadow-xl">
          <Search className="w-4 h-4 text-indigo-400 mr-3 shrink-0" />
          <input
            type="text"
            value={searchQuery}
            onChange={(e) => setSearchQuery(e.target.value)}
            placeholder="AI Semantic Search e.g. 'Show all footage where I talk about AI security' or 'voice cloning'..."
            className="w-full bg-transparent text-white placeholder-slate-400 text-xs focus:outline-none font-medium"
          />
          {searchQuery && (
            <button 
              onClick={() => setSearchQuery('')} 
              className="text-xs text-slate-400 hover:text-white mr-3 px-2 py-0.5 rounded bg-white/5"
            >
              Clear
            </button>
          )}
          <span className="hidden sm:inline-flex px-2.5 py-1 rounded-full bg-indigo-500/20 text-indigo-300 text-[10px] font-mono items-center gap-1 border border-indigo-500/30 whitespace-nowrap">
            <Sparkles className="w-3 h-3 text-indigo-400" /> SEMANTIC EMBEDDINGS
          </span>
        </div>
      </div>

      {/* 7 Tabs Toolbar */}
      <div className="space-y-3">
        <div className="flex items-center gap-2 overflow-x-auto border-b border-white/10 pb-2">
          {tabs.map((tab) => {
            const count = tab === 'All' ? assets.length : assets.filter(a => matchesTab(a, tab)).length;

            return (
              <button
                key={tab}
                onClick={() => setActiveTab(tab)}
                className={`px-3.5 py-1.5 rounded-xl text-xs font-semibold transition-all whitespace-nowrap flex items-center gap-1.5 ${
                  activeTab === tab 
                    ? 'bg-cyan-500/20 border border-cyan-500/40 text-cyan-300 shadow-sm' 
                    : 'glass-button text-slate-400 hover:text-white'
                }`}
              >
                <span>{tab}</span>
                <span className="text-[10px] font-mono opacity-70">({count})</span>
              </button>
            );
          })}
        </div>

        {/* Tag Filters */}
        <div className="flex items-center gap-1.5 overflow-x-auto pt-1">
          <span className="text-[11px] text-slate-500 font-mono mr-1 flex items-center gap-1">
            <Tag className="w-3 h-3" /> Filter Tag:
          </span>
          <button
            onClick={() => setSelectedTag('All')}
            className={`px-2.5 py-1 rounded-lg text-[10px] font-mono transition-all ${
              selectedTag === 'All'
                ? 'bg-white/10 text-white font-bold border border-white/20'
                : 'text-slate-400 hover:text-white'
            }`}
          >
            All Tags
          </button>
          {allTags.map((tag) => (
            <button
              key={tag}
              onClick={() => setSelectedTag(tag)}
              className={`px-2.5 py-1 rounded-lg text-[10px] font-mono transition-all ${
                selectedTag === tag
                  ? 'bg-white/10 text-white font-bold border border-white/20'
                  : 'text-slate-400 hover:text-white'
              }`}
            >
              #{tag}
            </button>
          ))}
        </div>
      </div>

      {/* Assets Grid or Empty State */}
      {filteredAssets.length === 0 ? (
        <div className="py-6 max-w-lg mx-auto">
          <EmptyState
            icon={Library}
            title="No matching assets found in your media vault"
            description={searchQuery ? `No assets match "${searchQuery}". Try searching for keywords like "security", "voice", or clear your filter.` : "There are no media assets in this category yet."}
            actionLabel="Reset Filters"
            onAction={() => {
              setSearchQuery('');
              setActiveTab('All');
              setSelectedTag('All');
            }}
            secondaryActionLabel={onOpenFootageAnalysis ? "Analyze Raw Footage" : undefined}
            onSecondaryAction={onOpenFootageAnalysis}
          />
        </div>
      ) : (
        <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 xl:grid-cols-4 gap-6">
          {filteredAssets.map((asset) => (
            <div 
              key={asset.id}
              onClick={onOpenVideoEditor}
              className="group p-4 rounded-3xl glass-panel-l2 border border-white/10 hover:border-cyan-500/40 transition-all space-y-3 cursor-pointer shadow-xl overflow-hidden flex flex-col justify-between"
            >
              <div className="space-y-3">
                {/* Thumbnail */}
                <div className="relative h-40 rounded-2xl overflow-hidden bg-slate-900 border border-white/10">
                  <img 
                    src={asset.thumbnail} 
                    alt={asset.title} 
                    className="w-full h-full object-cover group-hover:scale-105 transition-transform duration-300"
                  />
                  <div className="absolute top-2 right-2 px-2 py-0.5 rounded bg-black/70 backdrop-blur-md text-[10px] font-mono font-semibold text-white">
                    {asset.type}
                  </div>
                  {asset.duration && (
                    <div className="absolute bottom-2 right-2 px-2 py-0.5 rounded bg-black/80 text-[10px] font-mono text-slate-200">
                      {asset.duration}
                    </div>
                  )}
                  {asset.size && (
                    <div className="absolute bottom-2 left-2 px-2 py-0.5 rounded bg-black/80 text-[10px] font-mono text-slate-400">
                      {asset.size}
                    </div>
                  )}
                </div>

                {/* Title & Collection */}
                <div className="space-y-1">
                  <div className="flex items-center justify-between text-[10px] text-slate-400 font-mono">
                    <span className="text-cyan-300 font-semibold">{asset.collection || asset.type}</span>
                    <span>{asset.dateAdded}</span>
                  </div>
                  <h3 className="text-xs font-bold text-white line-clamp-2 group-hover:text-cyan-300 transition-colors leading-snug">
                    {asset.title}
                  </h3>
                </div>

                {/* Source-to-derived relationship badge */}
                {asset.sourceDerivedFrom && (
                  <div className="p-2 rounded-xl bg-indigo-950/30 border border-indigo-500/30 text-[10px] text-indigo-300 space-y-0.5">
                    <div className="flex items-center gap-1 font-semibold text-indigo-200">
                      <LinkIcon className="w-3 h-3 text-indigo-400" />
                      <span>Derived from Master Footage:</span>
                    </div>
                    <p className="truncate text-slate-300 font-mono">
                      {asset.sourceDerivedFrom.parentTitle}
                    </p>
                    <span className="text-emerald-400 font-mono font-bold block">
                      Range: {asset.sourceDerivedFrom.timestampRange}
                    </span>
                  </div>
                )}

                {/* AI Description */}
                <p className="text-[11px] text-slate-400 line-clamp-2 leading-relaxed">
                  {asset.aiDescription}
                </p>
              </div>

              {/* Tags */}
              <div className="flex flex-wrap gap-1 pt-2 border-t border-white/5">
                {asset.tags.slice(0, 3).map((tag, idx) => (
                  <span key={idx} className="px-1.5 py-0.2 rounded bg-white/5 text-[9px] text-slate-400 font-mono">
                    #{tag}
                  </span>
                ))}
              </div>
            </div>
          ))}
        </div>
      )}
    </div>
  );
};
