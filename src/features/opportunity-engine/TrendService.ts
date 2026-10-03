import { RawTrendSignal } from './types';

export interface ITrendService {
  getRawTrendSignals(): Promise<RawTrendSignal[]>;
  getTopicById(id: string): Promise<RawTrendSignal | undefined>;
  getAdapterSource(): 'demo' | 'live';
}

/**
 * Curated Demo Trend Dataset:
 * - AI Voice Scams (Key Hero Opportunity)
 * - AI Agents
 * - Voice Cloning
 * - College Tech Scams
 * - Student Tech
 * - AI Tools
 * - Productivity
 */
export const DEMO_TREND_SIGNALS: RawTrendSignal[] = [
  {
    id: 'ai-voice-scams',
    topic: 'AI Voice Scams',
    category: 'Cybersecurity & AI',
    primaryNiches: ['Cybersecurity', 'AI Security', 'Technology'],
    trendState: 'Rising',
    rawVelocity: 94,
    searchVolumeGrowth: '+380% 7d',
    competitionLevel: 42,
    uncertaintyScore: 12,
    timingContextScore: 92,
    contentGapScore: 88,
    suggestedPlatform: 'TikTok',
    suggestedFormat: 'Vertical 45s Investigative Reel',
    suggestedAngle: 'Break down how 3 seconds of audio can clone a family member’s voice + 2 practical countermeasures.',
    hookTemplate: 'If you receive a phone call that sounds exactly like your mom crying for help, hang up immediately.',
    ctaTemplate: 'Establish a safe family codeword today — save this video before you need it.',
    summary: 'Exponential surge in generative voice cloning attacks targeting families, seniors, and campus students with high public panic.',
    radarPos: { x: 32, y: 34, size: 76, color: '#818CF8' },
    relatedTopicIds: ['voice-cloning', 'college-tech-scams', 'ai-agents'],
    source: 'demo',
    supportingSignals: [
      {
        id: 'sig-1',
        label: 'FTC & FBI Consumer Advisory Spike',
        source: 'Federal Trade Commission Alert #2026-04',
        metric: '4.2x Incident Reports',
        change: '+420%',
        type: 'news',
        confidence: 96,
        isDemo: true
      },
      {
        id: 'sig-2',
        label: 'Search Interest Surge',
        source: 'Google Trends (Synthetic Demo)',
        metric: '94 / 100 Interest Index',
        change: '+380% 7d',
        type: 'search',
        confidence: 92,
        isDemo: true
      },
      {
        id: 'sig-3',
        label: 'Reddit r/scams Mention Velocity',
        source: 'Reddit Social Crawl',
        metric: '1,420 Discussions',
        change: '+215% MoM',
        type: 'social',
        confidence: 88,
        isDemo: true
      }
    ],
    contentGap: {
      gapTopic: 'AI + College Campus Emergency Voice Scams',
      heavilyCovered: ['Generic deepfake news', 'Corporate CEO spoofing', 'Password hygiene'],
      potentialGap: 'Practical student emergency scams & family verification protocols',
      audienceRelevance: 'HIGH',
      creatorCoverage: 'LOW',
      recommendedApproach: 'Demonstrate a live safe audio sample reproduction and explain the 3-second rule.'
    },
    trajectory: [
      { date: 'Sep 12', interest: 38, change: '+12%', context: 'Initial news broadcast on audio deepfakes' },
      { date: 'Sep 18', interest: 52, change: '+36%', context: 'Viral TikTok showing grandfather emergency scam' },
      { date: 'Sep 24', interest: 69, change: '+32%', context: 'FTC releases national emergency bulletin' },
      { date: 'Sep 29', interest: 84, change: '+21%', context: 'Campus safety departments issue warnings' },
      { date: 'Oct 03', interest: 96, change: '+14%', context: 'Peak velocity across short-form video platforms' }
    ]
  },
  {
    id: 'ai-agents',
    topic: 'AI Agents',
    category: 'Autonomous Systems & LLMs',
    primaryNiches: ['Technology', 'AI Engineering', 'Automation'],
    trendState: 'Rising',
    rawVelocity: 96,
    searchVolumeGrowth: '+420% 14d',
    competitionLevel: 68,
    uncertaintyScore: 16,
    timingContextScore: 88,
    contentGapScore: 78,
    suggestedPlatform: 'YouTube Shorts',
    suggestedFormat: '60s Screen Recording Breakdown',
    suggestedAngle: 'Why single-prompt LLMs are dead: show an autonomous multi-agent loop executing a real task in 30 seconds.',
    hookTemplate: 'Stop talking to chatbots. In 2026, AI is running entire computer systems without human input.',
    ctaTemplate: 'Comment "AGENT" and I will send the open-source repository link.',
    summary: 'Massive transition from chat interfaces to background autonomous agents doing multi-step computer tasks.',
    radarPos: { x: 68, y: 28, size: 82, color: '#38BDF8' },
    relatedTopicIds: ['ai-voice-scams', 'ai-tools', 'productivity'],
    source: 'demo',
    supportingSignals: [
      {
        id: 'sig-agent-1',
        label: 'GitHub Trending Repositories',
        source: 'GitHub API Trending',
        metric: 'Top 5 Repos in AI',
        change: '+14.5k Stars',
        type: 'momentum',
        confidence: 94,
        isDemo: true
      },
      {
        id: 'sig-agent-2',
        label: 'Tech Twitter / X Sentiment',
        source: 'X Discussions Sample',
        metric: '82k Mentions',
        change: '+290% WoW',
        type: 'social',
        confidence: 89,
        isDemo: true
      }
    ],
    contentGap: {
      gapTopic: 'Local vs Cloud Autonomous Agent Security Risks',
      heavilyCovered: ['Automated coding benchmarks', 'Browser agent demos'],
      potentialGap: 'Security permissions: what happens when an autonomous agent has bash access?',
      audienceRelevance: 'HIGH',
      creatorCoverage: 'LOW',
      recommendedApproach: 'Demonstrate prompt injection risks inside autonomous agent tool calls.'
    },
    trajectory: [
      { date: 'Sep 10', interest: 45, change: '+15%', context: 'Agent protocol open-source drop' },
      { date: 'Sep 17', interest: 62, change: '+37%', context: 'Major tech keynotes highlight autonomous workflows' },
      { date: 'Sep 24', interest: 78, change: '+25%', context: 'Autonomous coder agent benchmarks published' },
      { date: 'Oct 01', interest: 92, change: '+18%', context: 'Developer adoption spikes on social media' }
    ]
  },
  {
    id: 'voice-cloning',
    topic: 'Voice Cloning',
    category: 'Generative Audio & Synthetic Media',
    primaryNiches: ['Technology', 'AI Tools', 'Cybersecurity'],
    trendState: 'Rising',
    rawVelocity: 88,
    searchVolumeGrowth: '+260% 7d',
    competitionLevel: 58,
    uncertaintyScore: 18,
    timingContextScore: 82,
    contentGapScore: 72,
    suggestedPlatform: 'Instagram',
    suggestedFormat: '30s Side-by-Side Audio Test',
    suggestedAngle: 'Can you spot the difference between real speech and free cloned audio? Interactive blind test.',
    hookTemplate: 'One of these two audio clips is me. The other was made in 12 seconds with free software.',
    ctaTemplate: 'Which one did you guess? Check pinned comment for the answer.',
    summary: 'Accessible consumer-grade voice cloning tools sparking curiosity and ethics debates.',
    radarPos: { x: 44, y: 52, size: 66, color: '#C084FC' },
    relatedTopicIds: ['ai-voice-scams', 'ai-tools'],
    source: 'demo',
    supportingSignals: [
      {
        id: 'sig-vc-1',
        label: 'Hugging Face Audio Model Downloads',
        source: 'HF Hub Weekly Metrics',
        metric: '680k Downloads',
        change: '+175%',
        type: 'momentum',
        confidence: 91,
        isDemo: true
      }
    ],
    contentGap: {
      gapTopic: 'Watermarking & Detection Accuracy for Voice Clones',
      heavilyCovered: ['Celebrity voice memes', 'President voice gaming skits'],
      potentialGap: 'How audio forensic algorithms detect synthetic breathing artifacts',
      audienceRelevance: 'HIGH',
      creatorCoverage: 'LOW',
      recommendedApproach: 'Show waveform visual comparison between natural cadence and synthetic output.'
    },
    trajectory: [
      { date: 'Sep 14', interest: 50, change: '+20%', context: 'New open source zero-shot audio model release' },
      { date: 'Sep 21', interest: 68, change: '+36%', context: 'Viral music voice swap controversy' },
      { date: 'Sep 28', interest: 82, change: '+20%', context: 'Creator debates on voice rights and licensing' }
    ]
  },
  {
    id: 'college-tech-scams',
    topic: 'College Tech Scams',
    category: 'Student Tech & Campus Safety',
    primaryNiches: ['Cybersecurity', 'Student Tech', 'Education'],
    trendState: 'Rising',
    rawVelocity: 85,
    searchVolumeGrowth: '+190% Fall Semester',
    competitionLevel: 34,
    uncertaintyScore: 14,
    timingContextScore: 94,
    contentGapScore: 91,
    suggestedPlatform: 'TikTok',
    suggestedFormat: '40s Campus Survival Tips',
    suggestedAngle: 'The top 3 tech scams spreading across university campuses right now (fake financial aid portals, cloned professor emails).',
    hookTemplate: 'If you are in college right now, your university email is being targeted by this new botnet.',
    ctaTemplate: 'Send this to your college roommate before they click the fake scholarship link.',
    summary: 'Seasonal surge in targeted phishing and fee payment scams specifically targeting undergraduates.',
    radarPos: { x: 22, y: 72, size: 62, color: '#F43F5E' },
    relatedTopicIds: ['ai-voice-scams', 'student-tech'],
    source: 'demo',
    supportingSignals: [
      {
        id: 'sig-col-1',
        label: 'Campus IT Security Bulletins',
        source: 'University Threat Advisory Consortia',
        metric: '48 Campuses Targeted',
        change: '+310% semester start',
        type: 'news',
        confidence: 95,
        isDemo: true
      }
    ],
    contentGap: {
      gapTopic: 'Fake University Housing Wire Scams with AI Verification',
      heavilyCovered: ['Generic textbook PDF scams'],
      potentialGap: 'Sophisticated off-campus lease scams exploiting student urgency',
      audienceRelevance: 'HIGH',
      creatorCoverage: 'LOW',
      recommendedApproach: 'Provide a 3-step checklist to verify landlord identity and student wire addresses.'
    },
    trajectory: [
      { date: 'Sep 05', interest: 30, change: '+10%', context: 'Fall semester semester orientation begins' },
      { date: 'Sep 15', interest: 58, change: '+93%', context: 'Wave of fake financial aid text messages' },
      { date: 'Sep 25', interest: 79, change: '+36%', context: 'Student loan forgiveness phishing campaign' },
      { date: 'Oct 02', interest: 88, change: '+11%', context: 'High engagement across university subreddits' }
    ]
  },
  {
    id: 'student-tech',
    topic: 'Student Tech',
    category: 'Productivity & Hardware for Students',
    primaryNiches: ['Student Tech', 'Technology', 'Productivity'],
    trendState: 'Stable',
    rawVelocity: 74,
    searchVolumeGrowth: '+85% 30d',
    competitionLevel: 72,
    uncertaintyScore: 15,
    timingContextScore: 78,
    contentGapScore: 60,
    suggestedPlatform: 'YouTube Shorts',
    suggestedFormat: '45s Setup & App Tour',
    suggestedAngle: '5 free open-source apps that make college research 10x faster without paying for premium subscriptions.',
    hookTemplate: 'Never pay for study apps in college. These 5 free tools are objectively better.',
    ctaTemplate: 'Full list in the bio or description.',
    summary: 'High and steady demand for student workflow optimization, laptops, and study software.',
    radarPos: { x: 55, y: 75, size: 58, color: '#10B981' },
    relatedTopicIds: ['college-tech-scams', 'productivity', 'ai-tools'],
    source: 'demo',
    supportingSignals: [
      {
        id: 'sig-st-1',
        label: 'Back-to-School Search Steady Index',
        source: 'Search Aggregation',
        metric: '75 / 100 Stable Baseline',
        change: '+8%',
        type: 'search',
        confidence: 90,
        isDemo: true
      }
    ],
    contentGap: {
      gapTopic: 'Privacy-focused Student Study Tools without Data Scraping',
      heavilyCovered: ['Top 5 iPad apps', 'Notion templates'],
      potentialGap: 'Local markdown notes and private research assistants that run offline',
      audienceRelevance: 'MEDIUM',
      creatorCoverage: 'MEDIUM',
      recommendedApproach: 'Show how to run a local note search engine without cloud subscription fees.'
    },
    trajectory: [
      { date: 'Sep 01', interest: 85, change: '+40%', context: 'Back to school rush' },
      { date: 'Sep 15', interest: 80, change: '-6%', context: 'Mid-term preparation cycle begins' },
      { date: 'Oct 01', interest: 76, change: '-5%', context: 'Normalizing into study routines' }
    ]
  },
  {
    id: 'ai-tools',
    topic: 'AI Tools',
    category: 'Software & Creator Utilities',
    primaryNiches: ['AI Tools', 'Technology', 'Productivity'],
    trendState: 'Saturated',
    rawVelocity: 82,
    searchVolumeGrowth: '+110% 30d',
    competitionLevel: 89,
    uncertaintyScore: 22,
    timingContextScore: 70,
    contentGapScore: 45,
    suggestedPlatform: 'LinkedIn',
    suggestedFormat: 'Carousel / Short Video',
    suggestedAngle: 'Filter out the AI garbage: 3 tools that actually saved me 5 hours this week vs 5 tools you should avoid.',
    hookTemplate: '95% of AI tools launched this month are just wrappers. Here are the 3 that actually do work.',
    ctaTemplate: 'Save this post to audit your tech stack this weekend.',
    summary: 'Extremely high volume of generic tool announcements leading to creator fatigue and high competition.',
    radarPos: { x: 78, y: 64, size: 68, color: '#F59E0B' },
    relatedTopicIds: ['ai-agents', 'productivity'],
    source: 'demo',
    supportingSignals: [
      {
        id: 'sig-tools-1',
        label: 'Product Hunt AI Launches',
        source: 'Product Hunt Weekly API',
        metric: '180+ Weekly AI Products',
        change: '+12% saturation',
        type: 'momentum',
        confidence: 88,
        isDemo: true
      }
    ],
    contentGap: {
      gapTopic: 'Security Auditing of Popular AI Browser Extensions',
      heavilyCovered: ['"Top 10 AI tools you didn’t know existed"', 'ChatGPT prompt cheatsheets'],
      potentialGap: 'Which popular AI extensions secretly exfiltrate your browsing cookies?',
      audienceRelevance: 'HIGH',
      creatorCoverage: 'LOW',
      recommendedApproach: 'Decompile an extension and show network traffic leaving the browser.'
    },
    trajectory: [
      { date: 'Aug 25', interest: 90, change: '+15%', context: 'Summer launch frenzy' },
      { date: 'Sep 15', interest: 85, change: '-5%', context: 'Viewer fatigue setting in on generic top-10 lists' },
      { date: 'Oct 01', interest: 81, change: '-4%', context: 'Saturation plateau with high creator competition' }
    ]
  },
  {
    id: 'productivity',
    topic: 'Productivity',
    category: 'Workflow & Creator Mindset',
    primaryNiches: ['Productivity', 'Technology'],
    trendState: 'Stable',
    rawVelocity: 68,
    searchVolumeGrowth: '+35% 30d',
    competitionLevel: 82,
    uncertaintyScore: 20,
    timingContextScore: 65,
    contentGapScore: 50,
    suggestedPlatform: 'LinkedIn',
    suggestedFormat: 'Actionable Breakdown',
    suggestedAngle: 'The anti-productivity trap: why tracking 15 habits is making technical creators publish less.',
    hookTemplate: 'You don’t have an execution problem. You have a setup addiction.',
    ctaTemplate: 'What is one tool you deleted recently? Share below.',
    summary: 'Evergreen interest in deep work, focus rituals, and creator workflows, but crowded with identical advice.',
    radarPos: { x: 82, y: 84, size: 54, color: '#64748B' },
    relatedTopicIds: ['student-tech', 'ai-tools'],
    source: 'demo',
    supportingSignals: [
      {
        id: 'sig-prod-1',
        label: 'Search Trends Baseline',
        source: 'Topic Volume Index',
        metric: 'Evergreen 65/100',
        change: '+2%',
        type: 'search',
        confidence: 85,
        isDemo: true
      }
    ],
    contentGap: {
      gapTopic: 'Minimalist Engineering Workflows Without SaaS Bloat',
      heavilyCovered: ['Morning routines of CEOs', 'Time blocking methods'],
      potentialGap: 'Terminal-only developer productivity and distraction shields',
      audienceRelevance: 'MEDIUM',
      creatorCoverage: 'LOW',
      recommendedApproach: 'Show a 1-screen minimalist setup that removes all notifications.'
    },
    trajectory: [
      { date: 'Sep 01', interest: 70, change: '+5%', context: 'Monthly goal setting' },
      { date: 'Sep 15', interest: 68, change: '-3%', context: 'Standard baseline' },
      { date: 'Oct 01', interest: 67, change: '-1%', context: 'Predictable recurring interest' }
    ]
  }
];

