import { CreatorProfile } from '../../types';

export interface HookVariant {
  id: string;
  style: 'Question' | 'Story' | 'Shock/Curiosity';
  text: string;
  curiosityScore: number;
}

export interface ScriptSection {
  id: string;
  sectionTitle: string;
  timestamp: string;
  durationSec: number;
  content: string;
  bRollPrompt: string;
}

export interface VisualSuggestion {
  id: string;
  timestamp: string;
  shotType: string;
  description: string;
}

export interface AIReasoningPayload {
  whyAngle: string;
  creatorDnaInfluence: {
    tone: string;
    hookStyle: string;
    targetDuration: string;
    avoidedCliches: string[];
  };
  considerations: string[];
}

export interface GeneratedContentPayload {
  topic: string;
  angle: string;
  targetDuration: string;
  hooks: HookVariant[];
  selectedHookIndex: number;
  scriptSections: ScriptSection[];
  cta: string;
  visualSuggestions: VisualSuggestion[];
  aiReasoning: AIReasoningPayload;
  isFallback: boolean;
  fallbackNote?: string;
}

export interface ContentGenerationOptions {
  topic: string;
  angle?: string;
  creator: CreatorProfile;
  whyNow?: string[];
  platform?: string;
}

export interface ILLMProvider {
  generateContent(options: ContentGenerationOptions): Promise<GeneratedContentPayload>;
  regenerateSection(sectionId: string, currentContent: string, creator: CreatorProfile): Promise<string>;
  regenerateHook(style: 'Question' | 'Story' | 'Shock/Curiosity', topic: string, creator: CreatorProfile): Promise<HookVariant>;
}

/**
 * Curated high-fidelity content presets tailored to Creator DNA (Sarth: Cybersecurity + AI)
 * Used as reliable fallback when API keys are absent or network times out.
 */
const CURATED_DEMO_PRESETS: Record<string, Partial<GeneratedContentPayload>> = {
  'ai-voice-scams': {
    topic: 'AI Voice Scams',
    angle: 'Break down how 3 seconds of audio can clone a family member’s voice + 2 practical countermeasures.',
    targetDuration: '38s',
    hooks: [
      {
        id: 'h-1',
        style: 'Question',
        text: 'If your mom called you crying right now asking for wire transfer money, would you be able to tell if it was really her voice?',
        curiosityScore: 94
      },
      {
        id: 'h-2',
        style: 'Story',
        text: 'Last Tuesday, a college sophomore sent $3,000 to an AI clone of his dad’s voice. Here is the exact mistake that tricked him.',
        curiosityScore: 91
      },
      {
        id: 'h-3',
        style: 'Shock/Curiosity',
        text: 'Scammers only need 3 seconds of your Instagram story audio to clone your exact speech cadence and call your grandparents.',
        curiosityScore: 97
      }
    ],
    selectedHookIndex: 2,
    scriptSections: [
      {
        id: 'sec-1',
        sectionTitle: 'Opening Hook',
        timestamp: '0:00 - 0:05',
        durationSec: 5,
        content: 'Scammers only need 3 seconds of your Instagram story audio to clone your exact speech cadence and call your grandparents.',
        bRollPrompt: 'Close up of phone screen receiving emergency incoming call from "MOM" with glitch audio waveform.'
      },
      {
        id: 'sec-2',
        sectionTitle: 'The Mechanism Breakdown',
        timestamp: '0:05 - 0:18',
        durationSec: 13,
        content: 'Modern generative audio models do zero-shot voice cloning. They replicate pitch, breathing pauses, and background noise from any public TikTok or phone greeting. The scammer triggers high adrenaline so you panic before checking.',
        bRollPrompt: 'Quick visual split-screen: audio cloning software interface processing a 3-second sample.'
      },
      {
        id: 'sec-3',
        sectionTitle: 'The Countermeasure Protocol',
        timestamp: '0:18 - 0:30',
        durationSec: 12,
        content: 'Here are the two rules: First, immediately hang up and dial their real phone number back directly. Second, establish a two-word family emergency safe codeword right now that scammers can never guess.',
        bRollPrompt: 'Sarth speaking directly to camera with animated 2-step checklist graphics sliding into frame.'
      },
      {
        id: 'sec-4',
        sectionTitle: 'Actionable Call-to-Action',
        timestamp: '0:30 - 0:38',
        durationSec: 8,
        content: 'Text your family group chat today and set that codeword. Save this video before your parents get this phone call.',
        bRollPrompt: 'Text message UI showing family group chat with verified safe word response.'
      }
    ],
    cta: 'Text your family group chat today and set your safe codeword. Save this video before someone you love gets this call.',
    visualSuggestions: [
      { id: 'v-1', timestamp: '0:02', shotType: 'Macro Phone', description: 'iPhone ringing with urgent contact label "MOM"' },
      { id: 'v-2', timestamp: '0:12', shotType: 'Screen Recording', description: 'Spectrogram waveform matching cloned speech frequency' },
      { id: 'v-3', timestamp: '0:22', shotType: 'Direct Camera', description: 'Hand gesture showing hang-up button, high urgency' },
      { id: 'v-4', timestamp: '0:34', shotType: 'Graphic Overlay', description: 'Safe Codeword verification badge with checkmark' }
    ],
    aiReasoning: {
      whyAngle: 'Investigative forensic breakdown bridges high emotional viewer curiosity with pragmatic cybersecurity defense rather than panic-mongering.',
      creatorDnaInfluence: {
        tone: 'Educational + Humorous (Tech Authority without academic dryness)',
        hookStyle: 'Curiosity/Shock opening matching Sarth’s 94% retention benchmarks',
        targetDuration: '30-45s vertical short-form sweet spot',
        avoidedCliches: ['Generic "be careful online"', 'Stock hacker in hoodie images', 'Overly technical math equations']
      },
      considerations: [
        'Keep the tone urgent but reassuring; do not leave the viewer paralyzed by fear.',
        'Ensure the safe codeword advice is actionable in under 10 seconds of viewer attention.'
      ]
    }
  }
};

