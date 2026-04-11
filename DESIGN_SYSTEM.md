# Mentor App Design System

## Overview
Complete design system for the Mentor App dashboard, extracted from SVG design files. This documents the visual hierarchy, color palette, typography, components, and layout patterns.

---

## Color Palette

### Brand Colors
| Name | Hex | Usage |
|------|-----|-------|
| Primary Burgundy | #923D41 | Sidebar background, primary UI elements |
| Dark Burgundy | #6A0A1D | Text, headings, accents |
| Light Burgundy | #4A0A0A | Hover states, active items |

### Backgrounds & Neutrals
| Name | Hex | Usage |
|------|-----|-------|
| Chat Background | #FFF8F7 | Main content area (slightly warm) |
| Impact Card BG | #F8E3E3 | Secondary container backgrounds |
| Light Pink Accent | #FFB7B9 | Mentoring area chips |
| Lighter Pink | #FFB0B0 | Alternative accent |
| Light Gray | #EFE2E2 | Subtle backgrounds |
| UI Gray | #A8A29E | Icons, disabled states |
| Text Gray | #78716C | Secondary text, labels |
| White | #ffffff | Primary backgrounds, text |

---

## Layout Structure

### Sidebar (240px width)
- **Background:** #923D41 (Burgundy)
- **Content:** Fixed navigation menu
- **Height:** Full viewport height (982px)
- **Components:**
  - Logo container (100px height, rounded 12px)
  - Navigation icons and labels
  - Menu items with hover states (#4A0A0A)
  - User profile section (bottom)
  - Logout button (with icon)

### Navigation Items
1. Home
2. My Profile
3. Find a Mentor
4. My Requests
5. Messages (active state: #4A0A0A background)
6. Meetings
7. Feedback

### Main Content Area
- **Width:** 1271px (full width minus sidebar)
- **Background:** #FFF8F7 or #F1F1F1 depending on tab
- **Layout:** Full height responsive

### Chat Interface (Messages Tab)
- **Header Height:** 96px (white with slight opacity)
- **User Profile Section:**
  - Avatar image (60x48px)
  - User name: "Alex O."
  - Title: "Product Manager at Microsoft"
- **Chat Area:** #FFF8F7 background
- **Message Display:** Organized conversation thread
- **Right Column:** #EFE2E2 background (468px width) - metrics/impact display

---

## Typography

### Heading Styles
- **Heading 4 (User Names):** 14-16px font size
- **Chat Headers:** Larger display text
- **Body Text:** 14px standard
- **Labels:** 12-13px small text
- **Timestamps:** 11px extra small

### Font Weights
- Regular: 400
- Medium: 500
- Bold: 700

### Color Assignments
- **Primary Headings:** #6A0A1D (dark burgundy)
- **Body Text:** #78716C (gray)
- **Disabled/Secondary:** #A8A29E

---

## Components

### Buttons & Interactive Elements
- **Call Button:** Circle icon in header
- **Video Call Button:** Icon button
- **Phone Button:** Icon button
- **Mute Button:** Icon button
- **Message Input:** Text field at bottom

### Cards
- **Impact Stats Card:**
  - Background: #F8E3E3
  - Border: #DDC0C0 (30% opacity)
  - Dimensions: 427x343px
  - Rounded corners

- **Mentoring Area Chips:**
  - Background: #FFB7B9
  - Padding: 8px 12px
  - Border radius: 20px
  - Inline display

### Icons
Navigation icons (all white, 24px typical):
- Home icon
- Profile icon
- Search icon
- Chat icon (active state highlighted)
- Calendar icon
- Notes icon
- Logout icon

---

## Tab Views

### Messages Tab
- **Purpose:** Chat/messaging interface
- **Main Content:** Conversation thread
- **Right Column:** Shows user metrics and impact statistics
- **Header:** User profile with status

### Find a Mentor Tab
- **Purpose:** Mentor discovery and matching
- **Layout:** Grid or list of mentor profiles
- **Filters:** Available for filtering mentors

### My Profile Tab
- **Purpose:** User profile management
- **Content:** Profile information, avatar, bio

### My Requests Tab
- **Purpose:** View mentorship requests
- **Content:** List of active requests with status

### Meetings Tab
- **Purpose:** Schedule and view meetings
- **Content:** Calendar-like interface

### Feedback Tab
- **Purpose:** View/provide feedback
- **Content:** Feedback history and forms

---

## Spacing & Layout Units

### Sidebar
- Top padding: 0px
- Item height: 47px (for selected item)
- Icon size: 24x24px
- Text size variations: 14px, 16px

### Main Content
- Header height: 96px
- Chat message padding: 16px
- Card spacing: 16px margin
- Icon spacing: 8-12px gaps

---

## Interactive States

### Navigation Items
- **Default:** White text on burgundy
- **Hover:** Lighter background transition
- **Active:** #4A0A0A background with rounded corners (23.5px radius)
- **Disabled:** Gray (#A8A29E)

### Buttons
- **Default:** Solid color background
- **Hover:** Darker shade
- **Active:** Highlighted with shadow or accent
- **Disabled:** Reduced opacity

---

## Responsive Breakpoints

**Desktop (1512px+)**
- Full sidebar + main content visible
- Chat with right column metrics
- All navigation visible

**Tablet (responsive adjustments)**
- Sidebar might collapse
- Right column may stack below
- Touch-friendly spacing increased

**Mobile (responsive adjustments)**
- Sidebar collapses to icon-only or hamburger
- Full-width main content
- Stacked layout for metrics

---

## Implementation Notes

### SVG Structure
- Uses clip-path for rounded corners
- Pattern fills for images/avatars
- Hierarchical grouping with `<g>` elements
- Transform attributes for positioning

### CSS Variables Recommended
```css
--primary-burgundy: #923D41;
--dark-burgundy: #6A0A1D;
--light-burgundy: #4A0A0A;
--chat-bg: #FFF8F7;
--impact-card-bg: #F8E3E3;
--accent-pink: #FFB7B9;
--text-primary: #6A0A1D;
--text-secondary: #78716C;
--ui-gray: #A8A29E;
--sidebar-width: 240px;
--header-height: 96px;
--chat-header-height: 96px;
```

### Media Queries
- Consider breakpoints at 768px (tablet), 1024px (desktop)
- Ensure touch targets minimum 44x44px on mobile
- Maintain color contrast ratios for accessibility

---

## Design Tokens Summary

| Token | Value | Context |
|-------|-------|---------|
| Primary Color | #923D41 | Brand burgundy |
| Accent Color | #FFB7B9 | Interactive elements |
| Text Color | #6A0A1D | Primary text |
| Background | #FFF8F7 | Main surfaces |
| Border Color | #DDC0C0 | Subtle dividers |
| Border Radius | 12px, 20px, 23.5px | Components |
| Sidebar Width | 240px | Fixed layout |
| Shadow (light) | rgba(0,0,0,0.3) | Cards, depth |

---

## Next Steps for Implementation

1. **Extract to React Components:**
   - Sidebar navigation component
   - Message card component
   - User profile header component
   - Impact metrics card component
   - Mentoring area chip component

2. **Create CSS/Tailwind Classes:**
   - Color utilities for burgundy palette
   - Spacing scale matching design
   - Typography styles
   - Component-specific styles

3. **Build Interactive Features:**
   - Tab switching logic
   - Message sending functionality
   - User profile display
   - Dynamic metric updates

4. **Accessibility Improvements:**
   - ARIA labels for navigation
   - Keyboard navigation support
   - Color contrast verification
   - Screen reader testing

5. **Responsive Design:**
   - Mobile-first approach
   - Breakpoint strategies
   - Touch-friendly interactions
   - Flexible layouts
