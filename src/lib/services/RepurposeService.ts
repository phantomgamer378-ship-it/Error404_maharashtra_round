import { z } from 'zod';
import { CreatorProfile, PlatformVariant } from '../../types';

// ─────────────────────────────────────────────────────────────────────────────
// TYPES & SCHEMAS
// ─────────────────────────────────────────────────────────────────────────────

export type PlatformId = 'instagram' | 'youtube' | 'linkedin' | 'x' | 'tiktok';

export const PlatformAdaptationSchema = z.object({
  platformId: z.enum(['instagram', 'youtube', 'linkedin', 'x', 'tiktok']),
  platform: z.string(),
  format: z.string(),
  aspectRatio: z.enum(['9:16', '16:9', '1:1', 'text']),
  length: z.string(),
  lengthSeconds: z.number(),
  hook: z.string(),
  adaptedBody: z.string(),
  cta: z.string(),
  captionStyle: z.string(),
  captionText: z.string(),
  hashtags: z.array(z.string()),
  estimatedReach: z.string(),
  toneAdjustment: z.string(),
  structureNotes: z.string(),
  safeAreaRequired: z.boolean(),
  sourceId: z.string(),
  variantId: z.string(),
});

export const WhatIfVariantSchema = z.object({
  id: z.string(),
  label: z.string(),       // "Hook A", "Hook B", "Hook C"
  hookText: z.string(),
  duration: z.number(),    // seconds
  tone: z.string(),        // "Educational" | "Storytelling" | "Humorous"
  curiosityScore: z.number().min(0).max(100),
  audienceFitScore: z.number().min(0).max(100),
  creatorFitScore: z.number().min(0).max(100),
  estimatedOpportunityScore: z.number().min(0).max(100),
  explanation: z.string(), // plain-language reasoning, no guarantees
  basisNote: z.string(),   // signal-based note, uses "estimated", "based on available signals"
  dnaInfluence: z.string(),
  isApplied: z.boolean(),
});

export type PlatformAdaptation = z.infer<typeof PlatformAdaptationSchema>;
export type WhatIfVariant = z.infer<typeof WhatIfVariantSchema>;

export interface ContentTree {
  sourceProjectId: string;
  sourceTopic: string;
  sourceHook: string;
  sourceDuration: string;
  platformAdaptations: PlatformAdaptation[];
  whatIfVariants: WhatIfVariant[];
  generatedAt: string;
  source: 'demo' | 'live';
}

// ─────────────────────────────────────────────────────────────────────────────
// PLATFORM CONFIG — rules for each platform
// ─────────────────────────────────────────────────────────────────────────────

interface PlatformConfig {
  id: PlatformId;
  name: string;
  format: string;
  aspectRatio: '9:16' | '16:9' | '1:1' | 'text';
  maxSeconds: number;
  targetSeconds: number;
  toneModifier: string;
  hookStyle: string;
  captionStyle: string;
  ctaStyle: string;
  safeAreaRequired: boolean;
}

