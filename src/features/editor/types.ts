export type TrackType = 'video' | 'audio' | 'captions' | 'text' | 'b-roll';

export interface ClipStyle {
  fontSize?: number;
  color?: string;
  backgroundColor?: string;
  position?: 'top' | 'center' | 'bottom';
  fontWeight?: string;
  textTransform?: 'uppercase' | 'none';
  highlightColor?: string;
}

export interface TimelineClip {
  id: string;
  trackId: string;
  trackType: TrackType;
  title: string;
  startSeconds: number; // position on timeline
  endSeconds: number;   // end position on timeline
  duration: number;     // endSeconds - startSeconds
  sourceStartSeconds?: number; // trim offset within raw asset
  sourceEndSeconds?: number;
  content?: string;     // text content for captions and title overlays
  style?: ClipStyle;
  audioLevel?: number;  // 0 - 100
  color?: string;
  sourceUrl?: string;
}

export interface TimelineTrack {
  id: string;
  type: TrackType;
  label: string;
  height: number; // px
  isMuted: boolean;
  isLocked: boolean;
  clips: TimelineClip[];
}

export type OperationType = 
  | 'trim' 
  | 'split' 
  | 'remove' 
  | 'move' 
  | 'replace-text' 
  | 'change-style' 
  | 'change-duration' 
  | 'add-clip'
  | 'change-aspect-ratio';

export interface EditorOperation {
  id: string;
  type: OperationType;
  description: string;
  timestamp: number;
  undoSnapshot: {
    tracks: TimelineTrack[];
    selectedClipId: string | null;
    playhead: number;
  };
  redoSnapshot: {
    tracks: TimelineTrack[];
    selectedClipId: string | null;
    playhead: number;
  };
}

export interface ProjectMetadata {
  id: string;
  title: string;
  aspectRatio: '9:16' | '16:9' | '1:1';
  duration: number; // total timeline duration in seconds
  fps: number;
  updatedAt: string;
}

export interface AILogEntry {
  id: string;
  timestamp: number;
  command: string;
  summary: string;
  targetClipId: string;
  elementLabel: string;
  beforeValue: string | number;
  afterValue: string | number;
  diff: { before: string; after: string };
  dnaInfluence: string;
  undone?: boolean;
}

export interface EditorState {
  project: ProjectMetadata;
  tracks: TimelineTrack[];
  playhead: number;
  isPlaying: boolean;
  zoomLevel: number; // pixels per second (e.g. 15 to 60)
  selectedClipId: string | null;
  recentlyChangedClipId: string | null;
  safeAreaGuide: boolean;
  aiLog: AILogEntry[];
  history: {
    past: EditorOperation[];
    future: EditorOperation[];
  };
}
