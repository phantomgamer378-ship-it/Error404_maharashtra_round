import { 
  CreatorProfile, 
  TrendOpportunity, 
  Project, 
  Asset, 
  AnalyticsData, 
  IdeaItem 
} from '../types';

export const mockCreatorProfile: CreatorProfile = {
  name: "Sarth Nilate",
  avatar: "https://images.unsplash.com/photo-1534528741775-53994a69daeb?auto=format&fit=crop&w=300&q=80",
  niche: ["Technology", "Cybersecurity", "AI Tools"],
  audience: "Tech-savvy professionals & students (18–28 yrs)",
  tone: ["Educational", "Humorous", "High-Energy", "Direct"],
  languages: ["English (Primary)", "Hindi"],
  preferredFormats: ["Vertical Short-form (30-45s)", "LinkedIn Tech Breakdowns"],
  hookStyle: "Question / Curiosity & High-Stakes Dilemma",
  visualStyle: "Dark Cinematic Glass, Fast B-roll Overlay, Neon Accent Labels",
  bestTopics: ["AI Voice Cloning Scams", "Agentic AI Risks", "Student Cyber Defense", "Prompt Hacking"],
  averageDuration: "38 seconds",
  performancePatterns: [
    {
      hookType: "High-Stakes Question Hook",
      retentionRate: 88,
      viralProbability: 92,
      bestPostingTime: "18:00 EST (Wed/Fri)"
    },
    {
      hookType: "Real Screen-Capture Demonstration",
      retentionRate: 82,
      viralProbability: 86,
      bestPostingTime: "12:30 EST (Mon/Thu)"
    },
    {
      hookType: "Humorous AI Fail Showcase",
      retentionRate: 79,
      viralProbability: 89,
      bestPostingTime: "20:00 EST (Sat)"
    }
  ]
};

