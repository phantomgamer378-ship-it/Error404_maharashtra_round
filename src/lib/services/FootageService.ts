export interface ScriptAlignmentMapping {
  scriptSectionTitle: string;
  matchedTimestamp: string;
  sourceSecondsStart: number;
  sourceSecondsEnd: number;
  similarityScore: number; // 0 - 100
  dialogueSnippet: string;
}

export interface CandidateKeyMoment {
  id: string;
  timestamp: string; // e.g. "00:17:20"
  timestampEnd: string; // e.g. "00:18:02"
  startSeconds: number;
  endSeconds: number;
  duration: string; // e.g. "42s"
  topic: string;
  reason: string;
  potentialScore: number; // 0 - 100
  suggestedHook: string;
  ctaSuggestion: string;
  previewThumbnail: string;
  speechCadence: 'High Energy' | 'Analytical' | 'Dramatic Pause';
  scriptAlignment?: ScriptAlignmentMapping;
}

export interface RawFootageMetadata {
  id: string;
  fileName: string;
  duration: string;
  durationSeconds: number;
  resolution: string;
  fileSize: string;
  uploadDate: string;
  thumbnail: string;
  attachedScriptTitle?: string;
  keyMoments: CandidateKeyMoment[];
  transcriptSnippet: string;
}

export interface ProcessingStage {
  stage: 'Uploading' | 'Transcribing' | 'Understanding' | 'Finding moments' | 'Matching script' | 'Generating clips';
  progress: number;
  description: string;
}

export interface IFootageService {
  getSampleFootage(): Promise<RawFootageMetadata>;
  processUploadedFootage(file: File, attachedScript?: string): Promise<RawFootageMetadata>;
  createClipProject(sourceFootageId: string, moment: CandidateKeyMoment): Promise<any>;
}

export const SAMPLE_FOOTAGE_METADATA: RawFootageMetadata = {
  id: 'footage-ep42',
  fileName: 'EP42_AI_SECURITY_AND_SYNTHETIC_MEDIA_RAW.mp4',
  duration: '44m 18s',
  durationSeconds: 2658,
  resolution: '4K ProRes 60fps (3840x2160)',
  fileSize: '4.8 GB',
  uploadDate: 'Today at 3:15 PM',
  thumbnail: 'https://images.unsplash.com/photo-1590602847861-f357a9332bbc?w=800&auto=format&fit=crop&q=80',
  attachedScriptTitle: 'AI Voice Cloning & Campus Emergency Phishing Script v2',
  transcriptSnippet: `[00:00:15] Hey everyone, welcome back. Today we have a heavy breakdown on synthetic media exploits.
[00:03:12] Let's start with employee phishing. The numbers from last quarter show that 90% of organizations fail simulated spear phishing when generative text mimics internal Slack style.
[00:08:45] Look at the deepfake CEO authorization attack in the UK. The attacker used generative pitch modulation over a phone line during an active wire transfer window.
[00:17:20] Now, the voice cloning loophole. All you need is three seconds of clear audio from someone's Instagram story or podcast teaser. Watch what happens when I input this raw 3-second sample into a zero-shot model...
[00:31:42] Moving into autonomous agent hijacking. When developers grant terminal execution privileges to an LLM without sandboxing, prompt injection becomes a full remote code execution exploit.`,
  keyMoments: [
    {
      id: 'moment-voice-cloning',
      timestamp: '00:17:20',
      timestampEnd: '00:18:02',
      startSeconds: 1040,
      endSeconds: 1082,
      duration: '42s',
      topic: 'Voice Cloning: The 3-Second Audio Loophole',
      reason: 'Dramatic demonstration hook with direct audio proof. Viewer retention index peaks at 98% during live audio waveform comparison.',
      potentialScore: 98,
      suggestedHook: 'I cloned my own voice using 3 seconds of podcast audio. Listen to this.',
      ctaSuggestion: 'Establish a family safe codeword today before someone targets your parents.',
      previewThumbnail: 'https://images.unsplash.com/photo-1598488035139-bdbb2231ce04?w=600&auto=format&fit=crop&q=80',
      speechCadence: 'High Energy',
      scriptAlignment: {
        scriptSectionTitle: 'The Mechanism Breakdown',
        matchedTimestamp: '00:17:24',
        sourceSecondsStart: 1044,
        sourceSecondsEnd: 1070,
        similarityScore: 96,
        dialogueSnippet: 'All you need is three seconds of clear audio from someone’s Instagram story or podcast teaser...'
      }
    },
    {
      id: 'moment-deepfake-attack',
      timestamp: '00:08:45',
      timestampEnd: '00:09:28',
      startSeconds: 525,
      endSeconds: 568,
      duration: '43s',
      topic: 'Deepfake CEO Video Authorization Attack',
      reason: 'High-stakes real-world crime story with authoritative pacing. Strong educational warning value.',
      potentialScore: 96,
      suggestedHook: 'A European CEO wired $240,000 to an AI deepfake. Here is the exact psychological trick.',
      ctaSuggestion: 'Share this with your finance department before wire transfers.',
      previewThumbnail: 'https://images.unsplash.com/photo-1563986768609-322da13575f3?w=600&auto=format&fit=crop&q=80',
      speechCadence: 'Analytical',
      scriptAlignment: {
        scriptSectionTitle: 'The Threat Evidence',
        matchedTimestamp: '00:08:52',
        sourceSecondsStart: 532,
        sourceSecondsEnd: 560,
        similarityScore: 93,
        dialogueSnippet: 'The attacker used generative pitch modulation over a phone line during an active wire transfer window...'
      }
    },
    {
      id: 'moment-ai-phishing',
      timestamp: '00:03:12',
      timestampEnd: '00:03:54',
      startSeconds: 192,
      endSeconds: 234,
      duration: '42s',
      topic: 'AI Phishing & Synthetic Spear-Phishing Vectors',
      reason: 'Rapid-fire statistics and immediate visual proof of email header spoofing.',
      potentialScore: 94,
      suggestedHook: '90% of tech employees fail this AI simulated phishing test in 2026.',
      ctaSuggestion: 'Save this checklist to audit your team’s email security.',
      previewThumbnail: 'https://images.unsplash.com/photo-1550751827-4bd374c3f58b?w=600&auto=format&fit=crop&q=80',
      speechCadence: 'High Energy'
    },
    {
      id: 'moment-future-threats',
      timestamp: '00:31:42',
      timestampEnd: '00:32:20',
      startSeconds: 1902,
      endSeconds: 1940,
      duration: '38s',
      topic: 'Future Threats: Autonomous Agent Hijacking',
      reason: 'High curiosity among software engineers and technical creators regarding background tool-calling exploits.',
      potentialScore: 91,
      suggestedHook: 'What happens when an AI agent gets root access to your bash terminal?',
      ctaSuggestion: 'Check the link in bio for the open-source sandboxing guide.',
      previewThumbnail: 'https://images.unsplash.com/photo-1526374965328-7f61d4dc18c5?w=600&auto=format&fit=crop&q=80',
      speechCadence: 'Dramatic Pause'
    }
  ]
};

