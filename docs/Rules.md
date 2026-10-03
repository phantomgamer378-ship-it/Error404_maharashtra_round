# VIDORA Development Rules

1. **Stack Strictness:** Next.js / Vite SPA, TypeScript (strict mode), Tailwind CSS, Framer Motion, Lucide React, Zod.
2. **Glassmorphic System:** 4 distinct glass levels (L1, L2, L3, L4) with separate opacity, blur, border, and inset shadow profiles.
3. **Data Abstraction:** All domain services must use defined interfaces with `source: "demo" | "live"` tag.
4. **Responsive Shell:** Sidebar on desktop (collapsible), bottom navbar on mobile (<768px).
5. **No Blind Code:** Every page skeleton must render clean EmptyState components when no data is available.
6. **Plan First:** Post architectural plan before coding phases.