export const mockTrendOpportunities: TrendOpportunity[] = [
  {
    id: "trend-1",
    topic: "AI Voice Scams",
    category: "Cybersecurity & AI",
    opportunityScore: 89,
    trendVelocity: 91,
    audienceFit: 88,
    creatorFit: 94,
    competition: "Medium",
    trendDirection: "Rising",
    saturationLevel: 32,
    summary: "Scammers are using 3-second voice clips to clone voices of relatives and spoof emergency calls.",
    whyNowReasoning: [
      "Topic interest on TikTok & X surged +140% in the last 72 hours due to recent FTC warnings.",
      "92% audience overlap with your core Cybersecurity + AI demographic.",
      "Strong historical performance: your previous deepfake video got 420K views (3x your average).",
      "Content gap detected: 80% of current videos explain the danger, but NO ONE shows the exact line-by-line defense script."
    ],
    trajectory: [
      { date: "Sep 20", interest: 24, change: "+5%", context: "Initial news reports" },
      { date: "Sep 23", interest: 38, change: "+14%", context: "Viral TikTok case study" },
      { date: "Sep 26", interest: 58, change: "+20%", context: "FTC Warning Bulletin" },
      { date: "Sep 29", interest: 79, change: "+21%", context: "Major tech podcast coverage" },
      { date: "Oct 03", interest: 91, change: "+12%", context: "Peak creator opportunity window" }
    ],
    contentGap: {
      gapTopic: "AI Voice Scam Emergency Defense Protocols",
      heavilyCovered: ["AI phishing awareness", "Password vault setup", "Basic deepfake detection"],
      potentialGap: "AI + College Campus Emergency Voice Scams",
      audienceRelevance: "HIGH",
      creatorCoverage: "LOW"
    }
  },
  {
    id: "trend-2",
    topic: "Autonomous AI Agent Exploits",
    category: "AI Security & Automation",
    opportunityScore: 94,
    trendVelocity: 96,
    audienceFit: 92,
    creatorFit: 90,
    competition: "Low",
    trendDirection: "Rising",
    saturationLevel: 18,
    summary: "Newly launched multi-agent frameworks have unexpected prompt injection vulnerabilities.",
    whyNowReasoning: [
      "Developers are deploying autonomous agents without checking sandbox permissions.",
      "High urgency: 18k GitHub stars across 3 repo releases this week.",
      "Perfect match with your technical cybersecurity profile.",
      "First-mover advantage: minimal high-quality video content exists for this topic."
    ],
    trajectory: [
      { date: "Sep 20", interest: 10, change: "+2%", context: "ArXiv Paper published" },
      { date: "Sep 23", interest: 22, change: "+12%", context: "Open source release" },
      { date: "Sep 26", interest: 45, change: "+23%", context: "Security advisory" },
      { date: "Sep 29", interest: 76, change: "+31%", context: "Tech Twitter breakdown" },
      { date: "Oct 03", interest: 96, change: "+20%", context: "Sustained high velocity" }
    ],
    contentGap: {
      gapTopic: "How to Safe-Guard Auto-GPT & Browser Agents",
      heavilyCovered: ["How to build AI agents", "Top 5 AI agent frameworks"],
      potentialGap: "Live hacking an un-sandboxed AI agent",
      audienceRelevance: "HIGH",
      creatorCoverage: "LOW"
    }
  },
  {
    id: "trend-3",
    topic: "College Student AI Security",
    category: "Digital Safety & Student Life",
    opportunityScore: 86,
    trendVelocity: 84,
    audienceFit: 95,
    creatorFit: 85,
    competition: "Low",
    trendDirection: "Rising",
    saturationLevel: 24,
    summary: "Students falling victim to fake AI homework solver extensions that steal session cookies.",
    whyNowReasoning: [
      "Back-to-school search surge for Chrome extension helpers.",
      "High engagement potential among 18–24 student followers.",
      "Actionable warning angle resonates deeply with younger viewers."
    ],
    trajectory: [
      { date: "Sep 20", interest: 30, change: "+10%", context: "Semester start surge" },
      { date: "Sep 23", interest: 48, change: "+18%", context: "Reddit post viral report" },
      { date: "Sep 26", interest: 64, change: "+16%", context: "University IT warnings" },
      { date: "Sep 29", interest: 78, change: "+14%", context: "TikTok student discussions" },
      { date: "Oct 03", interest: 84, change: "+6%", context: "Steady momentum" }
    ]
  },
  {
    id: "trend-4",
    topic: "Deepfake Identity Theft & Biometrics",
    category: "Identity Defense",
    opportunityScore: 81,
    trendVelocity: 78,
    audienceFit: 84,
    creatorFit: 88,
    competition: "High",
    trendDirection: "Stable",
    saturationLevel: 65,
    summary: "Financial institutions adding video liveness tests; hackers bypassing them with synthetic avatars.",
    whyNowReasoning: [
      "Sustained high interest, though competition is increasing.",
      "Works best if paired with a unique hands-on demo angle."
    ],
    trajectory: [
      { date: "Sep 20", interest: 72, change: "+2%", context: "Bank security report" },
      { date: "Sep 23", interest: 75, change: "+3%", context: "Consensus interest" },
      { date: "Sep 26", interest: 77, change: "+2%", context: "Stable market" },
      { date: "Sep 29", interest: 76, change: "-1%", context: "High saturation" },
      { date: "Oct 03", interest: 78, change: "+2%", context: "Sustained baseline" }
    ]
  }
];