export class FootageService implements IFootageService {
  async getSampleFootage(): Promise<RawFootageMetadata> {
    // Immediate high-reliability sample return for live demo
    return JSON.parse(JSON.stringify(SAMPLE_FOOTAGE_METADATA));
  }

  async processUploadedFootage(file: File, attachedScript?: string): Promise<RawFootageMetadata> {
    // Real path abstraction: in browser client, we simulate the FFmpeg/STT pipeline
    // while preserving custom uploaded file metadata
    const durationSeconds = 1800 + Math.floor(Math.random() * 900);
    const mins = Math.floor(durationSeconds / 60);
    const secs = durationSeconds % 60;

    return {
      id: `footage-${Date.now()}`,
      fileName: file.name,
      duration: `${mins}m ${secs}s`,
      durationSeconds,
      resolution: '4K 60fps ProRes (Detected)',
      fileSize: `${(file.size / (1024 * 1024)).toFixed(1)} MB`,
      uploadDate: 'Just now',
      thumbnail: 'https://images.unsplash.com/photo-1590602847861-f357a9332bbc?w=800&auto=format&fit=crop&q=80',
      attachedScriptTitle: attachedScript || 'Creator Script Attached',
      transcriptSnippet: `[00:00:10] Analysis of ${file.name} complete.\n[00:04:15] Key hook detected during explanation of technical topic.`,
      keyMoments: SAMPLE_FOOTAGE_METADATA.keyMoments.map(m => ({
        ...m,
        id: `moment-${Date.now()}-${m.id}`
      }))
    };
  }

  async createClipProject(sourceFootageId: string, moment: CandidateKeyMoment): Promise<any> {
    return {
      id: `proj-clip-${Date.now()}`,
      title: `${moment.topic} (Clip)`,
      status: 'Editing',
      duration: moment.duration,
      opportunityScore: moment.potentialScore,
      aspectRatio: '9:16',
      sourceAssetId: sourceFootageId,
      sourceRange: {
        startSeconds: moment.startSeconds,
        endSeconds: moment.endSeconds,
        startFormatted: moment.timestamp,
        endFormatted: moment.timestampEnd
      },
      hookText: moment.suggestedHook,
      ctaText: moment.ctaSuggestion,
      autoCaptions: true
    };
  }
}

export const footageService = new FootageService();
