# Dashboard Design Guide
## Mentee (Student) & Mentor (Alumni) Dashboard Specifications

Based on the Ashesi Mentorship Platform architecture, custom Maroon theme (#923D41, #7B1427), and user workflows.

---

## Student/Mentee Dashboard

### Overview & Layout
- **Route**: `/dashboard/student`
- **Main Purpose**: Central hub for managing mentorship journey, tracking requests, sessions, and mentor relationships
- **Layout**: 3-column responsive grid (sidebar navigation | main content | sidebar widgets)

### Section 1: Header & Welcome
```
┌─────────────────────────────────────────────────────────────┐
│ Welcome back, [FirstName]! 👋                               │
│ [Current cycle name]  •  Year [YearLevel]  •  [Major]       │
└─────────────────────────────────────────────────────────────┘
```
- Personalized greeting
- Current mentorship cycle info
- Quick action button: "Find a Mentor" (prominent, Maroon primary color)

### Section 2: Status Overview Cards (4 Cards)
```
┌──────────────┬──────────────┬──────────────┬──────────────┐
│ REQUESTS     │ ACTIVE       │ UPCOMING     │ COMPLETED    │
│              │ MENTORS      │ SESSIONS     │ SESSIONS     │
├──────────────┼──────────────┼──────────────┼──────────────┤
│ 2 Pending    │ 1 Active     │ 3 Scheduled  │ 5 Total      │
│ 1 Accepted   │ Available    │ Next: Apr 10 │ Avg: 4.5⭐    │
│              │              │              │              │
│ 📋 View All  │ 👥 View All  │ 📅 Calendar  │ 🎯 See All   │
└──────────────┴──────────────┴──────────────┴──────────────┘
```

**Card Details**:
- **Requests Card**:
  - Pending requests count (with status breakdown)
  - Quick status of most recent request
  - Color indicator: Amber/Yellow for pending
  - Click to view all requests

- **Active Mentors Card**:
  - Count of active mentorship relationships
  - Display primary mentor name/avatar
  - Availability indicator (green dot = available)
  - Click to view all mentors

- **Upcoming Sessions Card**:
  - Total scheduled sessions count
  - Next session date/mentor name
  - Time until next session
  - Click to see calendar

- **Completed Sessions Card**:
  - Total sessions completed this cycle
  - Average rating from sessions
  - Click to view feedback

### Section 3: Main Content Area - Tabbed Interface

#### Tab 1: PENDING REQUESTS
```
┌─────────────────────────────────────────────────────────────┐
│ MY MENTORSHIP REQUESTS                          [+ NEW]     │
├─────────────────────────────────────────────────────────────┤
│                                                              │
│ 📌 [PENDING] Req #001                          Created 3d  │
│    ├─ Mentor: Jane Smith (Google, Product Manager)         │
│    ├─ Goal: "Learn product strategy for fintech startups"  │
│    ├─ Industry: Technology  •  Major: CS                   │
│    └─ Status: Awaiting response...                          │
│       [Message] [Withdraw Request]                          │
│                                                              │
│ ✅ [ACCEPTED] Req #002                         Created 2w   │
│    ├─ Mentor: John Doe (Deloitte, Senior Associate)        │
│    ├─ Goal: "Transition from engineering to consulting"    │
│    ├─ Industry: Consulting  •  Major: Engineering          │
│    └─ Status: Active since 2 weeks ago                      │
│       [Message] [Schedule Session] [View Sessions]          │
│                                                              │
│ ❌ [DECLINED] Req #003                         Created 1w   │
│    ├─ Mentor: Sara Johnson (Twitter, Engineer)             │
│    ├─ Goal: "Get into Web3 development"                    │
│    └─ Status: Mentor unavailable                           │
│       [Request Another] [Archive]                          │
│                                                              │
└─────────────────────────────────────────────────────────────┘
```

**Request Card Elements**:
- Status badge (color-coded: Amber/Pending, Green/Accepted, Red/Declined)
- Mentor name and professional title
- Mentorship goal (truncated, expandable)
- Industry and mentor major alignment
- Relative timestamp (3d, 2w, 1w)
- Inline action buttons (status-dependent)

#### Tab 2: ACTIVE MENTORS
```
┌─────────────────────────────────────────────────────────────┐
│ MY ACTIVE MENTORS                                           │
├─────────────────────────────────────────────────────────────┤
│                                                              │
│ [Avatar] John Doe                            🟢 Available   │
│ Deloitte  •  Senior Associate  •  Consulting                │
│ ├─ Mentoring Goal: "Transition to consulting"              │
│ ├─ Sessions: 2 completed  •  Avg Rating: 4.8⭐              │
│ ├─ Next Session: Apr 12, 2:00 PM (45 min)                  │
│ └─ Last Message: "Great discussion on case studies!"       │
│    [Send Message] [View Sessions] [View Profile]            │
│                                                              │
│ [Avatar] Jane Smith                         🟢 Available   │
│ Google  •  Product Manager  •  Technology                   │
│ ├─ Mentoring Goal: "Learn fintech product strategy"        │
│ ├─ Sessions: 0 scheduled  •  No sessions yet               │
│ ├─ Next Session: Schedule one now                          │
│ └─ Skills: Product Strategy, Fintech, OKRs                 │
│    [Send Message] [Schedule Session] [View Profile]         │
│                                                              │
└─────────────────────────────────────────────────────────────┘
```

**Mentor Card Elements**:
- Avatar/profile picture
- Name, company, title, industry
- Mentorship goal statement
- Session metrics (count, average rating)
- Next session (or CTA to schedule)
- Latest message snippet
- Skills array (skill badges)
- Action buttons for each mentor

#### Tab 3: UPCOMING SESSIONS
```
┌─────────────────────────────────────────────────────────────┐
│ MY SESSIONS                                                 │
├───────────────────────────────────────────────────────────┤
│                                                              │
│ 📅 APRIL 2026                                               │
│                                                              │
│ TUE, APR 10  14:00                                          │
│ ├─ Topic: "Case study discussion: McKinsey vs BCG"         │
│ ├─ Mentor: John Doe (Deloitte)                             │
│ ├─ Duration: 45 minutes                                    │
│ ├─ Meeting: https://zoom.us/j/123456                       │
│ └─ [Join Call] [Reschedule] [Cancel]                       │
│                                                              │
│ FRI, APR 12  15:30                                          │
│ ├─ Topic: "Fintech market landscape"                       │
│ ├─ Mentor: Jane Smith (Google)                             │
│ ├─ Duration: 60 minutes                                    │
│ ├─ Meeting: https://teams.microsoft.com/... (Teams)        │
│ └─ [Join Call] [Reschedule] [Cancel]                       │
│                                                              │
│ MON, APR 15  10:00                                          │
│ ├─ Topic: "Interview prep - technical questions"          │
│ ├─ Mentor: John Doe (Deloitte)                             │
│ ├─ Duration: 30 minutes                                    │
│ ├─ Meeting: TBD (In-person at Ashesi grounds)              │
│ └─ [Confirm Location] [Reschedule] [Cancel]                │
│                                                              │
└─────────────────────────────────────────────────────────────┘
```

**Session Card Elements**:
- Date and time (prominent, large font)
- Session topic/agenda
- Mentor name and company
- Duration
- Meeting URL (if available) with platform badge (Zoom/Teams/Discord)
- Status indicator (Upcoming/Today/Overdue)
- Action buttons (Join, Reschedule, Cancel, Provide Feedback)
- Color-coded by proximity: Red/Today, Orange/Tomorrow, Blue/Future

#### Tab 4: COMPLETED SESSIONS & FEEDBACK
```
┌─────────────────────────────────────────────────────────────┐
│ SESSION FEEDBACK                                            │
├─────────────────────────────────────────────────────────────┤
│                                                              │
│ ✅ APR 3  •  "Product roadmap deep dive"                   │
│    with Jane Smith (Google)                                 │
│    ├─ Your Rating: 5⭐ ••••• (Excellent!)                  │
│    ├─ Your Feedback: "Jane provided exceptional insights   │
│    │  into market validation. Highly recommend!"           │
│    └─ Duration: 60 minutes                                 │
│                                                              │
│ ✅ MAR 28  •  "Career planning for finance"                │
│    with John Doe (Deloitte)                                │
│    ├─ Your Rating: 4⭐ ••••                               │
│    ├─ Your Feedback: "Very helpful, though would have     │
│    │  appreciated more time on case walkthroughs"         │
│    └─ Duration: 45 minutes                                 │
│                                                              │
│ [View All Feedback] [Download Report]                      │
│                                                              │
└─────────────────────────────────────────────────────────────┘
```

### Section 4: Right Sidebar Widgets

#### Widget 1: Quick Stats
```
┌──────────────────────┐
│ CYCLE PROGRESS       │
├──────────────────────┤
│                      │
│ 6 weeks left ⏳      │
│                      │
│ Your Goals:          │
│ ├─ Request mentor ✅ │
│ ├─ 1st session ✅    │
│ ├─ 3 sessions ⏳      │
│ └─ Feedback ⬜       │
│                      │
└──────────────────────┘
```

#### Widget 2: Messages (Unread)
```
┌──────────────────────┐
│ 💬 MESSAGES          │
├──────────────────────┤
│                      │
│ Jane Smith          │
│ "Thanks for your    │
│  interest! Let's... │
│ (2 new)             │
│                      │
│ John Doe            │
│ "How about next... │
│ (1 new)             │
│                      │
│ [View All]          │
│                      │
└──────────────────────┘
```

#### Widget 3: Recommended Mentors
```
┌──────────────────────┐
│ 🔥 SUGGESTED         │
├──────────────────────┤
│                      │
│ 👤 Sarah Chen       │
│ LinkedIn at Stripe  │
│ Tech × Finance      │
│ [Request] [Profile] │
│                      │
│ 👤 Mike Johnson     │
│ Goldman Sachs       │
│ Your major match!   │
│ [Request] [Profile] │
│                      │
└──────────────────────┘
```

---

## Alumni/Mentor Dashboard

### Overview & Layout
- **Route**: `/dashboard/mentor`
- **Main Purpose**: Mentor operations hub - manage mentees, schedule sessions, track impact
- **Layout**: 3-column responsive (sidebar | main content | right widgets)

### Section 1: Header & Status
```
┌─────────────────────────────────────────────────────────────┐
│ Welcome back, [FirstName]! 🎓                               │
│ You're an amazing mentor! You've impacted [N] students      │
│                                                              │
│ Your Availability: 🟢 AVAILABLE                             │
│ [Toggle Availability]                                       │
└─────────────────────────────────────────────────────────────┘
```

- Personalized greeting with motivational text
- Live availability status toggle (prominent, easy to flip)
- Link to re-edit availability slots

### Section 2: Impact Metrics (4 Cards)
```
┌──────────────┬──────────────┬──────────────┬──────────────┐
│ ACTIVE       │ TOTAL        │ TOTAL        │ AVG          │
│ MENTEES      │ SESSIONS     │ HOURS        │ RATING       │
├──────────────┼──────────────┼──────────────┼──────────────┤
│ 5            │ 12           │ 15.5h        │ 4.8⭐        │
│ students     │ completed    │ mentored     │ out of 5     │
│              │              │              │              │
│ 🎯 Growth    │ 📈 +2 this   │ ⏱️ +3h this  │ 🏆 Excellent │
│              │ month        │ month        │ rating       │
│              │              │              │              │
│ [Manage]     │ [View All]   │ [Export]     │ [Reviews]    │
└──────────────┴──────────────┴──────────────┴──────────────┘
```

**Metrics Details**:
- **Active Mentees**: Count of students in active mentorships (status = ACCEPTED)
- **Total Sessions**: All-time session count
- **Total Hours**: Sum of all session durations
- **Average Rating**: Aggregate session feedback rating
- Trend indicators (up/down from last period)
- Quick action buttons for each

### Section 3: Main Content Area - Tabbed Interface

#### Tab 1: PENDING REQUESTS (Priority Queue)
```
┌─────────────────────────────────────────────────────────────┐
│ 🔔 PENDING REQUESTS                  [Total: 3] [Respond]   │
├─────────────────────────────────────────────────────────────┤
│                                                              │
│ [HIGH PRIORITY]                     Requested: 1 day ago    │
│ 👤 Emma Williams  (Year 2, CS Major)                        │
│ Goal: "Prepare for Google internship interview"            │
│ Message: "I'm really interested in your experience..."     │
│ Academic Alignment:                                        │
│ ├─ Major Match: ✅ (Both CS)                              │
│ ├─ Skills Match: Java, Python, System Design              │
│ └─ Interests: Tech × Interview Prep                        │
│                                                              │
│ [View Profile] [Accept] [Decline]                          │
│                                                              │
│ ─────────────────────────────────────────────────────────  │
│                                                              │
│ [STANDARD]                          Requested: 5 days ago   │
│ 👤 David Mensah  (Year 3, MIS Major)                        │
│ Goal: "Transition from IT to management consulting"        │
│ Message: "Your background is exactly what I'm..."          │
│ Academic Alignment:                                        │
│ ├─ Major Match: Partial (MIS vs CS)                       │
│ ├─ Skills Match: Leadership, Business Analysis            │
│ └─ Interests: Consulting × Career Transition              │
│                                                              │
│ [View Profile] [Accept] [Decline]                          │
│                                                              │
│ [LOW PRIORITY]                     Requested: 2 weeks ago   │
│ 👤 Rebecca Asante (Year 4, Engineering)                    │
│ Goal: "Learn tech entrepreneurs - startup journey"         │
│ Message: "Would love to learn from your journey..."        │
│                                                              │
│ [View Profile] [Accept] [Decline]                          │
│                                                              │
└─────────────────────────────────────────────────────────────┘
```

**Request Card Elements**:
- Student name, year, major (prominent)
- Mentorship goal (quoted)
- Student's personalized message preview
- Compatibility scoring:
  - Academic alignment (major match, not match, partial)
  - Skill match
  - Interest alignment
- Relative timestamp (priority indicator)
- Quick action buttons (Accept/Decline)
- [View Profile] to see student background

#### Tab 2: ACTIVE MENTEES
```
┌─────────────────────────────────────────────────────────────┐
│ MY MENTEES                          [Total: 5]  [+ Add]     │
├─────────────────────────────────────────────────────────────┤
│                                                              │
│ 👤 Emma Williams  (Year 2, CS)                    Active 1w  │
│ ├─ Goal: "Google internship preparation"                   │
│ ├─ Sessions: 2 completed  •  Rating: 5⭐                   │
│ ├─ Next Session: Apr 12, 3:00 PM (45 min)                 │
│ ├─ Progress: "Completed 3 technical mock interviews"       │
│ └─ [Send Message] [Schedule Session] [View Profile]        │
│                                                              │
│ 👤 David Mensah  (Year 3, MIS)                  Active 3w   │
│ ├─ Goal: "Transition to consulting"                        │
│ ├─ Sessions: 4 completed  •  Rating: 4.7⭐                 │
│ ├─ Next Session: Apr 15, 2:00 PM (60 min)                 │
│ ├─ Progress: "Case study walkthroughs, interview prep"    │
│ └─ [Send Message] [Schedule Session] [View Profile]        │
│                                                              │
│ 👤 Rebecca Asante (Year 4, Eng)                Active 2w   │
│ ├─ Goal: "Startup founder mentorship"                      │
│ ├─ Sessions: 3 completed  •  Rating: 4.9⭐                 │
│ ├─ Next Session: Schedule one soon                         │
│ ├─ Progress: "Discussed MVP validation, funding"           │
│ └─ [Send Message] [Schedule Session] [View Profile]        │
│                                                              │
│ 👤 Kwame Boateng (Year 1, MIS)              Active 5d      │
│ ├─ Goal: "Building leadership skills"                      │
│ ├─ Sessions: 1 completed  •  Rating: 5⭐                   │
│ ├─ Next Session: Not scheduled yet                         │
│ ├─ Progress: "First session, excellent engagement"         │
│ └─ [Send Message] [Schedule Session] [View Profile]        │
│                                                              │
│ 👤 Ama Osei (Year 2, CS)                      Active 1d     │
│ ├─ Goal: "Machine learning career path"                    │
│ ├─ Sessions: 0 completed  •  Not rated yet                 │
│ ├─ Next Session: Not scheduled yet                         │
│ ├─ Progress: "Just started!"                               │
│ └─ [Send Message] [Schedule Session] [View Profile]        │
│                                                              │
│ [Load More] [Export Mentee List]                            │
│                                                              │
└─────────────────────────────────────────────────────────────┘
```

**Mentee Card Elements**:
- Avatar, name, year, major (color-coded by year)
- Mentorship goal (quoted)
- Session history (count + average rating)
- Next scheduled session (or CTA to schedule)
- Progress summary (key topics/achievements from recent sessions)
- Active duration (how long mentoring relationship)
- Action buttons (Message, Schedule Session, View Profile)
- Color indicator for engagement level (green = recent session, yellow = overdue)

#### Tab 3: SESSION CALENDAR & MANAGEMENT
```
┌─────────────────────────────────────────────────────────────┐
│ 📅 MY SESSIONS - APRIL 2026                                 │
├─────────────────────────────────────────────────────────────┤
│                                                              │
│ Week View:  [<] MON 8  TUE 9  WED 10 THU 11 FRI 12 [>]    │
│                                                              │
│ MON, APR 8  (Today)                                         │
│ ├─ 14:00 - "Interview prep" - Emma Williams (45 min)       │
│ │  ✅ COMPLETED (Session feedback provided)                │
│ │  [View Feedback] [Reschedule] [Notes]                    │
│ │                                                            │
│ └─ 16:30 - "Career planning" - David Mensah (60 min) LIVE  │
│    🔴 IN PROGRESS - Started 5 min ago                      │
│    Teams: https://teams.microsoft.com/...                  │
│    [Join Call] [End Session] [Add Notes]                   │
│                                                              │
│ TUE, APR 9                                                   │
│ ├─ 15:00 - "Case analysis" - Rebecca Asante (60 min) LIVE  │
│ │  🔴 IN PROGRESS - Started 20 min ago                    │
│ │  [Join Call] [End Session] [Add Notes]                  │
│ └─ 17:00 - "Product strategy" - Kwame Boateng (45 min)     │
│    ⏳ UPCOMING - In 2 hours                                 │
│    [Join Early] [Cancel] [Reschedule]                      │
│                                                              │
│ WED, APR 10                                                  │
│ ├─ 14:00 - "System design" - Emma Williams (90 min)        │
│ │  ⏳ UPCOMING - In 2 days                                  │
│ │  [Reschedule] [Cancel] [Add to Calendar]                 │
│ └─ 16:30 - "Startup financing" - Ama Osei (60 min)         │
│    ⏳ UPCOMING - In 2 days                                  │
│    [Reschedule] [Cancel] [Send Reminder]                   │
│                                                              │
│ [Create New Session] [Calendar View] [Export to Calendar]  │
│                                                              │
└─────────────────────────────────────────────────────────────┘
```

**Session Elements**:
- Date/time display with status badge (Completed/In Progress/Upcoming)
- Student name and session topic
- Duration and meeting URL
- Status indicator with color coding:
  - Green/✅ = Completed
  - Red/🔴 = In progress
  - Blue/⏳ = Upcoming (with countdown)
  - Grey/❌ = Cancelled
- Contextual action buttons:
  - *In Progress*: [Join Call], [End Session], [Add Notes]
  - *Upcoming*: [Reschedule], [Cancel], [Send Reminder]
  - *Completed*: [View Feedback], [Add/Edit Notes]
- Real-time toggle for live sessions

#### Tab 4: MENTEE PROGRESS & NOTES
```
┌─────────────────────────────────────────────────────────────┐
│ 📝 MENTEE PROGRESS & NOTES                                  │
├─────────────────────────────────────────────────────────────┤
│                                                              │
│ 👤 Emma Williams - Google Internship Preparation            │
│ ├─ Sessions: 2 completed over 2 weeks                       │
│ ├─ Topics Covered: Technical interviews, system design     │
│ ├─ Feedback: "Excellent technical foundation"              │
│ │                                                            │
│ └─ 📄 Session Notes:                                        │
│    • [Apr 3] Discussed binary search, array problems       │
│      - Emma picked up two-pointer technique quickly         │
│      - Strong coding style, needs practice on edge cases   │
│    • [Apr 8] Mock Google interview simulation               │
│      - Completed 2/3 questions in time limit               │
│      - Ready for actual interviews                         │
│      - Action: Practice dynamic programming more           │
│                                                              │
│ ─────────────────────────────────────────────────────────  │
│                                                              │
│ 👤 David Mensah - Consulting Transition                     │
│ ├─ Sessions: 4 completed over 3 weeks                       │
│ ├─ Topics Covered: Case interviews, business acumen       │
│ ├─ Feedback: "Rapid learner, asking great questions"       │
│ │                                                            │
│ └─ 📄 Session Notes:                                        │
│    • [Mar 25] Introduction to case frameworks              │
│      - Introduced SWOT, Porter's 5 forces                 │
│      - Good analytical thinking                           │
│    • [Mar 30] McKinsey case walkthrough                     │
│      - Structured approach improving                       │
│      - Drill: Pricing strategy case                       │
│    • [Apr 2] BCG interview simulation                       │
│      - Performed well, minor improvements needed           │
│      - Action: Practice client communication              │
│    • [Apr 8] Case competition prep                         │
│      - Ready for case competitions                        │
│                                                              │
│    [Add Note] [Download Progress Report]                   │
│                                                              │
└─────────────────────────────────────────────────────────────┘
```

**Progress Tracking Elements**:
- Summary metrics: sessions completed, relationship duration
- Topics covered (tag-based)
- Feedback summary
- Timeline of session notes (reverse chronological)
- Note editing capability
- Import/export features

### Section 4: Right Sidebar Widgets

#### Widget 1: Availability Slots
```
┌──────────────────────┐
│ YOUR AVAILABILITY    │
├──────────────────────┤
│                      │
│ Status: 🟢 Available │
│ Students can see     │
│ your open slots      │
│                      │
│ Mon: 09:00 - 11:00   │
│ Tue: 14:00 - 16:00   │
│ Wed: OFF             │
│ Thu: 10:00 - 12:00   │
│ Fri: 15:00 - 17:00   │
│ Sat: 09:00 - 11:00   │
│                      │
│ [Edit Availability]  │
│ [Toggle Status]      │
│                      │
└──────────────────────┘
```

#### Widget 2: Quick Stats
```
┌──────────────────────┐
│ THIS MONTH           │
├──────────────────────┤
│                      │
│ Sessions: 8          │
│ New mentees: 2       │
│ Hours: 12.5h         │
│ Avg rating: 4.9⭐    │
│                      │
│ [View Trends]        │
│                      │
└──────────────────────┘
```

#### Widget 3: Notifications & Messages
```
┌──────────────────────┐
│ 🔔 NOTIFICATIONS     │
├──────────────────────┤
│                      │
│ 📧 New message       │
│    Emma: "Thanks!    │
│    Super helpful..."  │
│    (5 min ago)       │
│                      │
│ ⏰ Reminder           │
│    David: Session    │
│    in 30 minutes     │
│                      │
│ ⭐ Feedback received  │
│    Rebecca gave 5⭐   │
│    "Best session..." │
│                      │
│ [View All]           │
│                      │
└──────────────────────┘
```

---

## Design System Specifications

### Color Palette
- **Primary**: Maroon (#923D41)
- **Secondary**: Dark Maroon (#7B1427)
- **Accent**: Gold/Yellow (#D4AF37) for highlights
- **Status Colors**:
  - Pending: Amber (#F59E0B)
  - Accepted/Active: Green (#10B981)
  - Declined/Inactive: Red (#EF4444)
  - Completed: Blue (#3B82F6)
  - Upcoming: Purple (#8B5CF6)

### Typography
- **Font Family**: Quicksand (body), Bree Serif (headings)
- **Header**: Bree Serif, 32-36px, weight 400
- **Subheader**: Quicksand, 16-20px, weight 600
- **Body**: Quicksand, 13-14px, weight 400
- **Small**: Quicksand, 11-12px, weight 400

### Component Design

#### Card Components
- Border: 1px solid #923D41/20
- Border-radius: 12px
- Background: #FAF8F8 (off-white with maroon tint)
- Padding: 24px
- Hover: Shadow lift, slight color shift

#### Button Styles
- **Primary (CTA)**: Maroon background (#923D41), white text, full width in forms
- **Secondary**: White background, Maroon border, Maroon text
- **Tertiary/Links**: Maroon text, no background
- **Danger**: Red (#EF4444) background
- **Disabled**: Grey background, reduced opacity
- **Rounded**: border-radius: 10px
- **Height**: 60px (desktop), 48px (mobile)

#### Status Badges
- Text color: status color
- Background: status color with 15% opacity
- Border-radius: 16px
- Padding: 4px 12px
- Font-size: 12px, weight 600

#### Modals & Overlays
- Dark overlay: rgba(0, 0, 0, 0.5)
- Modal background: White (#FFFFFF)
- Border-radius: 16px
- Max-width: 600px (desktop)

### Layout Grid
- **Desktop**: 12-column grid
- **Tablet**: 6-column grid
- **Mobile**: 2-column grid
- **Gutter**: 24px
- **Sidebar**: 280px (fixed)
- **Main content**: Remaining width

---

## Interaction Patterns

### Primary Workflows

#### Student: "Find & Request Mentor"
1. Dashboard → [+ Find a Mentor] button
2. Mentor directory with filters (industry, major, skills)
3. Click mentor card → view full profile
4. [Request Mentorship] → form modal
5. Fill goal (20-500 chars) + optional message
6. [Submit Request] → confirmation → back to dashboard
7. Request appears in "Pending Requests" tab

#### Mentor: "Accept Mentee & Schedule Session"
1. Dashboard → Pending Requests tab
2. Review request with compatibility metrics
3. [Accept] → mentee added to "My Mentees"
4. Click mentee card
5. [Schedule Session] → calendar picker
6. Set date, time, topic, duration, meeting URL
7. [Create Session] → confirmation
8. Session appears in calendar

#### During Session: "Live Meeting"
1. Sessions tab → [Join Call] button
2. Opens meeting link in new tab
3. Dashboard shows "IN PROGRESS" status
4. [End Session] ends mentoring
5. Optional: Add notes immediately after
6. Feedback prompt appears

#### Post-Session: "Provide Feedback"
1. Dashboard → Completed Sessions tab (student)
2. Click session card
3. Rate 1-5 stars + optional comment
4. Submit feedback
5. Mentor sees feedback in their Mentee Progress tab

### Mobile Responsiveness
- **Hamburger menu**: Collapses sidebar
- **Touch-friendly buttons**: 48px minimum
- **Stack cards vertically**: No 3-column layout
- **Simplified tabs**: Scroll horizontally
- **Bottom navigation**: Quick access to main sections (Home, Mentors, Sessions, Messages, Profile)

---

## Accessibility Features

- ARIA labels on all interactive elements
- Color not sole indicator (use icons + text)
- Keyboard navigation: Tab through all interactive elements
- Focus indicators: Maroon outline on inputs
- Contrast ratio: 4.5:1 minimum
- Form validation: Clear error messages
- Modal focus trapping: Tab stays within modal
- Screen reader support: Structured headings, alt text on images

---

## Performance Considerations

- Lazy load images (mentor avatars, session URLs)
- Paginate long lists (requests, mentees, sessions)
- Cache user metrics (update on action)
- Optimize bundle: Code split dashboards from auth
- Skeleton loaders for initial data fetch
- Real-time updates via WebSocket (messages, session status)

---

## Future Enhancements

- **Timeline View**: Visual mentorship journey
- **Goal Tracking**: Progress toward stated mentorship goals
- **Recommendations**: AI-powered mentor matches
- **Surveys**: Cycle feedback collection
- **Analytics**: Engagement heatmap, retention metrics
- **Export**: Session transcripts, mentee reports
- **Video Integration**: Recorded session playback
- **Mobile App**: Native iOS/Android apps
