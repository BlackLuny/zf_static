# Learnings

## [2026-02-06T20:05:44] Task 0: Environment Setup

(To be filled by subagents)
### Playwright Initialization (2026-02-07)
- Successfully initialized npm and installed Playwright with Chromium.
- Configured `playwright.config.js` for testing local HTML files using `file://` protocol.
- Created an example test suite in `tests/example.spec.js` that verifies `index.html`.
- Verified that tests run and pass using `npx playwright test`.


## Homepage Redesign (Task 2)
- **Playwright Testing**: Tests with `file://` protocol work reliably for static sites. Context permissions (`clipboard-read`, `clipboard-write`) are necessary for verifying copy functionality in headless mode.
- **Visual Design**: Alternating background colors (`bg-primary` and `bg-secondary`) significantly improves visual separation between sections (Hero -> Features -> Docs -> Install).
- **Light Theme**: Shadow variables (`--shadow-md`) are crucial for creating depth in light mode, especially for cards on white backgrounds.

## Task 4: Content Sections Implementation
- Added Pricing, Testimonials, FAQ, and Community sections.
- Maintained design system using `--bg-primary` and `--bg-secondary` variables.
- Implemented FAQ accordion with exclusive expansion (one open at a time) for better UX.
- Verified all sections and interactions with Playwright.
- Note: User requested alternating backgrounds, but specific instructions resulted in Features (Primary) -> Pricing (Primary) -> Testimonials (Secondary) -> FAQ (Primary) -> Community (Secondary). Followed specific color instructions over general "alternate" directive.

## Task 5: Documentation Redesign (Light Theme)
- **Theme Consistency**: Switched `docs.html` to use the same light theme variables (`--bg-primary: #ffffff`, `--accent-primary: #0ea5e9`) as `index.html`.
- **PrismJS**: Switched from `prism-tomorrow` (dark) to `prism-vs` (light) for code syntax highlighting.
- **Mobile Navigation**: 
  - Integrated the main site hamburger menu into `docs.html`.
  - Added a dedicated "Docs Menu" button (`#sidebar-toggle`) visible only on mobile to toggle the documentation sidebar.
  - Updated `docs-script.js` to manage both toggles independently.
- **CSS Specificity**: Encountered an issue where `display: none` on the sidebar toggle wasn't being overridden by the media query because the `display: flex` rule was missing inside the `@media` block. Fixed by explicitly adding it.
