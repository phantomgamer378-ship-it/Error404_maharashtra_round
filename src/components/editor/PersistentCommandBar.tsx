import React, { useState } from 'react';
import { Sparkles, Send, CornerDownLeft, Target } from 'lucide-react';
import { TimelineClip } from '../../features/editor/types';

interface PersistentCommandBarProps {
  selectedClip: TimelineClip | null;
  onExecuteCommand: (command: string) => void;
  isAiProcessing: boolean;
}

const EXAMPLE_CHIPS = [
  "Make this more engaging but keep my style",
  "Make this hook stronger.",
  "Remove the boring section.",
  "Make this 25 seconds.",
  "Rewrite this in Hinglish.",
  "Create a LinkedIn version.",
  "Make this more professional."
];

export const PersistentCommandBar: React.FC<PersistentCommandBarProps> = ({
  selectedClip,
  onExecuteCommand,
  isAiProcessing,
}) => {
  const [inputVal, setInputVal] = useState('');

  const handleSend = () => {
    if (!inputVal.trim() || isAiProcessing) return;
    onExecuteCommand(inputVal.trim());
    setInputVal('');
  };

  const handleChipClick = (chipText: string) => {
    onExecuteCommand(chipText);
  };

  return (
    <div className="px-4 py-2.5 glass-panel-l3 border-t border-white/10 flex flex-col sm:flex-row items-center justify-between gap-3 shrink-0 bg-[#07080F]/90 z-20">
      
      {/* Left: Input Command Bar with Target Scope Tag */}
      <div className="flex items-center gap-2 w-full sm:max-w-2xl">
        <div className="flex items-center gap-1.5 px-2.5 py-1 rounded-xl bg-indigo-500/20 text-indigo-300 text-[10px] font-mono border border-indigo-500/30 shrink-0 font-bold">
          <Target className="w-3 h-3 text-indigo-400" />
          <span className="truncate max-w-[110px]">
            {selectedClip ? selectedClip.title : 'Global Timeline'}
          </span>
        </div>

        <div className="relative flex-1 flex items-center">
          <Sparkles className="w-3.5 h-3.5 text-indigo-400 absolute left-3 pointer-events-none" />
          <input
            type="text"
            value={inputVal}
            onChange={(e) => setInputVal(e.target.value)}
            onKeyDown={(e) => e.key === 'Enter' && handleSend()}
            placeholder="Ask CreatorAi... e.g. 'Make this more engaging but keep my style' or 'Remove the boring section'"
            className="w-full bg-white/[0.04] border border-white/10 rounded-xl pl-9 pr-9 py-1.5 text-xs text-white placeholder-slate-500 focus:outline-none focus:border-indigo-400 font-medium"
          />
          <button
            onClick={handleSend}
            disabled={!inputVal.trim() || isAiProcessing}
            className="absolute right-2 p-1 rounded-lg text-indigo-400 hover:text-white disabled:opacity-30"
          >
            <Send className="w-3 h-3" />
          </button>
        </div>
      </div>

      {/* Right: Example Prompt Chips (Clickable) */}
      <div className="flex items-center gap-1.5 overflow-x-auto w-full sm:w-auto scrollbar-none py-0.5">
        <span className="text-[10px] text-slate-500 font-mono shrink-0 hidden lg:inline">
          Suggestions:
        </span>
        {EXAMPLE_CHIPS.map((chip, idx) => (
          <button
            key={idx}
            onClick={() => handleChipClick(chip)}
            disabled={isAiProcessing}
            className="px-2.5 py-1 rounded-lg bg-white/[0.03] hover:bg-indigo-600/30 border border-white/5 hover:border-indigo-400/40 text-[10px] text-slate-300 hover:text-white font-mono transition-all whitespace-nowrap shrink-0 disabled:opacity-30"
          >
            {chip}
          </button>
        ))}
      </div>
    </div>
  );
};
