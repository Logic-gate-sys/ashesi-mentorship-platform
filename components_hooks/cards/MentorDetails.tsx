'use client'
import React, { useState } from 'react';
import { ChevronDown, ChevronUp, UserPlus, XCircle } from 'lucide-react';
import Link from 'next/link';

interface MentorDetailProp{
    id: string,
    firstName: string,
    lastName:string,
    graduationYear: string,
    company: string,
    skills?: string[],
    bio: string,
}


// mentor-deatils card
export const MentorDetailCard = (data: MentorDetailProp) => {
  const [isExpanded, setIsExpanded] = useState(true);
  const [requestSent, setRequestSent] = useState(false);
  return (
    <div className="max-w-md mx-auto bg-white border border-gray-200 rounded-2xl shadow-sm overflow-hidden transition-all duration-300">
      {/* Header / Always Visible Section */}
      <div className="p-5 flex items-center justify-between">
        <div className="flex items-center space-x-4">
          <div className="w-16 h-16 rounded-full bg-slate-200 overflow-hidden border-2 border-[#8B3A3A]">
             {/* Placeholder for the profile image */}
            <div className="w-full h-full bg-gray-300 flex items-center justify-center text-gray-500">KM</div>
          </div>
          <div>
            <h3 className="text-lg font-bold text-gray-900">{data.firstName} {data.lastName}</h3>
            <p className="text-sm text-gray-500">{data.company} • Class of {data.graduationYear}</p>
          </div>
        </div>
        
        <button 
          onClick={() => setIsExpanded(!isExpanded)}
          className="p-2 hover:bg-gray-100 rounded-full transition-colors"
        >
          {isExpanded ? <ChevronUp size={20} /> : <ChevronDown size={20} />}
        </button>
      </div>

      {/* Collapsible Content */}
      {isExpanded && (
        <div className="px-5 pb-5 animate-in fade-in slide-in-from-top-2">
          <div className="pt-2 border-t border-gray-100">
            <h4 className="text-xs font-semibold text-gray-400 uppercase tracking-wider mb-2">Bio</h4>
            <p className="text-sm text-gray-600 leading-relaxed mb-4">
              {data.bio}
            </p>
            
            <div className="flex flex-wrap gap-2 mb-6">
              {data.skills??["React", "Mongo"].map((skill) => (
                <span key={skill} className="px-2 py-1 bg-red-50 text-[#8B3A3A] text-xs font-medium rounded-md">
                  {skill}
                </span>
              ))}
            </div>

            <div className="flex flex-col space-y-3">
              {/* Action Buttons */}
              <button
                onClick={() => setRequestSent(!requestSent)}
                className={`w-full flex items-center justify-center space-x-2 py-2.5 rounded-xl font-semibold transition-all ${
                  requestSent 
                  ? "bg-gray-100 text-gray-600 hover:bg-red-50 hover:text-red-600" 
                  : "bg-[#8B3A3A] text-white hover:bg-[#6b2d2d]"
                }`}
              >
                {requestSent ? (
                  <><XCircle size={18} /> <span>Cancel Request</span></>
                ) : (
                  <><UserPlus size={18} /> <span>Send Request</span></>
                )}
              </button>
              <Link href={`user-details/${data.id}`}>
               <button className="w-full text-center text-sm font-medium text-gray-500 hover:text-[#8B3A3A] transition-colors" >
                View More Details
              </button>
              </Link>
             
            </div>
          </div>
        </div>
      )}
    </div>
  );
};

