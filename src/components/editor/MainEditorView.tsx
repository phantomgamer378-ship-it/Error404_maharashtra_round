import React, { useState, useCallback } from 'react';
import { NavigationTab } from '../../types';
import { useEditorReducer } from '../../features/editor/useEditorReducer';
import { EditorTopBar } from './EditorTopBar';
import { VideoPreview } from './VideoPreview';
import { Timeline } from './Timeline';
import { PropertiesPanel } from './PropertiesPanel';
import { LeftToolsPanel } from './LeftToolsPanel';
import { PersistentCommandBar } from './PersistentCommandBar';
import { editorAIService, SelectionScope } from '../../lib/services/EditorAIService';
import { mockCreatorProfile } from '../../data/mockData';

interface MainEditorViewProps {
  onNavigate: (tab: NavigationTab) => void;
  onOpenPlatformDrawer: () => void;
  onOpenWhatIf?: () => void;
}

export const MainEditorView: React.FC<MainEditorViewProps> = ({
  onNavigate,
  onOpenPlatformDrawer,
  onOpenWhatIf,
}) => {
  const {
    state,
    selectedClip,
    setProjectTitle,
    setAspectRatio,
    setPlayhead,
    togglePlay,
    setZoomLevel,
    toggleSafeAreaGuide,
    selectClip,
    updateClipText,
    updateClipStyle,
    updateClipAudio,
    trimClip,
    splitClipAtPlayhead,
    deleteSelectedClip,
    undo,
    redo,
    applyAiOperation,
    undoAiOperation,
    exportStructuredProject
  } = useEditorReducer();

  const [isAiProcessing, setIsAiProcessing] = useState(false);
  const [aiError, setAiError] = useState<string | null>(null);
  const [mobileTab, setMobileTab] = useState<'canvas' | 'properties' | 'tools'>('canvas');
  const [scopeConfirmation, setScopeConfirmation] = useState<{
    summary: string;
    proposedScope: string;
    pendingCommand: string;
  } | null>(null);

  /**
   * Core AI Command Executor — routes command through EditorAIService
   * with scoped editing enforcement and error resilience (Rule 5)
   */
  const executeAiCommand = useCallback(async (command: string) => {
    if (isAiProcessing) return;
    setIsAiProcessing(true);
    setAiError(null);

    try {
      // Build selection scope from current state
      const scope: SelectionScope = {
        clipId: state.selectedClipId,
        trackType: selectedClip?.trackType || null,
        clipTitle: selectedClip?.title || 'Global Timeline',
        currentContent: selectedClip?.content,
        startSeconds: selectedClip?.startSeconds,
        endSeconds: selectedClip?.endSeconds,
      };

      const response = await editorAIService.processCommand({
        command,
        scope,
        editorState: state,
        creator: mockCreatorProfile,
      });

      // RULE 5: Wider scope check — surface confirmation, don't silently apply
      if (response.requiresScopeConfirmation && response.proposedWiderScope) {
        setScopeConfirmation({
          summary: response.summary,
          proposedScope: response.proposedWiderScope,
          pendingCommand: command,
        });
        setIsAiProcessing(false);
        return;
      }

      // Apply each scoped operation through unified history
      for (const op of response.operations) {
        applyAiOperation(op, command);
      }

    } catch (err) {
      console.error('EditorAI command failed:', err);
      setAiError('AI temporarily unavailable. Try: "Make this hook stronger." or use the floating toolbar buttons.');
    } finally {
      setIsAiProcessing(false);
    }
  }, [isAiProcessing, state, selectedClip, applyAiOperation]);

  /**
   * Legacy AI action handler for PropertiesPanel quick-buttons
   * (still goes through the same EditorAIService path)
   */
  const handleApplyAiAction = useCallback((actionType: 'engaging' | 'humorous' | 'professional' | 'sharpen') => {
    const commandMap = {
      engaging: 'Make this more engaging but keep my style',
      humorous: 'Make this more humorous',
      professional: 'Make this more professional',
      sharpen: 'Make this hook stronger and sharpen',
    };
    executeAiCommand(commandMap[actionType]);
  }, [executeAiCommand]);

  const handleCustomAiCommand = useCallback((command: string) => {
    executeAiCommand(command);
  }, [executeAiCommand]);

  const handleAddTextClip = () => {
    // Placeholder — add to text track at playhead
    updateClipText(`text-${Date.now()}`, 'New Overlay Header');
  };

  const handleAddCaptionClip = () => {
    updateClipText(`cap-${Date.now()}`, 'New generated subtitle phrase');
  };

  return (
    <div className="h-[calc(100vh-80px)] md:h-[calc(100vh-80px)] flex flex-col -m-4 md:-m-6 bg-[#06070B] overflow-hidden select-none animate-fadeIn">
      {/* 1. TOP BAR */}
      <EditorTopBar
        state={state}
        onSetTitle={setProjectTitle}
        onSetAspectRatio={setAspectRatio}
        onToggleSafeArea={toggleSafeAreaGuide}
        onUndo={undo}
        onRedo={redo}
        onExport={exportStructuredProject}
        onOpenPlatformDrawer={onOpenPlatformDrawer}
        onOpenWhatIf={onOpenWhatIf}
        onBack={() => onNavigate('dashboard')}
      />

      {/* MOBILE PANEL SWITCHER (Below TopBar on small screens) */}
      <div className="md:hidden flex items-center justify-around px-2 py-1.5 bg-[#080911] border-b border-white/10 shrink-0 text-xs gap-1">
        <button
          onClick={() => setMobileTab('canvas')}
          className={`flex-1 py-1 rounded-lg font-bold text-center transition-all ${
            mobileTab === 'canvas' ? 'bg-indigo-600 text-white shadow-sm' : 'text-slate-400 hover:text-white'
          }`}
        >
          Canvas
        </button>
        <button
          onClick={() => setMobileTab('properties')}
          className={`flex-1 py-1 rounded-lg font-bold text-center transition-all ${
            mobileTab === 'properties' ? 'bg-indigo-600 text-white shadow-sm' : 'text-slate-400 hover:text-white'
          }`}
        >
          Inspector & AI
        </button>
        <button
          onClick={() => setMobileTab('tools')}
          className={`flex-1 py-1 rounded-lg font-bold text-center transition-all ${
            mobileTab === 'tools' ? 'bg-indigo-600 text-white shadow-sm' : 'text-slate-400 hover:text-white'
          }`}
        >
          Media & Tools
        </button>
      </div>

      {/* 2. CENTER WORKSPACE: LEFT TOOLS, CANVAS PREVIEW, RIGHT PROPERTIES */}
      <div className="flex-1 flex overflow-hidden">
        {/* Left Tools & Media Panel */}
        <div className={`${mobileTab === 'tools' ? 'flex w-full' : 'hidden'} lg:flex shrink-0`}>
          <LeftToolsPanel
            tracks={state.tracks}
            onAddTextClip={handleAddTextClip}
            onAddCaptionClip={handleAddCaptionClip}
          />
        </div>

        {/* Center 9:16 Video Preview with Overlays & Contextual Floating Toolbar */}
        <div className={`${mobileTab === 'canvas' ? 'flex' : 'hidden'} md:flex flex-1 min-w-0 flex-col`}>
          <VideoPreview
            state={state}
            onSetPlayhead={setPlayhead}
            onTogglePlay={togglePlay}
            onSelectClip={(clipId) => selectClip(clipId)}
            onApplyPreset={executeAiCommand}
            isAiProcessing={isAiProcessing}
          />
        </div>

        {/* Right Inspector & AI Assistant Panel — with AI Changes Log */}
        <div className={`${mobileTab === 'properties' ? 'flex w-full' : 'hidden'} md:flex shrink-0`}>
          <PropertiesPanel
            selectedClip={selectedClip}
            state={state}
            onUpdateClipText={updateClipText}
            onUpdateClipStyle={updateClipStyle}
            onUpdateClipAudio={updateClipAudio}
            onApplyAiAction={handleApplyAiAction}
            onCustomAiCommand={handleCustomAiCommand}
            onUndoAiOperation={undoAiOperation}
            isAiProcessing={isAiProcessing}
          />
        </div>
      </div>

      {/* SCOPE CONFIRMATION BANNER — appears when AI tries wider scope (Rule 5) */}
      {scopeConfirmation && (
        <div className="px-6 py-3 bg-amber-950/80 border-t border-amber-500/40 flex items-center justify-between text-xs gap-4 z-30 backdrop-blur-md">
          <div className="flex flex-col gap-0.5">
            <span className="text-amber-300 font-bold font-mono">Scoped Editing: Confirmation Required</span>
            <span className="text-amber-200/80">{scopeConfirmation.summary}</span>
            <span className="text-amber-400/70 font-mono">Proposed: {scopeConfirmation.proposedScope}</span>
          </div>
          <div className="flex items-center gap-2 shrink-0">
            <button
              onClick={async () => {
                const cmd = scopeConfirmation.pendingCommand;
                setScopeConfirmation(null);
                await executeAiCommand(cmd + ' (confirmed wider scope)');
              }}
              className="px-3 py-1.5 rounded-lg bg-amber-500/30 hover:bg-amber-500/50 text-amber-200 border border-amber-400/40 font-semibold"
            >
              Approve & Apply
            </button>
            <button
              onClick={() => setScopeConfirmation(null)}
              className="px-3 py-1.5 rounded-lg glass-button text-slate-300 font-medium"
            >
              Cancel
            </button>
          </div>
        </div>
      )}

      {/* AI ERROR FALLBACK TOAST (non-crashing) */}
      {aiError && (
        <div className="absolute bottom-24 left-1/2 -translate-x-1/2 z-50 px-4 py-2.5 rounded-2xl bg-rose-950/90 text-rose-300 border border-rose-500/40 text-xs font-mono shadow-2xl backdrop-blur-md flex items-center gap-3 max-w-lg">
          <span>⚠ {aiError}</span>
          <button
            onClick={() => setAiError(null)}
            className="text-rose-400 hover:text-white font-bold shrink-0"
          >
            ✕
          </button>
        </div>
      )}

      {/* 3. PERSISTENT COMMAND BAR — Above Timeline */}
      <PersistentCommandBar
        selectedClip={selectedClip}
        onExecuteCommand={executeAiCommand}
        isAiProcessing={isAiProcessing}
      />

      {/* 4. MULTI-TRACK TIMELINE WITH SCRUBBING & KEYBOARD SHORTCUTS */}
      <Timeline
        state={state}
        onSetPlayhead={setPlayhead}
        onTogglePlay={togglePlay}
        onSelectClip={selectClip}
        onTrimClip={trimClip}
        onSplitClip={splitClipAtPlayhead}
        onDeleteClip={deleteSelectedClip}
        onUpdateClipText={updateClipText}
        onSetZoom={setZoomLevel}
        onUndo={undo}
        onRedo={redo}
      />
    </div>
  );
};