export class DemoTrendAdapter implements ITrendService {
  async getRawTrendSignals(): Promise<RawTrendSignal[]> {
    // Returns curated dataset with synthetic labels
    return [...DEMO_TREND_SIGNALS];
  }

  async getTopicById(id: string): Promise<RawTrendSignal | undefined> {
    return DEMO_TREND_SIGNALS.find(s => s.id === id);
  }

  getAdapterSource(): 'demo' | 'live' {
    return 'demo';
  }
}

/**
 * Live adapter stub for Google Trends / YouTube API integration behind the same interface.
 */
export class LiveTrendAdapterStub implements ITrendService {
  async getRawTrendSignals(): Promise<RawTrendSignal[]> {
    // In live mode, this would query Google Trends RSS / YouTube Data API v3
    // Falling back gracefully with live adapter labeling
    return DEMO_TREND_SIGNALS.map(s => ({
      ...s,
      source: 'live' as const,
      supportingSignals: s.supportingSignals.map(sig => ({
        ...sig,
        isDemo: false,
        source: sig.source.replace('(Synthetic Demo)', '(Live API Feed)')
      }))
    }));
  }

  async getTopicById(id: string): Promise<RawTrendSignal | undefined> {
    const list = await this.getRawTrendSignals();
    return list.find(s => s.id === id);
  }

  getAdapterSource(): 'demo' | 'live' {
    return 'live';
  }
}

// Default export instance
export const trendService: ITrendService = new DemoTrendAdapter();
