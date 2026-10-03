import React from 'react';
import { LucideIcon, Sparkles } from 'lucide-react';

interface EmptyStateProps {
  icon?: LucideIcon;
  title: string;
  description: string;
  actionLabel?: string;
  onAction?: () => void;
  secondaryActionLabel?: string;
  onSecondaryAction?: () => void;
  className?: string;
}

export const EmptyState: React.FC<EmptyStateProps> = ({
  icon: Icon = Sparkles,
  title,
  description,
  actionLabel,
  onAction,
  secondaryActionLabel,
  onSecondaryAction,
  className = '',
}) => {
  return (
    <div className={`p-8 md:p-12 rounded-3xl glass-panel-l2 border border-white/10 text-center flex flex-col items-center justify-center space-y-4 shadow-xl ${className}`}>
      {/* Icon with glow background */}
      <div className="relative">
        <div className="absolute inset-0 bg-indigo-500/20 rounded-2xl blur-xl" />
        <div className="relative w-16 h-16 rounded-2xl bg-white/[0.04] border border-white/15 flex items-center justify-center text-indigo-400 shadow-inner">
          <Icon className="w-8 h-8 text-indigo-300 animate-pulse" />
        </div>
      </div>

      <div className="space-y-1.5 max-w-md">
        <h3 className="text-lg md:text-xl font-bold text-white tracking-tight">
          {title}
        </h3>
        <p className="text-xs md:text-sm text-slate-300 leading-relaxed">
          {description}
        </p>
      </div>

      {(actionLabel || secondaryActionLabel) && (
        <div className="flex items-center gap-3 pt-2 flex-wrap justify-center">
          {actionLabel && onAction && (
            <button
              onClick={onAction}
              className="px-5 py-2.5 rounded-xl glass-button-primary text-xs font-bold text-white flex items-center gap-2 shadow-glow-primary hover:scale-[1.02] active:scale-[0.98] transition-all"
            >
              <Sparkles className="w-3.5 h-3.5 text-white" />
              <span>{actionLabel}</span>
            </button>
          )}

          {secondaryActionLabel && onSecondaryAction && (
            <button
              onClick={onSecondaryAction}
              className="px-4 py-2.5 rounded-xl glass-button text-xs font-semibold text-slate-300 hover:text-white transition-all"
            >
              {secondaryActionLabel}
            </button>
          )}
        </div>
      )}
    </div>
  );
};