export const mockProjects: Project[] = [
  {
    id: "proj-1",
    title: "AI Voice Scam Emergency Breakdown",
    niche: "Cybersecurity + AI",
    status: "Editing",
    updatedAt: "10 mins ago",
    duration: "00:38",
    thumbnail: "https://images.unsplash.com/photo-1563986768609-322da13575f3?auto=format&fit=crop&w=600&q=80",
    hookText: "If your mom calls you crying asking for $500, STOP. Do NOT send money until you ask her THIS 1 secret word.",
    scriptText: `[HOOK] If your mom calls you crying asking for $500, STOP. Do NOT send money until you ask her THIS 1 secret word.

[EXPLANATION] Scammers are using 3-second audio snippets from your public Instagram videos to clone your exact voice pitch and emotion in real-time.

[DEMONSTRATION] I cloned my own voice in 12 seconds. Listen to this: "Hey son, I lost my wallet, send cash now." That was 100% AI.

[ACTIONABLE DEFENSE] Set up a family safe-word right now with your parents. If they ever get an urgent call, ask for the safe-word. If they can't answer it, hang up instantly.

[CTA] Save this video and share it with your parents before they get targeted.`,
    opportunityScore: 89,
    keyMoments: [
      {
        id: "km-1",
        timestamp: "00:03:12",
        seconds: 192,
        duration: "00:24",
        topic: "Voice Clone Demo",
        reason: "Highest emotional peak & clearest visual demonstration of voice spoofing.",
        potentialScore: 94,
        previewThumbnail: "https://images.unsplash.com/photo-1563986768609-322da13575f3?auto=format&fit=crop&w=300&q=80",
        hookSuggestion: "Watch AI clone my voice in under 5 seconds..."
      },
      {
        id: "km-2",
        timestamp: "00:08:45",
        seconds: 525,
        duration: "00:18",
        topic: "Family Safe-Word Defense",
        reason: "Extremely actionable takeaway; high shareability coefficient.",
        potentialScore: 89,
        previewThumbnail: "https://images.unsplash.com/photo-1526374965328-7f61d4dc18c5?auto=format&fit=crop&w=300&q=80",
        hookSuggestion: "The 1 trick that defeats AI voice scams instantly."
      },
      {
        id: "km-3",
        timestamp: "00:17:20",
        seconds: 1040,
        duration: "00:30",
        topic: "College Student Target Warning",
        reason: "Strong resonance with 18-24 audience cohort.",
        potentialScore: 85,
        previewThumbnail: "https://images.unsplash.com/photo-1516321318423-f06f85e504b3?auto=format&fit=crop&w=300&q=80",
        hookSuggestion: "Why college students are being targeted by voice clones."
      }
    ],
    contentVariants: [
      {
        id: "var-1",
        name: "Variant A (High Stakes Emergency Hook)",
        duration: "35 sec",
        tone: "High Energy & Urgent",
        hook: "If your mom calls you crying asking for $500, STOP. Ask this 1 word first.",
        curiosityScore: 94,
        audienceFitScore: 92,
        creatorFitScore: 95,
        estimatedOpportunityScore: 92
      },
      {
        id: "var-2",
        name: "Variant B (Live Demo Reveal)",
        duration: "42 sec",
        tone: "Educational & Tech Demo",
        hook: "That wasn't my real voice speaking. That was an AI clone trained on 3 seconds of audio.",
        curiosityScore: 88,
        audienceFitScore: 90,
        creatorFitScore: 91,
        estimatedOpportunityScore: 87
      },
      {
        id: "var-3",
        name: "Variant C (Humorous Cautionary Story)",
        duration: "38 sec",
        tone: "Humorous & Casual",
        hook: "I tried to scam my own roommate with an AI voice clone and things got weird...",
        curiosityScore: 91,
        audienceFitScore: 85,
        creatorFitScore: 88,
        estimatedOpportunityScore: 84
      }
    ],
    platformVariants: [
      {
        platform: "Instagram",
        icon: "Instagram",
        format: "9:16 Vertical Reel",
        length: "35s",
        hook: "If your mom calls crying asking for money, STOP. Do this first. 🚨",
        scriptSnippet: "Scammers clone voices from 3-second Instagram clips. Set up a family safe-word today!",
        cta: "Share this Reel to your family story right now.",
        estimatedReach: "45K - 120K views"
      },
      {
        platform: "YouTube Shorts",
        icon: "Youtube",
        format: "9:16 Short",
        length: "38s",
        hook: "AI cloned my voice in 10 seconds. Here's how to stop scammers.",
        scriptSnippet: "Listen to this clone vs real voice. Notice the pitch cadence...",
        cta: "Subscribe for weekly AI security breakdowns!",
        estimatedReach: "80K - 250K views"
      },
      {
        platform: "LinkedIn",
        icon: "Linkedin",
        format: "Text + Carousel + Video",
        length: "1.5 min read",
        hook: "AI Voice Cloning is no longer a sci-fi threat. It's an active corporate & personal risk.",
        scriptSnippet: "Last week, an employee transferred funds after an AI voice call. Here are 3 verification protocols every organization must adopt...",
        cta: "Repost to protect your network.",
        estimatedReach: "12K - 35K impressions"
      },
      {
        platform: "X (Twitter)",
        icon: "Twitter",
        format: "Thread + Clip",
        length: "4 Tweets",
        hook: "1/4: Scammers only need 3 seconds of your voice to spoof your relatives. Here's the technical breakdown and defense protocol 🧵👇",
        scriptSnippet: "2/4: How modern voice synthesis models sample formant frequencies...",
        cta: "Bookmark & RT to spread awareness.",
        estimatedReach: "25K - 90K impressions"
      }
    ]
  },
  {
    id: "proj-2",
    title: "Autonomous AI Agent Sandbox Breach",
    niche: "AI Security",
    status: "Draft",
    updatedAt: "2 hours ago",
    duration: "00:45",
    thumbnail: "https://images.unsplash.com/photo-1526374965328-7f61d4dc18c5?auto=format&fit=crop&w=600&q=80",
    hookText: "I gave an AI agent access to my browser and it almost ordered 50 pizzas. Here is how prompt injection happened.",
    scriptText: "Full script for autonomous agent security breakdown...",
    opportunityScore: 94
  },
  {
    id: "proj-3",
    title: "Chrome Extension Cookie Stealers Exposed",
    niche: "Student Tech",
    status: "Ready",
    updatedAt: "1 day ago",
    duration: "00:32",
    thumbnail: "https://images.unsplash.com/photo-1516321318423-f06f85e504b3?auto=format&fit=crop&w=600&q=80",
    hookText: "That free homework helper Chrome extension might be reading your session cookies right now.",
    scriptText: "Full script for Chrome extension audit...",
    opportunityScore: 86
  }
];

