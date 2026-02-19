# Architectural Decisions

## [2026-02-07] Initial Setup

### Color System
- **Background**: `#ffffff` (white) / `#f8fafc` (light gray)
- **Text**: `#1e293b` (dark gray) / `#64748b` (secondary)
- **Accent**: `#0ea5e9` (sky blue) / `#06b6d4` (cyan)
- **Shadows**: Colored glows for depth

### Layout Strategy
- Alternating section backgrounds for visual separation
- Terminal component stays dark (thematic anchor)
- FAQ uses exclusive accordion (one answer visible)

### Testing Strategy
- Playwright for E2E testing
- 15 tests covering: navigation, mobile menu, responsive layouts, docs search
- Screenshot evidence stored in `.sisyphus/evidence/`
