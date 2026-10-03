import { useState, useCallback, useEffect, useRef } from 'react';
import { 
  EditorState, 
  TimelineTrack, 
  TimelineClip, 
  EditorOperation, 
  OperationType,
  ClipStyle 
} from './types';
import { INITIAL_EDITOR_STATE } from './defaultState';

const LOCAL_STORAGE_KEY = 'creator_ai_editor_state_v1';

export function useEditorReducer() {
  const [state, setState] = useState<EditorState>(() => {
    try {
      const saved = localStorage.getItem(LOCAL_STORAGE_KEY);
      if (saved) {
        const parsed = JSON.parse(saved);
        if (parsed.tracks && parsed.project) {
          return {
            ...parsed,
            isPlaying: false, // never start playing on load
            history: { past: [], future: [] }
          };
        }
      }
    } catch (e) {
      // fallback to initial
    }
    return INITIAL_EDITOR_STATE;
  });

  // Autosave to localStorage
  useEffect(() => {
    try {
      const toSave = {
        project: state.project,
        tracks: state.tracks,
        playhead: state.playhead,
        zoomLevel: state.zoomLevel,
        selectedClipId: state.selectedClipId,
        safeAreaGuide: state.safeAreaGuide
      };
      localStorage.setItem(LOCAL_STORAGE_KEY, JSON.stringify(toSave));
    } catch (e) {
      // ignore
    }
  }, [state.project, state.tracks, state.playhead, state.zoomLevel, state.selectedClipId, state.safeAreaGuide]);

  // Helper to record structured operation
  const pushOperation = useCallback((
    type: OperationType,
    description: string,
    prevState: EditorState,
    nextTracks: TimelineTrack[],
    nextSelectedClipId?: string | null
  ): EditorState => {
    const operation: EditorOperation = {
      id: `op-${Date.now()}`,
      type,
      description,
      timestamp: Date.now(),
      undoSnapshot: {
        tracks: prevState.tracks,
        selectedClipId: prevState.selectedClipId,
        playhead: prevState.playhead
      },
      redoSnapshot: {
        tracks: nextTracks,
        selectedClipId: nextSelectedClipId !== undefined ? nextSelectedClipId : prevState.selectedClipId,
        playhead: prevState.playhead
      }
    };

    return {
      ...prevState,
      tracks: nextTracks,
      selectedClipId: nextSelectedClipId !== undefined ? nextSelectedClipId : prevState.selectedClipId,
      history: {
        past: [operation, ...prevState.history.past].slice(0, 30),
        future: [] // clear redo stack on new operation
      }
    };
  }, []);

  // Action: Set Project Title
  const setProjectTitle = useCallback((title: string) => {
    setState(prev => ({
      ...prev,
      project: { ...prev.project, title, updatedAt: 'Just now' }
    }));
  }, []);

  // Action: Set Aspect Ratio
  const setAspectRatio = useCallback((aspectRatio: '9:16' | '16:9' | '1:1') => {
    setState(prev => ({
      ...prev,
      project: { ...prev.project, aspectRatio, updatedAt: 'Just now' }
    }));
  }, []);

  // Action: Set Playhead
  const setPlayhead = useCallback((time: number) => {
    setState(prev => ({
      ...prev,
      playhead: Math.max(0, Math.min(prev.project.duration, +time.toFixed(2)))
    }));
  }, []);

  // Action: Toggle Play
  const togglePlay = useCallback(() => {
    setState(prev => ({ ...prev, isPlaying: !prev.isPlaying }));
  }, []);

  // Action: Set Zoom
  const setZoomLevel = useCallback((zoomLevel: number) => {
    setState(prev => ({ ...prev, zoomLevel: Math.max(10, Math.min(80, zoomLevel)) }));
  }, []);

  // Action: Toggle Safe Area Guide
  const toggleSafeAreaGuide = useCallback(() => {
    setState(prev => ({ ...prev, safeAreaGuide: !prev.safeAreaGuide }));
  }, []);

  // Action: Select Clip
  const selectClip = useCallback((clipId: string | null) => {
    setState(prev => ({ ...prev, selectedClipId: clipId }));
  }, []);

  // Action: Update Clip Text (Inline caption/text edit)
  const updateClipText = useCallback((clipId: string, newText: string) => {
    setState(prev => {
      const nextTracks = prev.tracks.map(track => ({
        ...track,
        clips: track.clips.map(clip => 
          clip.id === clipId ? { ...clip, content: newText } : clip
        )
      }));
      return pushOperation('replace-text', `Edit text for clip "${clipId}"`, prev, nextTracks);
    });
  }, [pushOperation]);

  // Action: Update Clip Style
  const updateClipStyle = useCallback((clipId: string, styleUpdates: Partial<ClipStyle>) => {
    setState(prev => {
      const nextTracks = prev.tracks.map(track => ({
        ...track,
        clips: track.clips.map(clip => 
          clip.id === clipId ? { ...clip, style: { ...clip.style, ...styleUpdates } } : clip
        )
      }));
      return pushOperation('change-style', `Update styling for clip "${clipId}"`, prev, nextTracks);
    });
  }, [pushOperation]);

  // Action: Update Clip Audio Level
  const updateClipAudio = useCallback((clipId: string, audioLevel: number) => {
    setState(prev => {
      const nextTracks = prev.tracks.map(track => ({
        ...track,
        clips: track.clips.map(clip => 
          clip.id === clipId ? { ...clip, audioLevel: Math.max(0, Math.min(100, audioLevel)) } : clip
        )
      }));
      return pushOperation('change-style', `Set audio level to ${audioLevel}%`, prev, nextTracks);
    });
  }, [pushOperation]);

  // Action: Trim Clip (Left or Right handle)
  const trimClip = useCallback((clipId: string, newStart: number, newEnd: number) => {
    setState(prev => {
      const clampedStart = Math.max(0, +newStart.toFixed(2));
      const clampedEnd = Math.max(clampedStart + 0.5, +newEnd.toFixed(2));

      const nextTracks = prev.tracks.map(track => ({
        ...track,
        clips: track.clips.map(clip => {
          if (clip.id === clipId) {
            return {
              ...clip,
              startSeconds: clampedStart,
              endSeconds: clampedEnd,
              duration: +(clampedEnd - clampedStart).toFixed(2)
            };
          }
          return clip;
        })
      }));

      return pushOperation('trim', `Trimmed clip "${clipId}" to ${clampedStart}s - ${clampedEnd}s`, prev, nextTracks);
    });
  }, [pushOperation]);

  // Action: Split Clip at Playhead
  const splitClipAtPlayhead = useCallback(() => {
    setState(prev => {
      const splitTime = prev.playhead;
      let targetClip: TimelineClip | null = null;
      let targetTrackId: string | null = null;

      // Find clip that encompasses playhead: first check selected clip, otherwise check video or caption track
      if (prev.selectedClipId) {
        for (const track of prev.tracks) {
          const found = track.clips.find(c => c.id === prev.selectedClipId);
          if (found && splitTime > found.startSeconds + 0.3 && splitTime < found.endSeconds - 0.3) {
            targetClip = found;
            targetTrackId = track.id;
            break;
          }
        }
      }

      // If no valid selected clip, find the first track clip intersecting playhead
      if (!targetClip) {
        for (const track of prev.tracks) {
          const found = track.clips.find(c => splitTime > c.startSeconds + 0.3 && splitTime < c.endSeconds - 0.3);
          if (found) {
            targetClip = found;
            targetTrackId = track.id;
            break;
          }
        }
      }

      if (!targetClip || !targetTrackId) {
        return prev; // Nothing to split at current playhead
      }

      const clipA: TimelineClip = {
        ...targetClip,
        id: `${targetClip.id}-pt1`,
        title: `${targetClip.title} (Part 1)`,
        endSeconds: splitTime,
        duration: +(splitTime - targetClip.startSeconds).toFixed(2)
      };

      const clipB: TimelineClip = {
        ...targetClip,
        id: `${targetClip.id}-pt2`,
        title: `${targetClip.title} (Part 2)`,
        startSeconds: splitTime,
        duration: +(targetClip.endSeconds - splitTime).toFixed(2)
      };

      const nextTracks = prev.tracks.map(track => {
        if (track.id !== targetTrackId) return track;
        return {
          ...track,
          clips: track.clips.flatMap(c => c.id === targetClip!.id ? [clipA, clipB] : [c])
        };
      });

      return pushOperation('split', `Split clip at ${splitTime}s`, prev, nextTracks, clipB.id);
    });
  }, [pushOperation]);

  // Action: Delete Selected Clip
  const deleteSelectedClip = useCallback(() => {
    setState(prev => {
      if (!prev.selectedClipId) return prev;
      const targetId = prev.selectedClipId;

      const nextTracks = prev.tracks.map(track => ({
        ...track,
        clips: track.clips.filter(c => c.id !== targetId)
      }));

      return pushOperation('remove', `Deleted clip "${targetId}"`, prev, nextTracks, null);
    });
  }, [pushOperation]);

  // Action: Undo
  const undo = useCallback(() => {
    setState(prev => {
      if (prev.history.past.length === 0) return prev;
      const [lastOp, ...remainingPast] = prev.history.past;

      return {
        ...prev,
        tracks: lastOp.undoSnapshot.tracks,
        selectedClipId: lastOp.undoSnapshot.selectedClipId,
        playhead: lastOp.undoSnapshot.playhead,
        history: {
          past: remainingPast,
          future: [lastOp, ...prev.history.future]
        }
      };
    });
  }, []);

  // Action: Redo
  const redo = useCallback(() => {
    setState(prev => {
      if (prev.history.future.length === 0) return prev;
      const [nextOp, ...remainingFuture] = prev.history.future;

      return {
        ...prev,
        tracks: nextOp.redoSnapshot.tracks,
        selectedClipId: nextOp.redoSnapshot.selectedClipId,
        playhead: nextOp.redoSnapshot.playhead,
        history: {
          past: [nextOp, ...prev.history.past],
          future: remainingFuture
        }
      };
    });
  }, []);

  // Export Project JSON + preview metadata
  const exportStructuredProject = useCallback(() => {
    const exportData = {
      project: state.project,
      tracks: state.tracks,
      exportedAt: new Date().toISOString(),
      vidoraEngineVersion: '2.4-Hackathon',
      renderSpecs: {
        aspectRatio: state.project.aspectRatio,
        duration: state.project.duration,
        resolution: state.project.aspectRatio === '9:16' ? '1080x1920' : '1920x1080',
        fps: 30
      },
      exportType: 'Structured Project JSON + Demo Master Render Link'
    };

    const blob = new Blob([JSON.stringify(exportData, null, 2)], { type: 'application/json' });
    const url = URL.createObjectURL(blob);
    const a = document.createElement('a');
    a.href = url;
    a.download = `${state.project.title.replace(/\s+/g, '_')}_VIDORA.json`;
    a.click();
    URL.revokeObjectURL(url);

    return exportData;
  }, [state]);

  // Apply Structured AI Operation
  const applyAiOperation = useCallback((op: any, userCommand: string) => {
    setState(prev => {
      let nextTracks = [...prev.tracks];

      if (op.type === 'replace_text') {
        nextTracks = prev.tracks.map(track => ({
          ...track,
          clips: track.clips.map(clip =>
            clip.id === op.targetClipId ? { ...clip, content: String(op.afterValue) } : clip
          )
        }));
      } else if (op.type === 'trim') {
        nextTracks = prev.tracks.map(track => ({
          ...track,
          clips: track.clips.map(clip => {
            if (clip.id === op.targetClipId && typeof op.afterValue === 'string') {
              const match = op.afterValue.match(/(\d+(\.\d+)?)s/);
              if (match) {
                const dur = parseFloat(match[1]);
                return { ...clip, duration: dur, endSeconds: +(clip.startSeconds + dur).toFixed(2) };
              }
            }
            return clip;
          })
        }));
      } else if (op.type === 'change_duration') {
        const dur = typeof op.afterValue === 'string' ? parseFloat(op.afterValue) : op.afterValue;
        return {
          ...prev,
          project: { ...prev.project, duration: dur || 25.0 }
        };
      }

      const logEntry = {
        id: op.id,
        timestamp: op.timestamp,
        command: userCommand,
        summary: op.explanation,
        targetClipId: op.targetClipId,
        elementLabel: op.elementLabel,
        beforeValue: op.beforeValue,
        afterValue: op.afterValue,
        diff: op.diff,
        dnaInfluence: op.dnaInfluence,
        undone: false
      };

      const updated = pushOperation('replace-text', `AI: ${op.explanation}`, prev, nextTracks, op.targetClipId);
      return {
        ...updated,
        recentlyChangedClipId: op.targetClipId,
        aiLog: [logEntry, ...(prev.aiLog || [])]
      };
    });

    // Auto-clear highlight after 3.5 seconds
    setTimeout(() => {
      setState(p => ({ ...p, recentlyChangedClipId: null }));
    }, 3500);
  }, [pushOperation]);

  // Undo specific AI operation from AI Log
  const undoAiOperation = useCallback((opId: string) => {
    setState(prev => {
      const entry = (prev.aiLog || []).find(e => e.id === opId);
      if (!entry || entry.undone) return prev;

      const nextTracks = prev.tracks.map(track => ({
        ...track,
        clips: track.clips.map(clip =>
          clip.id === entry.targetClipId ? { ...clip, content: String(entry.beforeValue) } : clip
        )
      }));

      const updatedLog = (prev.aiLog || []).map(e =>
        e.id === opId ? { ...e, undone: true } : e
      );

      const updated = pushOperation('replace-text', `Reverted AI change: ${entry.command}`, prev, nextTracks, entry.targetClipId);
      return {
        ...updated,
        aiLog: updatedLog
      };
    });
  }, [pushOperation]);

  // Find currently selected clip object
  const selectedClip = state.tracks
    .flatMap(t => t.clips)
    .find(c => c.id === state.selectedClipId) || null;

  return {
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
  };
}
