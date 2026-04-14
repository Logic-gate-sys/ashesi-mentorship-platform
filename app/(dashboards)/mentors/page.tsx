"use client";
import { QuickInfoCard } from "@/app/_components_and_hooks/ui/reusable-ui/CickableStatCard";
import { useAuth } from "@/app/ _libs_and_schemas/context/auth-context";
import {User, Clock, MailIcon, type LucideIcon, MegaphoneIcon } from "lucide-react";
import { TopStrinp } from "@/app/_components_and_hooks/ui/reusable-ui/DashboardTopStrip";
import Link from "next/link";
import { PendingRequestCard } from "@/app/_components_and_hooks/cards/PendingRequestCard";
import { ActiveMCard } from "@/app/_components_and_hooks/cards/ActiveMenteeCard";
import { UpdatesCard } from "@/app/_components_and_hooks/cards/RecentUpdatesCard";
import { UpcomingEventsCard } from "@/app/_components_and_hooks/cards/UpcommingSessionsCard";
import { MentorAvailabilityCard } from "@/app/_components_and_hooks/cards/MentorAvailabiltyCard";

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

export default function MentorHomePage() {
  const { user } = useAuth();

  return (
    <div id="mentor-dash-home" className=" text-accent flex flex-col items-start gap-4">
      <section className="w-full ">
        <TopStrinp
         firstName={user?.firstName??""} 
         lastName={user?.lastName??""}
         profession={user?.profession??""} 
         avatarUrl={user?.avatarUrl??""}
         />
      </section>

      <section id="stats" className="w-full flex md:flex-row gap-4 p-2">
        {testStatsData.map((itm, idx)=>(
            <QuickInfoCard key={idx} title={itm.title} statsNum={itm.statsNum} Icon={itm.icon}/>
        ))}
      </section>

      <section id='request-events' className="md:mt-6 w-full md:grid md:grid-cols-[2.5fr_1fr] gap-4 ">

        <div id='main area'>
            <h1 className="text-2xl font-bold" > Mentorship Requests: </h1>
           <section id='pending-reqs' className="w-full flex flex-col gap-4">
             <p className="ml-auto ">
                <Link href='/requests' > View All Requests </Link>
            </p>
            {pendingRequests.slice(0,2).map((req, idx)=>(
                <PendingRequestCard key={idx} id={req.id} studentName={req.studentName} 
                studentAvatarUrl={req.studentAvatarUrl} majorAndYear={req.majorAndYear} message={req.message}
                onAccept={()=>alert("Accept")}
                onDecline={()=>alert("Declined")}
                />
            ))}

           </section>

           <section id='active-m' className="mt-8">
                <h1 className="text-2xl"> Active Mentees </h1>
                <div id='mentee-list' className='w-full grid grid-cols-3 gap-2'>
                {activeMentees.map((m, idx)=>(
                <ActiveMCard key={idx} mName={m.name} mTitle={m.title} onMessage={()=> alert("Clicked Message")}/>))}
                </div>
           </section>
        </div>
        
        <div id='side-area' className="w-full flex flex-col gap-3">
         <UpdatesCard updates={recentUpdates} title="Update" Icon={MegaphoneIcon} />
         <UpcomingEventsCard events={sampleEvents} />
         <MentorAvailabilityCard />
        </div>

      </section>
    </div>
  );
}