export const mockAssets: Asset[] = [
  {
    id: "asset-raw-1",
    title: "EP42_AI_SECURITY_AND_SYNTHETIC_MEDIA_RAW.mp4",
    type: "Video",
    duration: "44:18",
    size: "4.8 GB",
    tags: ["Raw Footage", "Voice Cloning", "Cybersecurity", "Studio Master", "4K ProRes"],
    thumbnail: "https://images.unsplash.com/photo-1590602847861-f357a9332bbc?w=800&auto=format&fit=crop&q=80",
    dateAdded: "Oct 03, 2026",
    collection: "Studio Masters",
    transcriptSnippet: "All you need is three seconds of clear audio from someone's Instagram story to clone their speech cadence...",
    aiDescription: "Full 44-minute studio recording covering voice cloning loopholes, campus tech scams, and deepfake auth attacks."
  },
  {
    id: "asset-derived-1",
    title: "AI Voice Cloning - 3-Second Loophole (9:16 Short Clip)",
    type: "Generated",
    duration: "00:42",
    size: "84 MB",
    tags: ["Generated Clip", "Voice Cloning", "9:16", "Short-Form"],
    thumbnail: "https://images.unsplash.com/photo-1598488035139-bdbb2231ce04?w=600&auto=format&fit=crop&q=80",
    dateAdded: "Just now",
    collection: "Short-Form Cuts",
    sourceDerivedFrom: {
      parentId: "asset-raw-1",
      parentTitle: "EP42_AI_SECURITY_AND_SYNTHETIC_MEDIA_RAW.mp4",
      timestampRange: "00:17:20 - 00:18:02"
    },
    aiDescription: "AI-extracted vertical highlight clip with auto-captions and hook: 'I cloned my own voice using 3 seconds of podcast audio.'"
  },
  {
    id: "asset-derived-2",
    title: "Deepfake CEO Wire Fraud Attack (9:16 Short Clip)",
    type: "Generated",
    duration: "00:43",
    size: "86 MB",
    tags: ["Generated Clip", "Deepfakes", "CEO Wire", "9:16"],
    thumbnail: "https://images.unsplash.com/photo-1563986768609-322da13575f3?w=600&auto=format&fit=crop&q=80",
    dateAdded: "2 hours ago",
    collection: "Short-Form Cuts",
    sourceDerivedFrom: {
      parentId: "asset-raw-1",
      parentTitle: "EP42_AI_SECURITY_AND_SYNTHETIC_MEDIA_RAW.mp4",
      timestampRange: "00:08:45 - 00:09:28"
    },
    aiDescription: "AI-extracted highlight clip: European CEO wire transfer authorization breakdown with animated waveform overlay."
  },
  {
    id: "asset-2",
    title: "B-Roll - Hacker Waveform & Glitch Spectrum.mp4",
    type: "Video",
    duration: "00:15",
    size: "180 MB",
    tags: ["B-Roll", "Glitch", "Cyber", "Overlay", "Motion"],
    thumbnail: "https://images.unsplash.com/photo-1526374965328-7f61d4dc18c5?w=600&auto=format&fit=crop&q=80",
    dateAdded: "Sep 28, 2026",
    collection: "B-Roll & Overlays",
    aiDescription: "Cinematic dark digital audio waveform animation with glitch transitions for short-form overlays."
  },
  {
    id: "asset-3",
    title: "Script - Voice Scam Emergency Safe-Word Protocol.md",
    type: "Script",
    size: "14 KB",
    tags: ["Script", "Hook", "Cybersecurity", "Short-Form"],
    thumbnail: "https://images.unsplash.com/photo-1516321318423-f06f85e504b3?w=600&auto=format&fit=crop&q=80",
    dateAdded: "Oct 02, 2026",
    collection: "Scripts",
    aiDescription: "Complete optimized short-form script with Question, Story, and Shock hook variants calibrated to Sarth's DNA."
  },
  {
    id: "asset-4",
    title: "Audio - Cyber Atmospheric Pulse (Binaural).wav",
    type: "Audio",
    duration: "02:30",
    size: "45 MB",
    tags: ["Audio", "Background", "Atmospheric", "Synth"],
    thumbnail: "https://images.unsplash.com/photo-1511671782779-c97d3d27a1d4?w=600&auto=format&fit=crop&q=80",
    dateAdded: "Sep 15, 2026",
    collection: "Audio Stems",
    aiDescription: "Subtle low-frequency synth pulse background audio track tailored for tension and focus."
  },
  {
    id: "asset-5",
    title: "Thumbnail Template - Red Emergency Alert.png",
    type: "Image",
    size: "4.2 MB",
    tags: ["Image", "Thumbnail", "Graphic", "Overlay"],
    thumbnail: "https://images.unsplash.com/photo-1550751827-4bd374c3f58b?w=600&auto=format&fit=crop&q=80",
    dateAdded: "Sep 22, 2026",
    collection: "Thumbnails & Graphics",
    aiDescription: "High-contrast YouTube Shorts and TikTok thumbnail graphic overlay with warning border and safe-word icon."
  },
  {
    id: "asset-6",
    title: "Live Post: AI Phishing Detection (TikTok Reel)",
    type: "Published",
    duration: "00:36",
    size: "42 MB",
    tags: ["Published", "TikTok", "Analytics Linked", "Reel"],
    thumbnail: "https://images.unsplash.com/photo-1516321318423-f06f85e504b3?w=600&auto=format&fit=crop&q=80",
    dateAdded: "Sep 20, 2026",
    collection: "Published Media",
    aiDescription: "Published social asset with 240k views, 89% 3-second retention, and 14k saves."
  },
  {
    id: "asset-7",
    title: "Project Workspace: Autonomous Agent Sandbox Breach",
    type: "Project",
    duration: "00:45",
    size: "1.2 GB",
    tags: ["Project", "Timeline", "Draft", "Editing"],
    thumbnail: "https://images.unsplash.com/photo-1526374965328-7f61d4dc18c5?w=600&auto=format&fit=crop&q=80",
    dateAdded: "Oct 01, 2026",
    collection: "Active Projects",
    aiDescription: "Multi-track editor project bundle with captions, b-roll cues, and aspect ratio variants."
  }
];

