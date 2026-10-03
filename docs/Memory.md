# CreatorAi System Memory

## Technical Stack
- Framework: React 18 / Vite SPA + TypeScript (strict mode)
- Styling: Tailwind CSS + 4-tier Glassmorphism CSS Variables (`glass-panel-l1` to `l4`)
- UI Primitives: GlassCard, GlassPanel, ScoreRing, Sparkline, AIThinking, DemoDataBadge, Drawer, Modal
- Motion: Framer Motion
- Icons: Lucide React
- Validation: Zod (added in Phase 7 for EditorAIService response schema)

## Status Table
| Phase | Feature | Status | Notes |
|---|---|---|---|
| Phase 0 | App Shell & Glass System | ✅ Completed | 4-tier glassmorphism, responsive navigation shell, DemoWalkthroughBar |
| Phase 1 | Dashboard & Creator DNA | ✅ Completed | Today's Creator Signal, Sarth DNA (Cybersecurity + AI), Onboarding |
| Phase 2 | Trend.Ai Intelligence Layer | ✅ Completed | Interpretable scoring engine, Trend Radar network, Trajectory chart, Why Now progressive disclosure, Content Gaps |
| Phase 3 | Opportunity to Create & Script Generation | ✅ Completed | + Create command palette (Cmd+K), split ContentGenerationView (3 hook styles, editable script blocks, AI reasoning panel), ContentService with DNA calibration |
| Phase 4 | Asset Library | ✅ Completed | 7 asset tabs, AI semantic search over transcripts, source-to-derived links, empty state |
| Phase 5 | Raw Footage Intelligence & Clip Extraction | ✅ Completed | Multi-stage processing pipeline (Whisper + Semantic), 45-min prepared sample, script alignment, 9:16 clip generation |
| Phase 6 | Video Studio Editor | ✅ Completed | HTML5 video sync, 9:16 safe area overlay, multi-track timeline, trim/split/delete, immutable operation history (Undo/Redo), adaptive properties & AI assistant |
| Phase 7 | AI Editing Copilot | ✅ Completed | PersistentCommandBar (7 chip commands), ContextualFloatingToolbar on selected overlays, EditorAIService (8 handlers, Zod validation, error fallback, scoped enforcement), inline AIThinking state, emerald diff highlight, AI Changes Log in PropertiesPanel with per-op undo buttons, before/after BEFORE→AFTER chips, unified history stack |
| Phase 8 | Multi-Platform Adaptation | ✅ Completed | RepurposeService (genuine platform rewriting, tone/hook/duration/CTA/aspect-ratio calibration via Creator DNA), PlatformAdaptationDrawer (split source vs target variants, 5 platforms: Instagram Reel, YouTube Short, LinkedIn post, X thread, TikTok; content tree visualization, editable inline, platform safe-zones) |
| Phase 9 | What-If / Variant Engine | ✅ Completed | WhatIfVariantEngine modal: 3 hook alternatives (A/B/C) compared side-by-side with simulated signal indicators (estimated reach, retention curve shape, audience fit, with honest 'Estimated' badges), DNA influence reasoning, one-click apply into editor |
| Phase 10 | Analytics & Continuous Learning Loop | ✅ Completed | LearningService (deterministic mathematical comparisons on retention, saves, shares, CTR across hook types and durations; plain-language CreatorInsights), AnalyticsView (5-stage visual learning loop progression, interactive retention curve SVG comparing Question vs Declarative hooks, metrics grid with sparklines, published clips dataset table), CreatorContext loop integration (import performance dataset, step-by-step state machine, automated DNA calibration), global Toast alerts, CreatorDnaView live calibration banner and highlighted hook cards, OpportunityEngine re-ranking with '⚡ Updated from your latest performance' badges and +15pt learned Creator Fit boost |
| Phase 11 | Visual & Interaction Polish Across App | ✅ Completed | 8pt rhythm audit, tabular numerals for all metrics/timers, 4-tier glassmorphism consistency (L1 to L4), WCAG AA high-contrast text, hover-elevate on cards, chart-line-reveal, safe-area insets (pb-safe/pt-safe), prefers-reduced-motion support, unified EmptyState primitives across Ideas, Projects & Asset Library with clear CTAs, mobile/tablet responsive editor mode switcher (Canvas/Inspector/Tools) and collapsible drawer navigation, 13-step DemoWalkthroughBar covering the complete end-to-end OS pipeline |

## Key File Locations
- Scoring Engine: `src/lib/scoring/` (`weights.config.ts`, `scoringEngine.ts`, `types.ts`)
- Opportunity Engine: `src/features/opportunity-engine/` (`OpportunityEngine.ts`, `TrendService.ts`, `types.ts`)
- Content Generation Service: `src/lib/services/ContentService.ts`
- Raw Footage Service: `src/lib/services/FootageService.ts`
- Editor AI Service: `src/lib/services/EditorAIService.ts` (Zod-validated, 8 command handlers, scoped editing Rule 5)
- Repurpose & Variant Service: `src/lib/services/RepurposeService.ts` (Platform adaptation, What-If variants, Content tree)
- Learning & Performance Service: `src/lib/services/LearningService.ts` (Phase 10: deterministic math, plain-language insights, DNA calibration)
- Editor State & Reducer: `src/features/editor/` (`types.ts`, `defaultState.ts`, `useEditorReducer.ts`)
- Creator Store / Context: `src/context/CreatorContext.tsx`
- Trend.Ai UI: `src/components/trend/` (`TrendAiView.tsx`, `TrendRadar.tsx`, `OpportunityCard.tsx`, `WhyNowPanel.tsx`, `TrendTrajectoryChart.tsx`, `ContentGapSection.tsx`, `TrendFilterBar.tsx`)
- Content Generation UI: `src/components/create/` (`ContentGenerationView.tsx`, `CreateModal.tsx`)
- Raw Footage UI: `src/components/footage/RawFootageAnalysisView.tsx`
- Video Editor UI: `src/components/editor/` (`MainEditorView.tsx`, `EditorTopBar.tsx`, `VideoPreview.tsx`, `Timeline.tsx`, `PropertiesPanel.tsx`, `LeftToolsPanel.tsx`, `PersistentCommandBar.tsx`, `ContextualFloatingToolbar.tsx`)
- Platform & Variant UI: `src/components/platform/` (`PlatformAdaptationDrawer.tsx`, `WhatIfVariantEngine.tsx`)
- Analytics & Learning Loop UI: `src/components/analytics/AnalyticsView.tsx`
- Creator DNA UI: `src/components/dna/CreatorDnaView.tsx`
- Asset Library UI: `src/components/assets/AssetLibraryView.tsx`
- UI Primitives: `src/components/ui/` (`AIThinking.tsx`, `ScoreRing.tsx`, `Sparkline.tsx`, `DemoDataBadge.tsx`)

