import React, { useState } from 'react';
import { motion } from 'framer-motion';
import { 
  FolderKanban, 
  Plus, 
  Sparkles, 
  Film, 
  Clock, 
  CheckCircle2, 
  Edit3, 
  ArrowRight,
  Filter
} from 'lucide-react';
import { Project, NavigationTab } from '../../types';
import { useCreator } from '../../context/CreatorContext';
import { DemoDataBadge } from '../ui/DemoDataBadge';
import { EmptyState } from '../ui/EmptyState';

interface ProjectsViewProps {
  projects?: Project[];
  onNavigate: (tab: NavigationTab) => void;
  onOpenVideoEditor: () => void;
  onOpenCreateModal: () => void;
}

export const ProjectsView: React.FC<ProjectsViewProps> = ({
  onNavigate,
  onOpenVideoEditor,
  onOpenCreateModal,
}) => {
  const { projects, updateProject } = useCreator();
  const [filterStatus, setFilterStatus] = useState<string>('All');

  const statuses = ['All', 'Idea', 'Draft', 'Editing', 'Ready', 'Published'] as const;

  const filteredProjects = projects.filter(
    p => filterStatus === 'All' || p.status === filterStatus
  );

  const getStatusBadge = (status: Project['status']) => {
    switch (status) {
      case 'Idea':
        return 'bg-slate-500/20 text-slate-300 border-slate-500/30';
      case 'Draft':
        return 'bg-amber-500/20 text-amber-300 border-amber-500/30';
      case 'Editing':
        return 'bg-blue-500/20 text-blue-300 border-blue-500/30';
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
            <span className="inline-flex items-center gap-1.5 px-3 py-1 rounded-full bg-indigo-500/20 border border-indigo-500/30 text-indigo-300 text-xs font-semibold">
              <FolderKanban className="w-3.5 h-3.5 text-indigo-400" />
              <span>ACTIVE CREATIVE WORKSPACE</span>
            </span>
            <DemoDataBadge />
          </div>

          <h1 className="text-3xl sm:text-4xl font-extrabold text-white tracking-tight font-sans">
            Creator <span className="text-gradient-accent">Projects</span>
          </h1>

          <p className="text-xs sm:text-sm text-slate-400 mt-1">
            Converted opportunities, in-progress scripts, and video studio timelines ready for export.
          </p>
        </div>

        <button
          onClick={onOpenCreateModal}
          className="px-4 py-2.5 rounded-xl glass-button-primary text-xs font-semibold text-white flex items-center gap-2 shadow-glow-primary shrink-0 self-start md:self-auto"
        >
          <Plus className="w-4 h-4" />
          <span>+ New Project</span>
        </button>
      </div>

      {/* Filter Status Bar */}
      <div className="flex items-center gap-2 overflow-x-auto border-b border-white/10 pb-2">
        {statuses.map((st) => (
          <button
            key={st}
            onClick={() => setFilterStatus(st)}
            className={`px-3.5 py-1.5 rounded-xl text-xs font-semibold transition-all whitespace-nowrap ${
              filterStatus === st
                ? 'bg-indigo-600 text-white shadow-glow-primary'
                : 'glass-button text-slate-400 hover:text-white'
            }`}
          >
            {st} ({st === 'All' ? projects.length : projects.filter(p => p.status === st).length})
          </button>
        ))}
      </div>

      {/* Projects Grid */}
      <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6">
        {filteredProjects.length === 0 ? (
          <div className="col-span-full py-8">
            <EmptyState
              icon={FolderKanban}
              title="No active projects yet. Turn a trending opportunity into a video."
              description="Your projects shelf is clean. Discover rising signals in Trend.Ai or convert raw footage into high-retention clips."
              actionLabel="Discover in Trend.Ai"
              onAction={() => onNavigate('trend-ai')}
              secondaryActionLabel="+ New Project"
              onSecondaryAction={onOpenCreateModal}
            />
          </div>
        ) : (
          filteredProjects.map((proj) => (
            <div 
              key={proj.id}
              onClick={onOpenVideoEditor}
              className="group p-5 rounded-3xl glass-panel-l2 border border-white/10 hover:border-indigo-500/40 transition-all space-y-4 cursor-pointer shadow-xl flex flex-col justify-between hover-elevate"
            >
              <div className="space-y-4">
                {/* Thumbnail */}
                <div className="relative h-44 rounded-2xl overflow-hidden bg-slate-900 border border-white/10">
                  <img 
                    src={proj.thumbnail} 
                    alt={proj.title} 
                    className="w-full h-full object-cover group-hover:scale-105 transition-transform duration-300"
                  />
                  <div className="absolute top-2.5 left-2.5">
                    <span className={`px-2.5 py-0.5 rounded-full text-[10px] font-mono font-bold border ${getStatusBadge(proj.status)} backdrop-blur-md`}>
                      {proj.status}
                    </span>
                  </div>
                  <div className="absolute bottom-2.5 right-2.5 px-2 py-0.5 rounded-md bg-black/80 backdrop-blur-md text-[10px] font-mono text-slate-200 border border-white/10">
                    {proj.duration}
                  </div>
                </div>

                {/* Title & Info */}
                <div className="space-y-1.5">
                  <h3 className="text-sm font-bold text-white group-hover:text-indigo-300 transition-colors line-clamp-2 leading-snug">
                    {proj.title}
                  </h3>
                  <div className="flex items-center justify-between text-[11px] text-slate-400 font-mono">
                    <span>Niche: {proj.niche}</span>
                    <span>{proj.updatedAt}</span>
                  </div>
                </div>

                {/* Hook text preview */}
                {proj.hookText && (
                  <p className="text-xs text-slate-300 bg-white/[0.02] p-2.5 rounded-xl border border-white/5 line-clamp-2 italic">
                    "{proj.hookText}"
                  </p>
                )}
              </div>

              {/* Bottom Row */}
              <div className="flex items-center justify-between pt-3 border-t border-white/10 text-xs mt-2">
                <span className="text-indigo-300 font-mono font-bold">
                  {proj.opportunityScore} OPP SCORE
                </span>
                <button className="text-slate-300 group-hover:text-white flex items-center gap-1 font-semibold">
                  <span>Open Editor</span>
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