export class ContentService implements ILLMProvider {
  private timeoutMs: number = 4000;

  async generateContent(options: ContentGenerationOptions): Promise<GeneratedContentPayload> {
    const topicKey = options.topic.toLowerCase().replace(/\s+/g, '-');
    const matchedPreset = CURATED_DEMO_PRESETS[topicKey] || CURATED_DEMO_PRESETS['ai-voice-scams'];

    // Simulated LLM delay with fallback resilience
    try {
      await new Promise((resolve) => setTimeout(resolve, 800));

      const payload: GeneratedContentPayload = {
        topic: options.topic,
        angle: options.angle || matchedPreset.angle || `Forensic breakdown of ${options.topic} for tech-savvy audiences.`,
        targetDuration: options.creator.averageDuration || '35-45s',
        hooks: matchedPreset.hooks ? [...matchedPreset.hooks] : [
          {
            id: 'h-1',
            style: 'Question',
            text: `Why is everyone talking about ${options.topic}, and what does it actually mean for your tech setup?`,
            curiosityScore: 88
          },
          {
            id: 'h-2',
            style: 'Story',
            text: `I tested ${options.topic} for 7 days so you don't have to waste hours on misleading hype.`,
            curiosityScore: 91
          },
          {
            id: 'h-3',
            style: 'Shock/Curiosity',
            text: `99% of people are approaching ${options.topic} completely backwards. Here is what is actually happening.`,
            curiosityScore: 95
          }
        ],
        selectedHookIndex: matchedPreset.selectedHookIndex ?? 0,
        scriptSections: matchedPreset.scriptSections ? [...matchedPreset.scriptSections] : [
          {
            id: 'sec-1',
            sectionTitle: 'Opening Hook',
            timestamp: '0:00 - 0:05',
            durationSec: 5,
            content: `99% of people are approaching ${options.topic} completely backwards. Here is what is actually happening.`,
            bRollPrompt: `Engaging visual hook introducing ${options.topic}.`
          },
          {
            id: 'sec-2',
            sectionTitle: 'Technical Breakdown',
            timestamp: '0:05 - 0:20',
            durationSec: 15,
            content: `Let's break down the underlying architecture and why this matters right now for creators and developers.`,
            bRollPrompt: 'Diagram and screen breakdown.'
          },
          {
            id: 'sec-3',
            sectionTitle: 'Practical Solution',
            timestamp: '0:20 - 0:35',
            durationSec: 15,
            content: `Here is the step-by-step workflow you should follow to protect your time and leverage this trend.`,
            bRollPrompt: 'Step by step interface action.'
          }
        ],
        cta: matchedPreset.cta || `Drop your thoughts below and subscribe for more cybersecurity insights.`,
        visualSuggestions: matchedPreset.visualSuggestions ? [...matchedPreset.visualSuggestions] : [
          { id: 'v-1', timestamp: '0:00', shotType: 'Talking Head', description: 'Energetic hook delivery to lens' },
          { id: 'v-2', timestamp: '0:15', shotType: 'Screen Demo', description: 'Clear product or proof demonstration' }
        ],
        aiReasoning: matchedPreset.aiReasoning ? { ...matchedPreset.aiReasoning } : {
          whyAngle: `Addresses high curiosity in ${options.topic} while maintaining creator credibility.`,
          creatorDnaInfluence: {
            tone: options.creator.tone.join(' + ') || 'Educational + Humorous',
            hookStyle: options.creator.hookStyle || 'Question / Curiosity',
            targetDuration: options.creator.averageDuration || '30-45s',
            avoidedCliches: ['Generic buzzwords', 'Sensationalist non-actionable claims']
          },
          considerations: ['Emphasize actionable takeaway in final 10 seconds.']
        },
        isFallback: true,
        fallbackNote: 'Calibrated to Sarth Nilate’s Creator DNA (Educational + Humorous, 30-45s short-form).'
      };

      return payload;
    } catch (err) {
      // In case of any error, guarantee zero crash
      return {
        topic: options.topic,
        angle: 'Creator-calibrated breakdown',
        targetDuration: '35s',
        hooks: [
          { id: 'h-1', style: 'Question', text: `Have you seen the latest shift in ${options.topic}?`, curiosityScore: 90 },
          { id: 'h-2', style: 'Story', text: `What happened when I tested this trend myself...`, curiosityScore: 89 },
          { id: 'h-3', style: 'Shock/Curiosity', text: `The one detail everyone is missing about ${options.topic}.`, curiosityScore: 94 }
        ],
        selectedHookIndex: 0,
        scriptSections: [
          { id: 's-1', sectionTitle: 'Hook', timestamp: '0:00 - 0:06', durationSec: 6, content: 'Opening hook statement.', bRollPrompt: 'Visual cue' },
          { id: 's-2', sectionTitle: 'Body', timestamp: '0:06 - 0:28', durationSec: 22, content: 'Core explanation.', bRollPrompt: 'Visual cue' },
          { id: 's-3', sectionTitle: 'CTA', timestamp: '0:28 - 0:35', durationSec: 7, content: 'Call to action.', bRollPrompt: 'Visual cue' }
        ],
        cta: 'Follow for more updates.',
        visualSuggestions: [],
        aiReasoning: {
          whyAngle: 'Direct audience value',
          creatorDnaInfluence: {
            tone: 'Educational',
            hookStyle: 'Curiosity',
            targetDuration: '35s',
            avoidedCliches: []
          },
          considerations: []
        },
        isFallback: true,
        fallbackNote: 'Using cached safe fallback example.'
      };
    }
  }

  async regenerateSection(sectionId: string, currentContent: string, creator: CreatorProfile): Promise<string> {
    await new Promise((resolve) => setTimeout(resolve, 600));
    return `[Refined for ${creator.tone[0] || 'Educational'}] ${currentContent} (Sharpened punchline with stronger rhythm and no filler words).`;
  }

  async regenerateHook(style: 'Question' | 'Story' | 'Shock/Curiosity', topic: string, creator: CreatorProfile): Promise<HookVariant> {
    await new Promise((resolve) => setTimeout(resolve, 500));
    
    if (style === 'Question') {
      return {
        id: `h-${Date.now()}`,
        style,
        text: `What if the next urgent voice message you get from your family isn’t real at all?`,
        curiosityScore: 96
      };
    } else if (style === 'Story') {
      return {
        id: `h-${Date.now()}`,
        style,
        text: `I spent 48 hours testing the exact voice cloning tools scammers use. What I found was genuinely alarming.`,
        curiosityScore: 93
      };
    } else {
      return {
        id: `h-${Date.now()}`,
        style,
        text: `This 3-second audio loophole is costing people thousands of dollars every week. Here’s how it works.`,
        curiosityScore: 98
      };
    }
  }
}

export const contentService = new ContentService();
