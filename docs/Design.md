# VIDORA Design Specification

## Glassmorphic Tokens

- **Base Colors:** `#07080D` (Deep Void), `#0B0D14` (Atmospheric Dark Base)
- **Primary Accent:** Violet `#7C5CFF` & Indigo `#5B7CFF`
- **Supporting Accents:** Emerald `#10B981`, Cyan `#06B6D4`, Amber `#F59E0B`, Rose `#F43F5E`

## 4 Glass Levels

1. **L1 (Background Glass):** `background: rgba(15, 17, 26, 0.45)`, `backdrop-filter: blur(12px)`, `border: 1px solid rgba(255, 255, 255, 0.05)`
2. **L2 (Content Glass):** `background: rgba(20, 24, 38, 0.65)`, `backdrop-filter: blur(20px)`, `border: 1px solid rgba(255, 255, 255, 0.08)`
3. **L3 (Active Glass):** `background: rgba(28, 34, 54, 0.75)`, `backdrop-filter: blur(24px)`, `border: 1px solid rgba(255, 255, 255, 0.14)`, `shadow: 0 12px 40px rgba(0,0,0,0.45)`
4. **L4 (Modal / Floating Glass):** `background: rgba(18, 21, 33, 0.88)`, `backdrop-filter: blur(32px)`, `border: 1px solid rgba(255, 255, 255, 0.18)`, `shadow: 0 20px 60px rgba(0,0,0,0.6)`
