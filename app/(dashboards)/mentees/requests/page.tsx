"use client";
import { useEffect,useState} from "react";
import { MegaphoneIcon, Wifi, WifiOff } from "lucide-react";
import { PendingRequestCard } from "#comp-hooks/cards/PendingRequestCard";
import { UpdatesCard } from "#comp-hooks/cards/RecentUpdatesCard";
import { StatusRequestCard } from "#comp-hooks/cards/RequestStatusCard";
import { useMenteeDashboard } from "#/components_hooks/hooks/mentee/useMenteeDashboard";
import { useSocketContext } from "#/libs_schemas/context/socket-context";
import { useMentors } from "#/components_hooks/hooks/mentee/useMentors";
import { MentorDetailCard } from "#/components_hooks/cards/MentorDetails";

const FALLBACK_AVATAR = "https://i.pravatar.cc/150?u=mentor-request";


export default function MenteeRequestPage() {
  const {pendingRequests,requestHistory,recentUpdates} = useMenteeDashboard();
  const {isOn,} = useSocketContext();
  const {availableMentors} = useMentors({page:1, limit:20}); 
  const [filtering, setFiltering] = useState<boolean>(false);
  const [filter,setFilter] = useState<string>("")
  

  const filteredMentors = filtering ? availableMentors?.filter((mnt) => 
      mnt.firstName.toLowerCase().includes(filter.toLowerCase()) ||
      mnt.lastName?.toLowerCase().includes(filter.toLowerCase())
    ) : availableMentors;

  const handleInputChange = (e:React.ChangeEvent<HTMLInputElement>) =>{
        const text = e.target.value;
        setFilter(text);
        setFiltering(text.length > 0); // only filter when there's text
  }
  //Page 
  return (
    <div className="text-accent flex flex-col items-start gap-5 pb-8">
      <section className="w-full flex items-start justify-between gap-4">
        <div>
          <h1 className="text-2xl font-bold">Mentors</h1>
          <p className="text-gray-500">
            Review the lists of available mentors that you can send request to, let all conversations be professional.
          </p>
        </div>

        <div className="flex items-center gap-2 rounded-full px-3 py-1.5 text-xs font-semibold bg-[#FDF1F2] text-[#6C1221]">
          {isOn ? (
            isOn ? ( <><Wifi className="h-4 w-4" />Realtime Connected</>) : (
              <>
                <WifiOff className="h-4 w-4" />
                Realtime Reconnecting
              </>
            )) : (<>  <WifiOff className="h-4 w-4" />  Realtime Off</> )}
        </div>
      </section>

      {/* {error ? (
        <div className="w-full rounded-xl border border-red-200 bg-red-50 p-3 text-sm text-red-700">
          {error}
        </div>
      ) : null} */}

      <section className="w-full grid gap-4 md:grid-cols-[2.4fr_1fr]">
        <main className="flex flex-col gap-5">
          <section className="flex flex-col gap-4">

            {pendingRequests.length ? (
              pendingRequests.map((request) => {
                return (
                  <PendingRequestCard
                    key={request.id}
                    id={request.id}
                    studentName={request.studentName}
                    studentAvatarUrl={request.studentAvatarUrl || FALLBACK_AVATAR}
                    majorAndYear={request.majorAndYear}
                    message={request.message}
                  />
                );
              })
            ) : (
              <div className="rounded-2xl border border-dashed border-gray-200 p-6 text-sm text-gray-500">
                No pending requests right now.
              </div>
            )}
          </section>
       <search id='search-bar' className="max-w-[50%]">
        <input
          type="text"
          onChange={(e)=>handleInputChange(e)}
          placeholder="Start typing to reveal..."
          className=" px-5 py-3 pl-12 rounded-full bg-[#FAF8F8] border-2 border-[#D1D5DB] outline-none transition-all focus:border-[#923D41] focus:ring-2 focus:ring-[#923D41]/10 text-[#0A0909]"
          style={{ fontFamily: "'Quicksand', sans-serif" }}
        />
         <div className="absolute left-4 top-1/2 -translate-y-1/2 text-[#923D41]">
          <svg className="w-5 h-5" fill="none" stroke="currentColor" viewBox="0 0 24 24">
            <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M21 21l-6-6m2-5a7 7 0 11-14 0 7 7 0 0114 0z" />
          </svg>
        </div>
     </search>
          <section id='available-mentors'>
            <h1>Available Mentors </h1>
            <section id='mentors-flex' className="flex  flex-col md:grid grid-cols-3 gap-2">
              {availableMentors?.length? (
             filteredMentors?.map((mnt, idx)=>(
              <MentorDetailCard key={mnt?.id} {...mnt} />
             ))
            )
             :(<p className="text-sm text-gray-500">No available mentors yet.</p>)
            }
            </section>
             
          </section>
          <section className="mt-4 flex flex-col gap-3">
            <h2 className="text-xl font-semibold text-[#241919]">Recent Decisions</h2>

            {requestHistory.length ? (
              requestHistory.slice(0, 6).map((item) => (
                <StatusRequestCard
                  key={item.id}
                  studentName={item.studentName}
                  majorAndYear={item.majorAndYear || "Program not specified"}
                  focusArea={item.goal || item.message || "Career guidance"}
                  status={item.status === "ACCEPTED" ? "CONNECTED" : "DECLINED"}
                  avatarUrl={item.studentAvatarUrl || FALLBACK_AVATAR}
                />
              ))
            ) : (
              <p className="text-sm text-gray-500">No accepted or declined requests yet.</p>
            )}
          </section>
        </main>

        <aside className="flex flex-col gap-4">
          <UpdatesCard updates={recentUpdates} title="Request Activity" Icon={MegaphoneIcon} />
        </aside>
      </section>
    </div>
  );
}