const PLATFORM_CONFIGS: PlatformConfig[] = [
  {
    id: 'instagram',
    name: 'Instagram Reel',
    format: 'Vertical Short-Form Reel',
    aspectRatio: '9:16',
    maxSeconds: 90,
    targetSeconds: 30,
    toneModifier: 'High-energy, visual-first, emoji-forward',
    hookStyle: 'High-stakes visual reveal or pattern interrupt in first 1.5s',
    captionStyle: 'Bold centered overlay, emoji accents, auto-captions visible',
    ctaStyle: 'Comment prompt + Save nudge',
    safeAreaRequired: true,
  },
  {
    id: 'youtube',
    name: 'YouTube Short',
    format: 'Vertical Short',
    aspectRatio: '9:16',
    maxSeconds: 60,
    targetSeconds: 38,
    toneModifier: 'Educational depth with fast cuts, chapter-style flow',
    hookStyle: 'Direct question to viewer in first 2s, teasing the answer',
    captionStyle: 'Highlight-word captions, minimal borders, contrast subtitles',
    ctaStyle: 'Subscribe prompt + full video link in description',
    safeAreaRequired: true,
  },
  {
    id: 'linkedin',
    name: 'LinkedIn Post',
    format: 'Professional Text + Video (optional)',
    aspectRatio: 'text',
    maxSeconds: 0, // text format
    targetSeconds: 0,
    toneModifier: 'Executive, credibility-anchored, data-forward',
    hookStyle: 'Bold stat or counterintuitive insight as first line (no greeting)',
    captionStyle: 'No video captions — structured paragraph format',
    ctaStyle: 'Conversation invite in comments + share ask',
    safeAreaRequired: false,
  },
  {
    id: 'x',
    name: 'X Thread',
    format: '5-7 tweet thread with video teaser',
    aspectRatio: 'text',
    maxSeconds: 0,
    targetSeconds: 0,
    toneModifier: 'Direct, punchy, opinionated, no fluff',
    hookStyle: 'Controversial or alarming first tweet, standalone strong',
    captionStyle: 'Numbered tweets (1/7), short punchy lines, optional image',
    ctaStyle: 'Repost ask + newsletter/DM CTA at last tweet',
    safeAreaRequired: false,
  },
  {
    id: 'tiktok',
    name: 'TikTok',
    format: 'Viral Vertical Short',
    aspectRatio: '9:16',
    maxSeconds: 60,
    targetSeconds: 25,
    toneModifier: 'Casual, relatable, trend-aware, colloquial',
    hookStyle: 'Speak directly to camera, fast energy, colloquial opener in 1s',
    captionStyle: 'Auto-captions on, text stickers, sound-sync cuts',
    ctaStyle: 'Duet/Stitch invite + follow nudge',
    safeAreaRequired: true,
  },
];

// ─────────────────────────────────────────────────────────────────────────────
// REPURPOSE SERVICE
// ─────────────────────────────────────────────────────────────────────────────

export class RepurposeService {
  private source: 'demo' | 'live' = 'demo';

  async generateContentTree(
    sourceProjectId: string,
    sourceTopic: string,
    sourceHook: string,
    sourceScript: string,
    sourceDuration: string,
    selectedPlatforms: PlatformId[],
    creator: CreatorProfile,
  ): Promise<ContentTree> {
    // Simulate async LLM call
    await new Promise(r => setTimeout(r, 800));

    const platformAdaptations = selectedPlatforms
      .map(pid => this._adaptForPlatform(pid, sourceTopic, sourceHook, sourceScript, creator, sourceProjectId))
      .filter((a): a is PlatformAdaptation => a !== null);

    const whatIfVariants = this._generateWhatIfVariants(sourceTopic, sourceHook, creator);

    return {
      sourceProjectId,
      sourceTopic,
      sourceHook,
      sourceDuration,
      platformAdaptations,
      whatIfVariants,
      generatedAt: new Date().toISOString(),
      source: this.source,
    };
  }

