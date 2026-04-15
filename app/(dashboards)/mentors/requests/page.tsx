"use client";
import { useAuth } from "@/app/ _libs_and_schemas/context/auth-context";
import {User, Clock, MailIcon, type LucideIcon, MegaphoneIcon } from "lucide-react";
import { TopLeftProfile } from "@/app/_components_and_hooks/ui/reusable-ui/DashboardTopStrip";
import Link from "next/link";
import { PendingRequestCard } from "@/app/_components_and_hooks/cards/PendingRequestCard";
import { ActiveMCard } from "@/app/_components_and_hooks/cards/ActiveMenteeCard";
import { UpdatesCard } from "@/app/_components_and_hooks/cards/RecentUpdatesCard";
import { UpcomingEventsCard } from "@/app/_components_and_hooks/cards/UpcommingSessionsCard";
import { MentorAvailabilityCard } from "@/app/_components_and_hooks/cards/MentorAvailabiltyCard";
import { MentorshipGoalsCard } from "@/app/_components_and_hooks/cards/MentorshipGoalCard";
import { StatusRequestCard } from "@/app/_components_and_hooks/cards/RequestStatusCard";

interface StatItem {
    title: string;
    statsNum: number;
    icon: LucideIcon; // This ensures it's a component reference
}

const testStatsData: StatItem[] = [
  { title: "Mentees", statsNum: 12, icon: User  },
  { title: "Sessions", statsNum: 45, icon:MailIcon},
  { title: "Reviews", statsNum: 4.9, icon: Clock },
];

const recentUpdates = [
  { id: 1, event: "Kojo Annan sent a request", timestamp: "2 hours ago" },
  { id: 2, event: "New message from Akosua", timestamp: "Yesterday" },
  { id: 3, event: "Kofi Dzisa completed Session #4", timestamp: "1 day ago" },
];

const myGoals = [
  { label: "Active Mentees", currentValue: 12, targetValue: 15 },
  { label: "Weekly Hours", currentValue: 6.5 }
];
const sampleEvents = [
  { 
    id: 1, 
    month: "APR", 
    day: 16, 
    title: "Account Abstraction Research Sync", 
    meetingUrl: "https://meet.google.com/abc-defg-hij" 
  },
  { 
    id: 2, 
    month: "APR", 
    day: 20, 
    title: "Memora NFT Marketplace Review", 
    meetingUrl: "https://zoom.us/j/123456789" 
  },
  { 
    id: 3, 
    month: "APR", 
    day: 24, 
    title: "Internship Prep with Selorm", 
    meetingUrl: "https://teams.microsoft.com/l/meetup-join/..." 
  },
];
const pendingRequests = [
  {
    id: 1,
    studentName: "Kojo Annan",
    majorAndYear: "CS '26",
    studentAvatarUrl: "https://api.dicebear.com/7.x/avataaars/svg?seed=Kojo",
    message: "I am deeply inspired by your research on equitable technology in West Africa. I’d love to learn how you approached your data collection."
  },
  {
    id: 2,
    studentName: "Amara Okafor",
    majorAndYear: "MIS '25",
    studentAvatarUrl: "https://api.dicebear.com/7.x/avataaars/svg?seed=Amara",
    message: "I'm currently transitioning from traditional web development to Web3. I’ve seen your work with Foundry and would appreciate some guidance."
  },
  {
    id: 3,
    studentName: "Selorm Tetteh",
    majorAndYear: "CE '27",
    studentAvatarUrl: "https://api.dicebear.com/7.x/avataaars/svg?seed=Selorm",
    message: "My team is working on a Campus Queue system. Could we chat about optimizing our PostgreSQL schema for high-traffic streaks?"
  }
];

const activeMentees = [
  { name: "Ekow Mensah", title: "BLOCKCHAIN DEV", id: "ekow-1" },
  { name: "Abena Boateng", title: "HCI RESEARCHER", id: "abena-2" },
  { name: "Kofi Dzisa", title: "BACKEND ENGINEER", id: "kofi-3" },
];

const students = [
  {
    name: "Akosua Mensah",
    year: "BA '27",
    focus: "Marketing Strategy",
    status: "PENDING",
    avatarUrl: "https://images.unsplash.com/photo-1494790108377-be9c29b29330?q=80&w=200&h=200&auto=format&fit=crop"
  },
  {
    name: "Kwabena Boahen",
    year: "EE '25",
    focus: "Renewable Energy Systems",
    status: "CONNECTED",
    avatarUrl: "https://images.unsplash.com/photo-1507003211169-0a1dd7228f2d?q=80&w=200&h=200&auto=format&fit=crop"
  }
];

export default function MentorHomePage() {
  const { user } = useAuth();

  return (
    <div id="mentor-dash-home" className=" text-accent flex flex-col items-start gap-4">
      <section id='top' className="flex flex-col gap-1">
           <h1>
            Incoming Mentorship Requests
           </h1>
           <p>
            Review and respond to students seeking guidance in your field.
          </p>
      </section>

      <section id='content-grid' className="grid grid-cols-[2.5fr_1fr] gap-4 ">
            <main id='main-contents'>
              <section id='incoming-reqs' className="flex flex-col gap-4">
                 { pendingRequests.map((req, idx)=>(
                 <PendingRequestCard key={idx} id={req.id} studentName={req.studentName} 
                     studentAvatarUrl={req.studentAvatarUrl} majorAndYear={req.majorAndYear} message={req.message}
                     onAccept={()=>alert("Accept")}
                    onDecline={()=>alert("Declined")}
                />))}

                 <div id='req-responded' className="mt-12 ">
                  { students.map((std, idx)=>(
                    <StatusRequestCard key={idx}
                    studentName={std.name}
                    majorAndYear={std.year}
                    focusArea={std.focus}
                    avatarUrl={std.avatarUrl}
                    status={std.status}
                     />
                  )) }
                 </div>
              </section>
            </main>

            <aside id='side-contents' className="md:flex flex-col gap-4 ">
              <UpdatesCard updates={recentUpdates} title="Update" Icon={MegaphoneIcon} />
              <MentorshipGoalsCard metrics={myGoals}/>
               <MentorAvailabilityCard />
            </aside>
      </section>
      
    </div>
  );
}
