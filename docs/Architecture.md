# VIDORA Architecture Specification

## 1. Directory Structure

```
app/
  (routes)/
    page.tsx (Dashboard)
    trend-ai/page.tsx
    ideas/page.tsx
    create/page.tsx
    projects/page.tsx
    assets/page.tsx
    analytics/page.tsx
    creator-dna/page.tsx
    design-system/page.tsx
  layout.tsx
  globals.css
components/
  ui/
    GlassCard.tsx
    GlassPanel.tsx
    Button.tsx
    Badge.tsx
    Tag.tsx
    Tooltip.tsx
    Dialog.tsx
    Drawer.tsx
    Tabs.tsx
    Progress.tsx
    ScoreRing.tsx
    Sparkline.tsx
    Skeleton.tsx
    EmptyState.tsx
    AIThinking.tsx
    DemoDataBadge.tsx
  layout/
    Sidebar.tsx
    TopBar.tsx
    BottomNav.tsx
    AppShell.tsx
features/
  trend/
  editor/
  dna/
  analytics/
lib/
  services/
    TrendService.ts
    OpportunityService.ts
    CreatorService.ts
    ContentService.ts
    FootageService.ts
    EditorAIService.ts
    AnalyticsService.ts
data/
  demo/
    creator.ts
    trends.ts
    projects.ts
    assets.ts
    analytics.ts
hooks/
  useGlassTheme.ts
  useCreatorDNA.ts
types/
  index.ts
```

## 2. Domain Types (Section 6)

- `CreatorProfile`: name, avatar, niche, audience, tone, languages, preferredFormats, hookStyle, visualStyle, bestTopics, averageDuration, source: 'demo' | 'live'
- `TrendOpportunity`: id, topic, category, opportunityScore, trendVelocity, audienceFit, creatorFit, competition, trendDirection, saturationLevel, summary, whyNowReasoning, trajectory, contentGap, source: 'demo' | 'live'
- `ProjectItem`: id, title, niche, status, updatedAt, duration, thumbnail, hookText, scriptText, opportunityScore, keyMoments, platformVariants, contentVariants, source: 'demo' | 'live'
- `AssetItem`: id, title, type, duration, size, tags, thumbnail, dateAdded, aiDescription, source: 'demo' | 'live'
- `AnalyticsData`: totalViews, viewsGrowth, watchTime, avgRetention, engagementRate, topPerformingTopic, insights, retentionCurve, platformDistribution, source: 'demo' | 'live'