  private _adaptForPlatform(
    platformId: PlatformId,
    topic: string,
    sourceHook: string,
    sourceScript: string,
    creator: CreatorProfile,
    sourceProjectId: string,
  ): PlatformAdaptation | null {
    const config = PLATFORM_CONFIGS.find(p => p.id === platformId);
    if (!config) return null;

    const variantId = `variant-${platformId}-${Date.now()}`;
    const dnaName = creator.name;
    const isTechCreator = creator.niche.some(n => n.toLowerCase().includes('cyber') || n.toLowerCase().includes('tech') || n.toLowerCase().includes('ai'));

    let hook = '';
    let adaptedBody = '';
    let cta = '';
    let hashtags: string[] = [];
    let captionText = '';

    if (platformId === 'instagram') {
      hook = `🚨 ${sourceHook.split('?')[0]}? (swipe now)`;
      adaptedBody = `${sourceScript.slice(0, 120)}... [FAST CUT → demo screen] → Here's what happened next. Save this before it's gone. 📌`;
      cta = `Save this. Share it with someone who'd fall for it. Comment "SAFE" if you already knew this.`;
      hashtags = ['#CyberSecurity', '#AIScams', '#DigitalSafety', '#TechTips', '#AIVoice', '#CreatorTips'];
      captionText = `${sourceHook.toUpperCase()} — Watch the full breakdown 🔐`;
    } else if (platformId === 'youtube') {
      hook = `${sourceHook} — I'll prove it in the next 30 seconds.`;
      adaptedBody = `${sourceScript.slice(0, 200)} → [Chapter 1: The Setup] → [Chapter 2: The Demo] → [Chapter 3: Your Defense] — Full breakdown in the description.`;
      cta = `Subscribe for weekly cybersecurity breakdowns. Watch the full video linked below.`;
      hashtags = ['#YouTubeShorts', '#CyberSecurity', '#AIVoiceScam', '#TechEducation'];
      captionText = sourceHook;
    } else if (platformId === 'linkedin') {
      hook = `⚠️ AI voice cloning took 3 seconds to fool a CFO into authorizing a $250K wire transfer.`;
      adaptedBody = `Here's what the attack looked like — and the 1-word protocol that stopped it:\n\n→ Attacker records 10s of audio from earnings call\n→ Feeds it to zero-shot voice cloning API (free)\n→ Calls CFO impersonating CEO voice\n→ CFO authorizes urgent wire\n\nThe defense:\nEstablish a "family safe word" equivalent at your organization.\n\nIf a call asks for urgent action — they must know the word.\n\nThis is ${dnaName}'s OSINT + AI Security digest. I break this down every week.`;
      cta = `What verification protocol does your organization use? Drop it in the comments — let's build a resource thread. ♻️ Repost to protect someone's org.`;
      hashtags = ['#CyberSecurity', '#AIRisk', '#ExecutiveSecurity', '#DeepfakeAudio', '#InfoSec'];
      captionText = ''; // LinkedIn is text-only
    } else if (platformId === 'x') {
      hook = `AI cloned my CEO's voice in 3 seconds.\n\nThe finance team almost wired $250K.\n\nHere's the exact protocol that stopped it 🧵`;
      adaptedBody = `2/ The attack is simple:\n• Get 10s of audio (LinkedIn/YouTube/earnings call)\n• Feed to free API\n• Call impersonating the exec\n\n3/ It works because:\n• Voice is a "trusted signal"\n• Urgency bypasses critical thinking\n• Most orgs have no voice verification\n\n4/ The 1-word fix:\nCreate a family "safe word" but for your team. If the exec can't say it — hang up.\n\n5/ More context:\n→ 70% of deepfake attacks now use cloned audio\n→ Zero-shot models need <10s training data\n→ Free APIs exist for this right now\n\n6/ You don't need expensive tools.\nYou need a protocol and 30 seconds of training.\n\n7/ Follow ${dnaName} for weekly AI + Cyber breakdowns.\nSave 2/ for your team security doc. 🔒`;
      cta = `RT if your org doesn't have a voice verification protocol yet.`;
      hashtags = ['#AIScam', '#CyberSecurity', '#DeepFake', '#InfoSec'];
      captionText = '';
    } else if (platformId === 'tiktok') {
      hook = isTechCreator
        ? `bro your mom's voice is literally for sale on the dark web rn`
        : `${sourceHook.toLowerCase()}`;
      adaptedBody = `okay so i tested this on my actual family. i cloned my own voice in 3 seconds. called my roommate. he almost sent me 500 bucks 💀 here's the one thing that saved him → [text overlay: THE SAFE WORD TRICK] → set a family code word. if the caller doesn't know it, hang up. that's it.`;
      cta = `tell me in comments: could YOUR family tell the difference? 👇 follow for more security stuff that actually matters`;
      hashtags = ['#CyberSecurity', '#AIVoiceScam', '#DigitalSafety', '#TikTokTech', '#AIScam'];
      captionText = `POV: you almost got scammed by your own AI-cloned mom 😳`;
    }

    const raw: PlatformAdaptation = {
      platformId,
      platform: config.name,
      format: config.format,
      aspectRatio: config.aspectRatio,
      length: config.targetSeconds > 0 ? `${config.targetSeconds}s` : 'Text format',
      lengthSeconds: config.targetSeconds,
      hook,
      adaptedBody,
      cta,
      captionStyle: config.captionStyle,
      captionText,
      hashtags,
      estimatedReach: this._estimateReach(platformId),
      toneAdjustment: config.toneModifier,
      structureNotes: `${config.hookStyle}. CTA: ${config.ctaStyle}`,
      safeAreaRequired: config.safeAreaRequired,
      sourceId: sourceProjectId,
      variantId,
    };

    return PlatformAdaptationSchema.parse(raw);
  }