export const mockAnalytics: AnalyticsData = {
  totalViews: "1.42M",
  viewsGrowth: "+24.8% vs last 30 days",
  watchTime: "24.6K Hours",
  avgRetention: "76.4%",
  engagementRate: "8.9%",
  topPerformingTopic: "AI Security & Deepfakes",
  insights: [
    {
      title: "Question Hooks generate +34% higher 3-second retention",
      description: "Videos starting with a high-stakes question ('If your mom calls you...') retain 88% of viewers past the 5-second mark.",
      impact: "High",
      action: "Use Question Hooks for all upcoming Cybersecurity topics."
    },
    {
      title: "Optimal video length shifted to 35–42 seconds",
      description: "Short-form clips in the 35–42s duration band get 2.4x more full-watches and saves compared to 60s+ videos.",
      impact: "High",
      action: "Trim intro setups by 4 seconds."
    },
    {
      title: "Audience Affinity for 'AI + Student Life' Gaps",
      description: "Your 18-24 student audience segment saved your Chrome extension video 14,000 times (highest save-rate this quarter).",
      impact: "Positive",
      action: "Create 2 more student-focused tech defense videos."
    }
  ],
  retentionCurve: [
    { timestamp: "0s", retention: 100 },
    { timestamp: "3s", retention: 92 },
    { timestamp: "10s", retention: 84 },
    { timestamp: "20s", retention: 79 },
    { timestamp: "30s", retention: 76 },
    { timestamp: "38s (End)", retention: 74 }
  ],
  platformDistribution: [
    { platform: "Instagram Reels", percentage: 48 },
    { platform: "YouTube Shorts", percentage: 34 },
    { platform: "TikTok", percentage: 12 },
    { platform: "LinkedIn", percentage: 6 }
  ]
};

export const mockIdeas: IdeaItem[] = [
  {
    id: "idea-1",
    topic: "AI Voice Scams & Safe-Word Defense",
    angle: "Emergency defense protocol with live voice clone sample",
    source: "Trend.Ai",
    potentialScore: 89,
    status: "In Progress",
    estimatedDuration: "35 sec"
  },
  {
    id: "idea-2",
    topic: "Prompt Injection in Auto-GPT Browser Agents",
    angle: "Live demonstration of hijacking an un-sandboxed browser agent",
    source: "Trend.Ai",
    potentialScore: 94,
    status: "Planned",
    estimatedDuration: "45 sec"
  },
  {
    id: "idea-3",
    topic: "College Campus Wi-Fi Session Hijacking",
    angle: "Why public cafe Wi-Fi is stealing student logins in 2026",
    source: "Content Gap",
    potentialScore: 86,
    status: "Idea",
    estimatedDuration: "30 sec"
  },
  {
    id: "idea-4",
    topic: "Fake AI Resume Builders Stealing Personal Data",
    angle: "Audience-requested review of viral free resume AI tools",
    source: "Audience Request",
    potentialScore: 82,
    status: "Idea",
    estimatedDuration: "40 sec"
  }
];
