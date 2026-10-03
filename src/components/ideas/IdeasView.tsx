import React, { useState } from 'react';
import { motion } from 'framer-motion';
import { 
  Lightbulb, 
  Sparkles, 
  Plus, 
  TrendingUp, 
  CheckCircle2, 
  Clock, 
  ArrowRight, 
  Target,
  Filter,
  Layers,
  ChevronRight
} from 'lucide-react';
import { IdeaItem, NavigationTab } from '../../types';
import { useCreator } from '../../context/CreatorContext';
import { DemoDataBadge } from '../ui/DemoDataBadge';
import { EmptyState } from '../ui/EmptyState';

interface IdeasViewProps {
  ideas?: IdeaItem[];
  onNavigate: (tab: NavigationTab) => void;
  onOpenCreateModal: () => void;
  onSelectIdeaToGenerate?: (idea: IdeaItem) => void;
}

export const IdeasView: React.FC<IdeasViewProps> = ({
  onNavigate,
  onOpenCreateModal,
  onSelectIdeaToGenerate,
}) => {
  const { ideas, updateIdeaStatus, opportunities } = useCreator();
  const [activeCategory, setActiveCategory] = useState<'All' | 'Trend.Ai' | 'Content Gap' | 'Manual' | 'Audience Request'>('All');
  const [filterStatus, setFilterStatus] = useState<string>('All');

  const categories = ['All', 'Trend.Ai', 'Content Gap', 'Manual', 'Audience Request'] as const;
  const statuses = ['All', 'Idea', 'Planned', 'In Progress', 'Ready', 'Published'] as const;

  const filteredIdeas = ideas.filter(i => {
    const matchesCategory = activeCategory === 'All' || i.source === activeCategory;
    const matchesStatus = filterStatus === 'All' || i.status === filterStatus;
    return matchesCategory && matchesStatus;
  });

  const getStatusBadge = (status: IdeaItem['status']) => {
    switch (status) {
      case 'Idea':
        return 'bg-slate-500/20 text-slate-300 border-slate-500/30';
      case 'Planned':
        return 'bg-blue-500/20 text-blue-300 border-blue-500/30';
      case 'In Progress':
        return 'bg-amber-500/20 text-amber-300 border-amber-500/30';
      case 'Ready':
        return 'bg-indigo-500/20 text-indigo-300 border-indigo-500/30';
      case 'Published':
        return 'bg-emerald-500/20 text-emerald-300 border-emerald-500/30';
    }
  };

  return (
    <div className="space-y-8 pb-16 animate-fadeIn">
      {/* Header */}
      <div className="flex flex-col md:flex-row md:items-center justify-between gap-4">
        <div>
          <div className="flex items-center gap-2 mb-2">
            <span className="inline-flex items-center gap-1.5 px-3 py-1 rounded-full bg-amber-500/20 border border-amber-500/30 text-amber-300 text-xs font-semibold">
              <Lightbulb className="w-3.5 h-3.5 text-amber-400" />
              <span>IDEATION & OPPORTUNITY REPOSITORY</span>
            </span>
            <DemoDataBadge />
          </div>

          <h1 className="text-3xl sm:text-4xl font-extrabold text-white tracking-tight font-sans">
            Ideas & <span className="text-gradient-accent">Content Gaps</span>
          </h1>

          <p className="text-xs sm:text-sm text-slate-400 mt-1">
            "You do not need to start with an idea. Find an opportunity." Central bank of saved concepts, trend signals, and audience requests.
          </p>
        </div>

        <button
          onClick={onOpenCreateModal}
          className="px-4 py-2.5 rounded-xl glass-button-primary text-xs font-semibold text-white flex items-center gap-2 shadow-glow-primary shrink-0 self-start md:self-auto"
        >
          <Plus className="w-4 h-4" />
          <span>New Idea</span>
        </button>
      </div>

      {/* Filter Toolbar: Categories + Statuses */}
      <div className="space-y-3">
        {/* Categories Bar */}
        <div className="flex items-center gap-2 overflow-x-auto pb-1">
          {categories.map((cat) => (
            <button
              key={cat}
              onClick={() => setActiveCategory(cat)}
              className={`px-3 py-1.5 rounded-xl text-xs font-semibold transition-all whitespace-nowrap ${
                activeCategory === cat
                  ? 'bg-indigo-600 text-white shadow-glow-primary'
                  : 'glass-button text-slate-400 hover:text-white'
              }`}
            >
              {cat}
            </button>
          ))}
        </div>

        {/* Status Chips Bar */}
        <div className="flex items-center gap-1.5 overflow-x-auto border-t border-white/5 pt-2">
          <span className="text-[11px] text-slate-500 font-mono mr-1">Status:</span>
          {statuses.map((st) => (
            <button
              key={st}
              onClick={() => setFilterStatus(st)}
              className={`px-2.5 py-1 rounded-lg text-[11px] font-mono transition-all ${
                filterStatus === st
                  ? 'bg-white/10 text-white font-bold border border-white/20'
                  : 'text-slate-400 hover:text-white'
              }`}
            >
              {st}
            </button>
          ))}
        </div>
      </div>

      {/* Ideas Grid */}
      <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
        {filteredIdeas.length === 0 ? (
          <div className="col-span-full py-6">
            <EmptyState
              icon={Lightbulb}
              title="You don't need an idea. Let's find one."
              description="Your idea vault is currently empty for these filters. Trend.Ai detects high-velocity topics tailored to your audience."
              actionLabel="Discover Trends in Trend.Ai"
              onAction={() => onNavigate('trend-ai')}
              secondaryActionLabel="Open + Create"
              onSecondaryAction={onOpenCreateModal}
            />
          </div>
        ) : (
          filteredIdeas.map((idea) => (
            <div 
              key={idea.id}
              className="p-5 md:p-6 rounded-3xl glass-panel-l2 border border-white/10 hover:border-amber-500/40 transition-all space-y-4 shadow-xl relative group hover-elevate"
            >
              {/* Top row */}
              <div className="flex items-center justify-between gap-2 flex-wrap">
                <span className="px-2.5 py-0.5 rounded-full bg-indigo-500/20 text-indigo-300 text-[10px] font-mono font-bold border border-indigo-500/30">
                  SOURCE: {idea.source}
                </span>

                {/* Status Select dropdown */}
                <select
                  value={idea.status}
                  onChange={(e) => updateIdeaStatus(idea.id, e.target.value as IdeaItem['status'])}
                  className={`text-[10px] font-mono font-bold px-2 py-0.5 rounded-full border cursor-pointer focus:outline-none ${getStatusBadge(idea.status)} bg-[#090b14]`}
                >
                  <option value="Idea">Idea</option>
                  <option value="Planned">Planned</option>
                  <option value="In Progress">In Progress</option>
                  <option value="Ready">Ready</option>
                  <option value="Published">Published</option>
                </select>
              </div>

              {/* Content */}
              <div className="space-y-1.5">
                <h3 className="text-base font-bold text-white group-hover:text-amber-200 transition-colors">
                  {idea.topic}
                </h3>
                <p className="text-xs text-slate-300 leading-relaxed">
                  {idea.angle}
                </p>
              </div>

              {/* Bottom Row */}
              <div className="flex items-center justify-between pt-3 border-t border-white/10 text-xs">
                <div className="flex items-center gap-3 text-slate-400 text-[11px] font-mono">
                  <span>Opp Score: <strong className="text-indigo-300">{idea.potentialScore}</strong></span>
                  <span>• {idea.estimatedDuration}</span>
                </div>

                <button
                  onClick={() => {
                    if (onSelectIdeaToGenerate) {
                      onSelectIdeaToGenerate(idea);
                    } else {
                      onOpenCreateModal();
                    }
                  }}
                  className="px-3.5 py-1.5 rounded-xl glass-button-primary text-xs font-semibold text-white flex items-center gap-1 shadow-sm"
                >
                  <span>Generate Script</span>
                  <ArrowRight className="w-3.5 h-3.5" />
                </button>
              </div>
            </div>
          ))
        )}
      </div>
    </div>
  );
};
