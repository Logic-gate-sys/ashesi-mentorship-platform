"use client";
import Image from 'next/image';
import { Check, Loader2 } from 'lucide-react';

interface RequestProps {
  id: string | number;
  studentName: string;
  studentAvatarUrl: string;
  message: string;
  majorAndYear?: string; // Example: (CS '26)
  isAccepting?: boolean;
  isDeclining?: boolean;
  isAccepted?: boolean;
  isDeclined?: boolean;
  onAccept?: (id: string | number) => void;
  onDecline?: (id: string | number) => void;
}

export function PendingRequestCard({
  id,
  studentName,
  studentAvatarUrl,
  majorAndYear,
  message,
  isAccepting = false,
  isDeclining = false,
  isAccepted = false,
  isDeclined = false,
  onAccept,
  onDecline,
}: RequestProps) {
  
  const handleAccept = () => onAccept?.(id);
  const handleDecline = () => onDecline?.(id);
  const disableActions = isAccepting || isDeclining || isAccepted || isDeclined;

  return (
    <div 
      className={`w-full max-w-225 bg-[#FFF0F0] rounded-[20px] p-3 flex flex-col sm:flex-row items-center sm:items-start gap-2 shadow-sm`}
    >
      <div className="relative w-25 h-25 sm:w-22 sm:h-22 shrink-0 rounded-[20px] overflow-hidden border">
        <Image
          src={studentAvatarUrl} 
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
            disabled={disableActions}
            className={`w-full sm:w-40 h-10 rounded-3xl text-lg font-bold transition-colors inline-flex items-center justify-center gap-2 ${
              isAccepted
                ? 'bg-[#1B5E20] text-white'
                : 'bg-[#2E7D32] hover:bg-[#1B5E20] text-white'
            } ${disableActions ? 'opacity-80 cursor-not-allowed' : ''}`}
          >
            {isAccepting ? (
              <>
                <Loader2 className="w-4 h-4 animate-spin" />
                Processing
              </>
            ) : isAccepted ? (
              <>
                <Check className="w-4 h-4" />
                Accepted
              </>
            ) : (
              'Accept'
            )}
          </button>
          
          <button
            onClick={handleDecline}
            disabled={disableActions}
            className={`w-full sm:w-40 h-10 rounded-3xl text-lg font-bold transition-colors inline-flex items-center justify-center gap-2 ${
              isDeclined
                ? 'bg-[#6A0A1D] text-white'
                : 'hover:bg-[#6A0A1D]'
            } ${disableActions ? 'opacity-80 cursor-not-allowed' : ''}`}
          >
            {isDeclining ? (
              <>
                <Loader2 className="w-4 h-4 animate-spin" />
                Processing
              </>
            ) : isDeclined ? (
              <>
                <Check className="w-4 h-4" />
                Declined
              </>
            ) : (
              'Decline'
            )}
          </button>
        </div>
        
      </div>
    </div>
  );
}