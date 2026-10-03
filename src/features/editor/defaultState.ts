import { EditorState, TimelineTrack } from './types';

// High-fidelity starter tracks for the generated short-form project
export const INITIAL_TRACKS: TimelineTrack[] = [
  {
    id: 'track-text',
    type: 'text',
    label: 'Text Overlays',
    height: 38,
    isMuted: false,
    isLocked: false,
    clips: [
      {
        id: 'clip-hook-title',
        trackId: 'track-text',
        trackType: 'text',
        title: 'Hook Header',
        startSeconds: 0,
        endSeconds: 5.2,
        duration: 5.2,
        content: 'If your mom calls asking for $500, STOP.',
        style: {
          fontSize: 18,
          color: '#ffffff',
          backgroundColor: 'rgba(99, 102, 241, 0.85)',
          position: 'top',
          fontWeight: 'bold',
          textTransform: 'uppercase'
        },
        color: '#818CF8'
      },
      {
        id: 'clip-cta-title',
        trackId: 'track-text',
        trackType: 'text',
        title: 'CTA Reminder',
        startSeconds: 32,
        endSeconds: 38,
        duration: 6,
        content: 'ESTABLISH SAFE CODEWORD TODAY',
        style: {
          fontSize: 16,
          color: '#34D399',
          backgroundColor: 'rgba(0, 0, 0, 0.8)',
          position: 'bottom',
          fontWeight: 'bold',
          textTransform: 'uppercase'
        },
        color: '#10B981'
      }
    ]
  },
  {
    id: 'track-captions',
    type: 'captions',
    label: 'Auto Captions',
    height: 38,
    isMuted: false,
    isLocked: false,
    clips: [
      {
        id: 'cap-1',
        trackId: 'track-captions',
        trackType: 'captions',
        title: 'Caption 1',
        startSeconds: 0,
        endSeconds: 5.0,
        duration: 5.0,
        content: 'If your mom calls you crying asking for money, STOP.',
        style: {
          fontSize: 16,
          color: '#FBBF24',
          position: 'bottom',
          highlightColor: '#F59E0B'
        },
        color: '#F59E0B'
      },
      {
        id: 'cap-2',
        trackId: 'track-captions',
        trackType: 'captions',
        title: 'Caption 2',
        startSeconds: 5.0,
        endSeconds: 18.0,
        duration: 13.0,
        content: 'Scammers only need 3 seconds of audio to clone your exact speech cadence.',
        style: {
          fontSize: 16,
          color: '#ffffff',
          position: 'bottom'
        },
        color: '#F59E0B'
      },
      {
        id: 'cap-3',
        trackId: 'track-captions',
        trackType: 'captions',
        title: 'Caption 3',
        startSeconds: 18.0,
        endSeconds: 32.0,
        duration: 14.0,
        content: 'Establish a two-word family safe codeword that scammers can never guess.',
        style: {
          fontSize: 16,
          color: '#ffffff',
          position: 'bottom'
        },
        color: '#F59E0B'
      },
      {
        id: 'cap-4',
        trackId: 'track-captions',
        trackType: 'captions',
        title: 'Caption 4',
        startSeconds: 32.0,
        endSeconds: 38.0,
        duration: 6.0,
        content: 'Save this video before your parents get this emergency call.',
        style: {
          fontSize: 16,
          color: '#34D399',
          position: 'bottom'
        },
        color: '#F59E0B'
      }
    ]
  },
  {
    id: 'track-broll',
    type: 'b-roll',
    label: 'B-Roll & Overlays',
    height: 38,
    isMuted: false,
    isLocked: false,
    clips: [
      {
        id: 'broll-1',
        trackId: 'track-broll',
        trackType: 'b-roll',
        title: 'Waveform_Glitch_Spectrum.mp4',
        startSeconds: 5.0,
        endSeconds: 18.0,
        duration: 13.0,
        color: '#38BDF8',
        sourceUrl: 'https://images.unsplash.com/photo-1526374965328-7f61d4dc18c5?w=800&auto=format&fit=crop&q=80'
      }
    ]
  },
  {
    id: 'track-video',
    type: 'video',
    label: 'Main Video (A-Roll)',
    height: 44,
    isMuted: false,
    isLocked: false,
    clips: [
      {
        id: 'clip-main-video-1',
        trackId: 'track-video',
        trackType: 'video',
        title: 'EP42_Voice_Scams_Raw.mp4',
        startSeconds: 0,
        endSeconds: 38.0,
        duration: 38.0,
        sourceStartSeconds: 1040,
        sourceEndSeconds: 1078,
        color: '#6366F1',
        sourceUrl: 'https://commondatastorage.googleapis.com/gtv-videos-bucket/sample/ForBiggerBlazes.mp4'
      }
    ]
  },
  {
    id: 'track-audio',
    type: 'audio',
    label: 'Background Audio',
    height: 36,
    isMuted: false,
    isLocked: false,
    clips: [
      {
        id: 'audio-bg-1',
        trackId: 'track-audio',
        trackType: 'audio',
        title: 'Cyber_Atmospheric_Pulse.wav',
        startSeconds: 0,
        endSeconds: 38.0,
        duration: 38.0,
        audioLevel: 75,
        color: '#EC4899'
      }
    ]
  }
];

export const INITIAL_EDITOR_STATE: EditorState = {
  project: {
    id: 'proj-editor-active',
    title: 'AI Voice Scam Emergency Breakdown',
    aspectRatio: '9:16',
    duration: 38.0,
    fps: 30,
    updatedAt: 'Just now'
  },
  tracks: INITIAL_TRACKS,
  playhead: 3.5,
  isPlaying: false,
  zoomLevel: 24, // px per second
  selectedClipId: 'clip-hook-title',
  recentlyChangedClipId: null,
  safeAreaGuide: true,
  aiLog: [],
  history: {
    past: [],
    future: []
  }
};
