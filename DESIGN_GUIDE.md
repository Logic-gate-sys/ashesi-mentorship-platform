# Design Implementation Guide

## Color Palette

The design system uses a burgundy and pink color scheme implemented in Tailwind CSS.

### Primary Colors
```
Burgundy Palette:
- #923D41 (Primary - buttons, sidebar, brand color)
- #6A0A1D (Dark - text, headings)
- #B85459 (Light - hover states, subtle highlights)

Accent Colors:
- #FFB7B9 (Pink - interactive elements, chips, badges)
- #FF9094 (Dark Pink - hover states)
- #FFD3D5 (Light Pink - light backgrounds)

Backgrounds:
- #FFF8F7 (Chat background - light pink)
- #F8E3E3 (Impact background - soft pink)
- #FFFFFF (White - primary surfaces)

Text Colors:
- #6A0A1D (Primary text)
- #78716C (Secondary text - supporting copy)
- #A8A29E (Tertiary text - muted)

Borders & Shadows:
- #DDC0C0 (Subtle borders)
- rgba(146, 61, 65, 0.16) (Burgundy shadows)
```

## Component Specifications

### 1. Messages Tab Component

**Location**: `app/_components/dashboard/MessagesTab.tsx`

**Structure**:
```
MessagesTab
├── Header Section (Burgundy/Pink background)
│   ├── User Profile Avatar
│   ├── Name & Title
│   └── Action Buttons (Video, Phone, Mic)
├── Messages Area (#FFF8F7 background)
│   └── Message Bubbles
│       ├── User messages (Burgundy)
│       └── Other messages (White with opacity)
├── Message Input Section
│   ├── Input Field
│   └── Send Button (Burgundy)
└── Right Column: Impact Metrics (#F8E3E3)
    ├── Sessions Completed
    ├── Average Rating
    ├── Mentees Helped
    ├── Top Mentoring Areas (Pink chips)
    └── Inspirational Quote (Burgundy gradient)
```

**Usage**:
```tsx
<MessagesTab
  userName="Alex O."
  userTitle="Product Manager at Microsoft"
  userAvatar={avatarUrl}
  onSendMessage={handleMessage}
/>
```

### 2. Find Mentor Component

**Location**: `app/_components/dashboard/FindMentor.tsx`

**Structure**:
```
FindMentor
├── Header
├── Search & Filter Section
│   ├── Search Bar (Page background)
│   └── Specialty Filter Buttons
├── Mentors Grid (3 columns desktop, 2 tablet, 1 mobile)
│   └── Mentor Card
│       ├── Header (#F8E3E3 background)
│       │   ├── Avatar (Pink background)
│       │   ├── Name & Title
│       │   └── Company & Location
│       ├── Content Section
│       │   ├── Star Rating
│       │   ├── Bio
│       │   ├── Specialty Tags (Pink chips)
│       │   └── Availability & Mentees
│       └── Action Button (Burgundy)
```

**Usage**:
```tsx
<FindMentor />
```

### 3. Impact Metrics Component

**Location**: `app/_components/dashboard/ImpactMetrics.tsx`

**Structure**:
```
ImpactMetrics
├── Stats Section (#F8E3E3 background)
│   ├── Sessions Completed Card
│   ├── Average Rating Card
│   └── Mentees Helped Card
├── Growth Chart (Optional)
├── Mentoring Areas (Pink chips)
└── Motivational Quote (Burgundy gradient background)
```

**Usage**:
```tsx
<ImpactMetrics
  sessionsCompleted={12}
  averageRating={4.8}
  menteesHelped={8}
/>
```

## Pages Implemented

### 1. Mentor Messages Page
**Path**: `app/(dashboard)/mentor/messages/page.tsx`
- Left sidebar with mentors list
- Right panel with MessagesTab component
- Responsive: Stacks on mobile, side-by-side on desktop

### 2. Student Messages Page
**Path**: `app/(dashboard)/student/messages/page.tsx`
- Same layout as mentor messages
- Allows students to chat with mentors

### 3. Find Mentor Page
**Path**: `app/(dashboard)/student/find-mentor/page.tsx`
- Full mentor discovery interface
- Search and filtering capabilities

