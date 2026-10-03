import React from 'react';
import { Database } from 'lucide-react';

interface DemoDataBadgeProps {
  className?: string;
}

/** Small pill that labels demo/synthetic data per Rules.md §3 */
export const DemoDataBadge: React.FC<DemoDataBadgeProps> = ({ className = '' }) => (
  <span
    className={`inline-flex items-center gap-1 px-2 py-0.5 rounded-full text-[9px] font-mono font-semibold uppercase tracking-wider bg-amber-500/10 text-amber-400/80 border border-amber-500/20 select-none ${className}`}
    title="This data is simulated for demonstration purposes"
  >
    <Database className="w-2.5 h-2.5" />
    Demo
  </span>
);
