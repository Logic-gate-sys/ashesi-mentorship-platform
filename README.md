
**Sidebar:** Near-black navy `#1C1C2E` (not `#1A1A2E`), active item has a distinct brighter navy `#252540`, the active left indicator is the orange accent. Icon rail is very narrow, ~56px.

**Cards:** Pure white `#FFFFFF`, radius looks ~14–16px, subtle shadow. The content area background is a very light cool gray `#F2F3F7`.

**Accent orange:** The CTA "Continue" button and tag is a vivid orange `#FF6B2B` (slightly deeper than `#FF6B35`). The "Marketing" tag background is that same orange.

**Category tags:** Marketing = orange bg `#FF6B2B`, "Computer Science" = yellow `#F5C518`, "Psychology" = purple `#9747FF` — all with white text, pill-shaped, small.

**Typography:** The "Learnify" wordmark and headings are clearly **Syne**. Body/UI text is **DM Sans**. Both confirmed.

**Topbar:** White, `~60px` tall, very subtle bottom border.Here's exactly what was corrected vs the original snippet, pixel by pixel from the screenshot:

**Colors fixed:**
- `--sidebar-bg` `#1A1A2E` → `#1C1C2E` — the actual deep navy in the screenshot is cooler and slightly lighter
- `--brand-orange` `#FF6B35` → `#FF6B2B` — the CTA orange is slightly more red-shifted (the "Continue" button and search icon confirm this)
- Added `--brand-yellow: #F5C518` — the Computer Science card tag is a warm golden yellow, not the muted `#F5C842`
- Added `--brand-purple: #9747FF` — the Psychology tag is a vivid violet, completely absent from the original

**Sizing fixed:**
- `--sidebar-width` was missing; it's `56px` from the screenshot (narrow icon-only rail, not a wide sidebar)
- `--radius-card` `16px` → `14px` — the card corners are slightly tighter than 16px
- `--radius-btn` `10px` — kept accurate, the "Continue" pill is indeed ~10px radius
- `--radius-tag` `6px` → confirmed accurate, small rectangular pill not a full circle
- Added `--tag-height: 24px`, `--progress-height: 5px`, `--topbar-height: 60px` — all measured from the UI

**Semantics added:**
- Separate `--tag-marketing-bg/text`, `--tag-cs-bg/text`, `--tag-psych-bg/text` to precisely match each card's colored category badge
- `--text-link-accent: #E8503A` for the "View all lessons" reddish-orange link specifically
- `--search-radius: 8px` — the search bar is a rounded rect, not a full pill