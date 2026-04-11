# Visual Component Layout Guide

## Messages Tab Component Layout

```
┌─────────────────────────────────────────────────────────────────────────────┐
│ MESSAGES TAB (Responsive: 1 col mobile, 4 col desktop layout)               │
├─────────────────────────────────────────────────────────────────────────────┤
│                                                                               │
│  ┌────────────────────────────────────────┬──────────────────────────────┐  │
│  │  CHAT HEADER                           │  RIGHT COLUMN                │  │
│  │  ─────────────────────────────────────  │  (Impact Background)         │  │
│  │                                         │  ──────────────────────────   │  │
│  │  👤 Alex O.                 [📹📞🎤]  │  Your Impact                  │  │
│  │     Product Manager at Microsoft        │                               │  │
│  │                                         │  ┌─────────────┐             │  │
│  │  (Chat BG #FFF8F7)                      │  │  12 ✓       │ Sessions   │  │
│  │  ───────────────────────────────────    │  │  4.8 ⭐     │ Rating     │  │
│  │                                         │  │  8  👥      │ Mentees    │  │
│  │  Me:                                    │  └─────────────┘             │  │
│  │  ┌──────────────────────────────────┐  │                               │  │
│  │  │ Hey, how are you doing today?    │  │  Top Mentoring Areas         │  │
│  │  │ 2:45 PM                          │  │  ┌─────────────────────────┐  │  │
│  │  └──────────────────────────────────┘  │  │ Career Growth    📌     │  │  │
│  │                               (Burgundy│ │ Technical Skills 📌     │  │  │
│  │                                        │  │ Leadership       📌     │  │  │
│  │  Them:                                 │  │ Communication    📌     │  │  │
│  │  ┌──────────────────────────────────┐  │  └─────────────────────────┘  │
│  │  │ Great! How can I help you?       │  │                               │  │
│  │  │ 2:46 PM                          │  │  ┌─────────────────────────┐  │  │
│  │  └──────────────────────────────────┘  │  │ "The best way to      │  │  │
│  │  (White bg with opacity)                │  │  predict the future   │  │  │
│  │                                         │  │  is to invent it."    │  │  │
│  │  ┌─────────────────────────────────┐   │  │  — Alan Kay           │  │  │
│  │  │ Type message...         [📤]    │   │  └─────────────────────────┘  │
│  │  └─────────────────────────────────┘   │  (Burgundy gradient bg)       │  │
│  │  (Input: Page background)               │                               │  │
│  │                                         │                               │  │
│  └────────────────────────────────────────┴──────────────────────────────┘  │
└─────────────────────────────────────────────────────────────────────────────┘
```

## Mentor Discovery Card Component

```
┌─────────────────────────────────┐
│  MENTOR CARD (3 per row)        │
├─────────────────────────────────┤
│ ┌─────────────────────────────┐ │
│ │ Header (#F8E3E3)            │ │
│ │ ┌────────────────────────┐  │ │
│ │ │ Alex O.            👤🎯│ │ │ (Pink bg)
│ │ │ Product Manager         │  │ │
│ │ │ Microsoft               │  │ │
│ │ │ San Francisco, CA       │  │ │
│ │ └────────────────────────┘  │ │
│ ├─────────────────────────────┤ │
│ │ Content                     │ │
│ │                             │ │
│ │ ⭐⭐⭐⭐⭐ 4.9 (47 reviews) │ │
│ │                             │ │
│ │ Experienced PM with 8+ years│ │
│ │ in tech. Passionate about...│ │
│ │                             │ │
│ │ 📌 Career Growth            │ │ (Pink chips)
│ │ 📌 Product Strategy         │ │
│ │ +1 more                     │ │
│ │                             │ │
│ │ ⏱️ 2-3 hours/week  👥 4/5  │ │
│ ├─────────────────────────────┤ │
│ │ [Send Request]              │ │ (Burgundy button)
│ └─────────────────────────────┘ │
└─────────────────────────────────┘
```

## Impact Metrics Component

```
┌────────────────────────────────────────────────────────────────┐
│  IMPACT METRICS (#F8E3E3 Background)                           │
├────────────────────────────────────────────────────────────────┤
│                                                                 │
│  Your Impact Stats                                             │
│                                                                 │
│  ┌──────────────────┐  ┌──────────────────┐  ┌──────────────┐ │
│  │  12              │  │  4.8             │  │  8           │ │
│  │  Sessions        │  │  Average Rating  │  │  Mentees     │ │
│  │  +2 this month   │  │  +0.1 this month │  │  +1 new      │ │
│  └──────────────────┘  └──────────────────┘  └──────────────┘ │
│  (Burgundy text)        (Burgundy text)       (Burgundy text) │
│                                                                 │
├────────────────────────────────────────────────────────────────┤
│  Growth Over Time (Optional Chart)                             │
│  [Bar chart showing sessions/month]                            │
├────────────────────────────────────────────────────────────────┤
│  Top Mentoring Areas                                           │
│                                                                 │
│  📌 Career Growth  📌 Technical Skills  📌 Leadership          │ │
│  (Pink chips)                                                   │
├────────────────────────────────────────────────────────────────┤
│  ┌──────────────────────────────────────────────────────────┐ │
│  │ "The best way to predict the future is to invent it."   │ │
│  │                          — Alan Kay                      │ │
│  │ (Burgundy gradient background #923D41 → #B85459)        │ │
│  └──────────────────────────────────────────────────────────┘ │
└────────────────────────────────────────────────────────────────┘
```

