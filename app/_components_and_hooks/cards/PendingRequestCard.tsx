"use client";
import Image from 'next/image';

interface RequestProps {
  id: string | number;
  studentName: string;
  studentAvatarUrl: string;
  message: string;
  majorAndYear?: string; // Example: (CS '26)
  onAccept?: (id: string | number) => void;
  onDecline?: (id: string | number) => void;
}

export function PendingRequestCard({
  id,
  studentName,
  studentAvatarUrl,
  majorAndYear,
  message,
  onAccept,
  onDecline,
}: RequestProps) {
  
  const handleAccept = () => onAccept?.(id);
  const handleDecline = () => onDecline?.(id);

  return (
    <div 
      className={`w-full max-w-225 bg-[#FFF0F0] rounded-[20px] p-3 flex flex-col sm:flex-row items-center sm:items-start gap-2 shadow-sm`}
    >
      <div className="relative w-25 h-25 sm:w-22 sm:h-22 shrink-0 rounded-[20px] overflow-hidden border">
        <Image
          src={studentAvatarUrl || "/default-student.png"} 
          alt={`${studentName}'s profile`}
          fill
          className="object-cover"
        />
      </div>
      <div className="flex-1 flex flex-col gap-5 w-full text-center sm:text-left">
        <div className="flex flex-col gap-1.5">
          <div className="flex flex-col sm:flex-row sm:items-baseline gap-1 sm:gap-2">
            <h1 className="text-xl font-bold text-[#241919]">
              {studentName}
            </h1>
            {majorAndYear && (
              <span className="text-sm text-gray-500 font-medium">
                ({majorAndYear})
              </span>
            )}
          </div>
          
          <p className={`text-base font-normal accent-[#564242] opacity-90 leading-relaxed`}>
            “{message}”
          </p>
        </div>

        <div className="flex flex-col sm:flex-row items-center gap-3 w-full sm:w-auto">
          <button
            onClick={handleAccept}
            className="w-full sm:w-40 h-12 bg-[#2E7D32] hover:bg-[#1B5E20] text-white rounded-3xl text-lg font-bold transition-colors"
          >
            Accept
          </button>
          
          <button
            onClick={handleDecline}
            className={`w-full sm:w-40 h-12  hover:bg-white/50 bg-[#6A0A1D] rounded-3xl text-lg font-bold transition-colors`}
          >
            Decline
          </button>
        </div>
        
      </div>
    </div>
  );
}