## Responsive Design

### Breakpoints
```
Mobile: < 768px
- Single column layout
- Full width components
- Bottom message input

Tablet: 768px - 1024px
- Two column grids
- Adjusted spacing

Desktop: > 1024px
- Three+ column grids
- Expanded sidebars
- Multi-column layouts
```

## Tailwind CSS Integration

All colors are defined in `tailwind.config.ts`:

```typescript
colors: {
  primary: {
    DEFAULT: '#923D41',      // Uses as bg-primary
    dark: '#6A0A1D',         // Uses as bg-primary-dark
    light: '#B85459',        // Uses as bg-primary-light
  },
  accent: {
    DEFAULT: '#FFB7B9',      // Uses as bg-accent
    dark: '#FF9094',         // Uses as bg-accent-dark
    light: '#FFD3D5',        // Uses as bg-accent-light
  },
  'chat-bg': '#FFF8F7',      // Uses as bg-chat-bg
  'impact-bg': '#F8E3E3',    // Uses as bg-impact-bg
  text: {
    DEFAULT: '#6A0A1D',      // Uses as text-text
    secondary: '#78716C',    // Uses as text-text-secondary
  },
  sidebar: '#923D41',        // Uses as bg-sidebar
  border: '#DDC0C0',         // Uses as border-border
}
```

## Component Usage Examples

### Basic Chat Interface
```tsx
import { MessagesTab } from '@/app/_components/dashboard';

export default function ChatPage() {
  return (
    <MessagesTab
      userName="Sarah B."
      userTitle="Engineering Lead"
      onSendMessage={(msg) => console.log(msg)}
    />
  );
}
```

### Mentor Discovery
```tsx
import { FindMentor } from '@/app/_components/dashboard';

export default function MentorSearch() {
  return <FindMentor />;
}
```

### Metrics Dashboard
```tsx
import { ImpactMetrics } from '@/app/_components/dashboard';

export default function Dashboard() {
  return <ImpactMetrics sessionsCompleted={15} />;
}
```

## Styling Examples

### Burgundy Buttons
```tsx
<button className="bg-primary hover:bg-primary-dark text-white px-4 py-2 rounded-lg">
  Send Request
</button>
```

### Pink Chips/Badges
```tsx
<span className="bg-accent text-white px-3 py-1 rounded-full text-sm">
  Career Growth
</span>
```

### Impact Cards
```tsx
<div className="bg-impact-bg border border-border rounded-lg p-6">
  <h3 className="text-text font-semibold">Sessions Completed</h3>
  <p className="text-3xl font-bold text-primary mt-2">12</p>
</div>
```

### Chat Messages
```tsx
{/* User message - Burgundy */}
<div className="bg-primary text-white rounded-lg px-4 py-2">
  Your message here
</div>

{/* Other message - Light */}
<div className="bg-white bg-opacity-40 text-text rounded-lg px-4 py-2">
  Their message here
</div>
```

## Performance Considerations

1. **Component Composition**: Components are split for better tree-shaking
2. **Lazy Loading**: List items rendered efficiently with React
3. **Responsive Images**: Avatar images use Next.js Image optimization
4. **Tailwind CSS**: Uses utility classes for minimal CSS output
5. **TypeScript**: Full type safety prevents runtime errors

## Accessibility Features

1. **Contrast Ratios**: All text meets WCAG AA standards
2. **Focus States**: Input fields have clear focus indicators
3. **Icon Labels**: Buttons have titles for screen readers
4. **Semantic HTML**: Proper heading hierarchy used
5. **Color Not Alone**: Don't rely on color to convey information

## Browser Support

All components use modern CSS features:
- CSS Grid and Flexbox
- CSS Variables (through Tailwind)
- Modern JavaScript (ES2020+)
- Supports all modern browsers (Chrome, Firefox, Safari, Edge)

## Future Enhancements

1. **Animation**: Add smooth transitions and animations
2. **Real-time Features**: WebSocket integration for live messaging
3. **Infinite Scroll**: For message history and mentor lists
4. **Caching**: Implement message and mentor data caching
5. **Offline Support**: Service worker for offline messaging
6. **Push Notifications**: Real-time notification support