## Page Layout: Messages Page

```
┌──────────────────────────────────────────────────────────────────────┐
│  DASHBOARD SIDEBAR (Burgundy bg)                                     │
├──────────────────────────────────────────────────────────────────────┤
│  ├─ Dashboard                                                        │
│  ├─ Messages (current)                                              │
│  ├─ Find Mentor                                                     │
│  └─ Profile                                                         │
│                                                                      │
│  ┌────────────────────────────────────────────────────────────────┐ │
│  │  MENTORS LIST              MAIN CHAT AREA                      │ │
│  │  ┌──────────────────────┐  ┌────────────────────────────────┐ │ │
│  │  │ Messages             │  │  MessagesTab Component         │ │ │
│  │  │                      │  │                                │ │ │
│  │  │ 👤 Alex O.          │  │  (Full chat interface with    │ │ │
│  │  │ PM at Microsoft      │  │   Impact metrics on right)    │ │ │
│  │  │                      │  │                                │ │ │
│  │  │ 👤 Sarah M.         │  │                                │ │ │
│  │  │ Eng at Google        │  │                                │ │ │
│  │  │                      │  │                                │ │ │
│  │  │ 👤 James R.         │  │                                │ │ │
│  │  │ Founder TechStart    │  │                                │ │ │
│  │  └──────────────────────┘  └────────────────────────────────┘ │ │
│  └────────────────────────────────────────────────────────────────┘ │
└──────────────────────────────────────────────────────────────────────┘

Mobile Layout (Stacked):
┌──────────────────────────────────────┐
│ MENTORS LIST (Scrollable)            │
│ ┌────────────────────────────────┐  │
│ │ 👤 Alex O. Product Manager     │  │
│ └────────────────────────────────┘  │
│ ┌────────────────────────────────┐  │
│ │ 👤 Sarah M. Senior Engineer    │  │
│ └────────────────────────────────┘  │
└──────────────────────────────────────┘
┌──────────────────────────────────────┐
│ MESSAGES TAB (Full width)            │
│ [Chat interface stacked vertically]  │
└──────────────────────────────────────┘
```

## Find Mentor Page Layout

```
┌────────────────────────────────────────────────────────────────┐
│  Find Your Mentor                                              │
│  Connect with experienced professionals...                    │
│                                                                │
│  ┌──────────────────────────────────────────────────────────┐ │
│  │ Search & Filter Panel                                    │ │
│  │                                                           │ │
│  │ 🔍 Search by name, title, or company...                 │ │
│  │                                                           │ │
│  │ Filter by Specialty                                      │ │
│  │ [All] [Career Growth] [Technical] [Leadership] [Biz Dev]│ │
│  └──────────────────────────────────────────────────────────┘ │
│                                                                │
│  ┌─────────────────────┐  ┌─────────────────────┐            │
│  │  MENTOR CARD 1      │  │  MENTOR CARD 2      │            │
│  │  (See above)        │  │  (See above)        │  ...       │
│  └─────────────────────┘  └─────────────────────┘            │
│                                                                │
│  ┌─────────────────────┐  ┌─────────────────────┐            │
│  │  MENTOR CARD 3      │  │  MENTOR CARD 4      │            │
│  │  (See above)        │  │  (See above)        │            │
│  └─────────────────────┘  └─────────────────────┘            │
└────────────────────────────────────────────────────────────────┘
```

## Color Usage Examples

```
BURGUNDY (#923D41) - Primary Brand Color
├─ Sidebar background
├─ Button backgrounds
├─ Default text color
├─ Primary headings
└─ Gradient backgrounds

DARK BURGUNDY (#6A0A1D) - Text & Emphasis  
├─ Main text color
├─ Card headings
└─ Strong emphasis

ACCENT PINK (#FFB7B9) - Interactive Elements
├─ Chips/badges
├─ Active states
├─ Icons
└─ Highlights

BACKGROUNDS
├─ Chat (#FFF8F7) - Light pink message area
├─ Impact (#F8E3E3) - Soft pink metric cards
├─ Card (#FFFFFF) - White surfaces
└─ Page (#FFF8F7) - Light backgrounds

BORDERS (#DDC0C0) - Subtle Separators
└─ Card borders, dividers, outlines
```

## Responsive States

```
Mobile (< 768px)
├─ Single column layouts
├─ Full-width cards
├─ Stacked sidebars
└─ Bottom-aligned inputs

Tablet (768px - 1024px)
├─ Two column grids
├─ Adjusted padding
├─ Side-by-side components
└─ Compact sidebars (visible/hidden toggle)

Desktop (> 1024px)
├─ Three+ column grids
├─ Full sidebars visible
├─ Expanded components
└─ Multi-pane layouts
```

## Interactive States

```
Buttons
├─ Default: bg-primary text-white
├─ Hover: bg-primary-dark
└─ Disabled: bg-text-muted

Input Fields
├─ Default: bg-page border-border
├─ Focus: border-primary ring-primary
└─ Error: border-danger ring-danger

Chips/Badges
├─ Default: bg-accent text-white
└─ Hover: bg-accent-dark

Cards
├─ Default: border-border bg-white
├─ Hover: shadow-primary
└─ Active: bg-impact-bg border-primary
```