  private _generateWhatIfVariants(topic: string, sourceHook: string, creator: CreatorProfile): WhatIfVariant[] {
    const variants: Omit<WhatIfVariant, 'isApplied'>[] = [
      {
        id: `whatif-hook-a`,
        label: 'Hook A — Question / Curiosity',
        hookText: `If your mom calls asking for $500 right now, STOP. Ask this 1 secret word first.`,
        duration: 30,
        tone: 'Educational',
        curiosityScore: 91,
        audienceFitScore: 88,
        creatorFitScore: 95,
        estimatedOpportunityScore: 89,
        explanation: `High-stakes question format that directly threatens the viewer's family. The "1 secret word" creates a knowledge gap that drives full watch-through.`,
        basisNote: `Based on available signals: Question hooks in Cybersecurity + AI niche show an estimated 88% retention past 3s (Sarth's top performing hook category).`,
        dnaInfluence: `Sarth DNA: Question/Curiosity hook style, High-Stakes Dilemma format — strongest match to creator pattern.`,
      },
      {
        id: `whatif-hook-b`,
        label: 'Hook B — Storytelling / Anecdote',
        hookText: `I cloned my own voice in 3 seconds and almost scammed my roommate. This is what happened.`,
        duration: 45,
        tone: 'Storytelling',
        curiosityScore: 84,
        audienceFitScore: 82,
        creatorFitScore: 88,
        estimatedOpportunityScore: 81,
        explanation: `First-person anecdote builds credibility and relatability. The 45s format allows full story arc: setup → demo → lesson. Longer watch time but lower immediate curiosity spike.`,
        basisNote: `Based on available signals: Screen-capture demonstration hooks show an estimated 82% retention for Sarth's audience (Tech-savvy 18-28 demographic).`,
        dnaInfluence: `Sarth DNA: "Real Screen-Capture Demonstration" hook type — second-best performing pattern. Humorous self-deprecation layer added.`,
      },
      {
        id: `whatif-hook-c`,
        label: 'Hook C — Alarm / Direct Warning',
        hookText: `STOP. Scammers only need 3 seconds of your family member's audio to clone their voice.`,
        duration: 20,
        tone: 'Humorous',
        curiosityScore: 87,
        audienceFitScore: 79,
        creatorFitScore: 85,
        estimatedOpportunityScore: 76,
        explanation: `Ultra-short 20s alarm format optimized for TikTok loop rate. STOP as the first word is a pattern interrupt. Lower audience fit because it skips educational depth that Sarth's audience expects.`,
        basisNote: `Based on available signals: Short alarm hooks (<20s) show higher share rate but an estimated 12% lower subscription conversion than question-style hooks in this niche.`,
        dnaInfluence: `Sarth DNA: High-Energy + Direct tone. Lower creator fit vs. Hook A because it omits the "Why Now" educational layer core to Sarth's brand identity.`,
      },
    ];

    return variants.map(v => WhatIfVariantSchema.parse({ ...v, isApplied: false }));
  }

  private _estimateReach(platformId: PlatformId): string {
    const reachMap: Record<PlatformId, string> = {
      instagram: 'Est. 12K–45K views (based on niche avg.)',
      youtube: 'Est. 8K–28K views (based on available signals)',
      linkedin: 'Est. 800–3.2K impressions (professional niche)',
      x: 'Est. 1.5K–6K impressions (InfoSec audience)',
      tiktok: 'Est. 15K–90K views (algo-boost window)',
    };
    return reachMap[platformId];
  }

  /** Convert a PlatformAdaptation to the legacy PlatformVariant shape for backward compatibility */
  toPlatformVariant(adaptation: PlatformAdaptation): PlatformVariant {
    const platformMap: Record<PlatformId, PlatformVariant['platform']> = {
      instagram: 'Instagram',
      youtube: 'YouTube Shorts',
      linkedin: 'LinkedIn',
      x: 'X (Twitter)',
      tiktok: 'TikTok',
    };
    return {
      platform: platformMap[adaptation.platformId],
      icon: adaptation.platformId,
      format: adaptation.format,
      length: adaptation.length,
      hook: adaptation.hook,
      scriptSnippet: adaptation.adaptedBody.slice(0, 200),
      cta: adaptation.cta,
      estimatedReach: adaptation.estimatedReach,
    };
  }
}

export const repurposeService = new RepurposeService();
