# Decisions

## [2026-02-06T20:05:44] Task 0: Environment Setup

(To be filled by subagents)

## [2026-02-07] Task 1: Light Theme Design System

### Color System
- **Backgrounds**: Moved to a tiered white/slate system.
  - Primary: `#ffffff` (Clean canvas)
  - Secondary: `#f8fafc` (Slate 50 - subtle contrast for sections)
  - Tertiary: `#f1f5f9` (Slate 100 - higher contrast for inputs/cards)
- **Accents**: Kept the brand identity but adjusted for light mode visibility.
  - Primary: `#0ea5e9` (Sky 500) - Vibrant on white.
  - Secondary: `#06b6d4` (Cyan 500) - Complementary cool tone.
- **Typography**:
  - Headings: `#1e293b` (Slate 800) - High contrast but softer than pure black.
  - Body: `#64748b` (Slate 500) - Readable, accessible gray.
- **Shadows**:
  - Implemented colored shadows (`--shadow-primary`) to give a modern, "glowing" feel even in light mode, consistent with the tech-forward brand.
  - Used standard slate shadows (`--shadow-sm`, `--shadow-md`) for depth.

### Typography
- Added a fluid typography scale using `clamp()` for responsive headings (`--h1` to `--h6`).
- Referenced `Inter` as primary font for clean, modern readability.

### Component States
- **Buttons**:
  - Primary: Gradient Sky->Cyan to maintain "high performance" feel.
  - Secondary: Outline style to reduce visual weight next to primary actions.
- **Terminal**:
  - **Decision**: Kept the terminal component DARK (`#1e293b`) even in light theme.
  - **Rationale**: Terminals are expected to be dark; this maintains semantic recognition and provides a nice visual anchor/contrast on the page.
