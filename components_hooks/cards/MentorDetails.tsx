'use client'
import React, { useState } from 'react';
import { ChevronDown, ChevronUp, UserPlus, XCircle, X, Send, Target, MessageSquare, Calendar } from 'lucide-react';
import Link from 'next/link';
import { useFetchApi } from '../hooks/shared/useMentorApi';
import { useMentorshipCycle } from '#comp-hooks/hooks/shared/useMentorshipCycle';
import {useMenteeRequests} from '#comp-hooks/hooks/mentee/useRequest'

interface MentorDetailProp {
  id: string;
  firstName: string;
  lastName: string;
  graduationYear: string;
  company: string;
  skills?: string[];
  bio: string;
  onCancelRequest?: (requestId: string) => Promise<any>;
  requestSent?: boolean;
}

export const MentorDetailCard = ({ requestSent, onCancelRequest, ...data }: MentorDetailProp) => {
  const [isExpanded, setIsExpanded] = useState(true);
  const [isModalOpen, setIsModalOpen] = useState(false);
  const [isSubmitting, setIsSubmitting] = useState(false);
  const {sendRequest } = useMenteeRequests(); 
  const {getCurrentCycle, isLoading, error} = useMentorshipCycle(); 

  // Structured fields for the request
  const [formData, setFormData] = useState({
    goal: '',
    message: '',
  });

  const handleInputChange = (e: React.ChangeEvent<HTMLInputElement | HTMLTextAreaElement | HTMLSelectElement>) => {
    const { name, value } = e.target;
    setFormData(prev => ({ ...prev, [name]: value }));
  };

 const handleSend = async () => {
  if (!formData.goal || !formData.message) return;
  setIsSubmitting(true);
  try {
    // 2. Ensure currentCycle is valid (check if it's a function or value)
    const cycle = await getCurrentCycle();
    const payload = {
      mentorId: data.id,
      cycleId: cycle?.id,
      goal: formData.goal,
      message: formData.message,
    };

    // 4. Pass the object directly
    const res = await sendRequest(payload);

    setIsModalOpen(false);
    setFormData({ goal: '', message: '' });
  } catch (error) {
    console.error("Submission failed", error);
    // You might want to show a toast or error message to the user here
  } finally {
    setIsSubmitting(false);
  }
};

  return (
    <>
      <div className="w-full max-w-none overflow-hidden rounded-2xl border border-gray-200 bg-white shadow-sm transition-all duration-300">
        {/* Header Section */}
        <div className="p-5 flex items-center justify-between">
          <div className="flex items-center space-x-4">
            <div className="w-16 h-16 rounded-full bg-slate-100 flex items-center justify-center border-2 border-[#8B3A3A] font-bold text-[#8B3A3A]">
              {data.firstName[0]}{data.lastName[0]}
            </div>
            <div>
              <h3 className="text-lg font-bold text-gray-900">{data.firstName} {data.lastName}</h3>
              <p className="text-sm text-gray-500">{data.company} • Class of {data.graduationYear}</p>
            </div>
          </div>
          <button onClick={() => setIsExpanded(!isExpanded)} className="p-2 hover:bg-gray-100 rounded-full transition-colors">
            {isExpanded ? <ChevronUp size={20} /> : <ChevronDown size={20} />}
          </button>
        </div>

        {isExpanded && (
          <div className="px-5 pb-5 animate-in fade-in slide-in-from-top-2">
            <div className="pt-2 border-t border-gray-100">
              <h4 className="text-xs font-semibold text-gray-400 uppercase tracking-wider mb-2">Bio</h4>
              <p className="text-sm text-gray-600 leading-relaxed mb-4 line-clamp-3">{data.bio}</p>
              
              <div className="flex flex-wrap gap-2 mb-6">
                {(data.skills ?? ["React", "Solidity"]).map((skill) => (
                  <span key={skill} className="px-2 py-1 bg-red-50 text-[#8B3A3A] text-xs font-medium rounded-md">
                    {skill}
                  </span>
                ))}
              </div>

              <div className="flex flex-col space-y-3">
                <button
                  onClick={() => requestSent ? onCancelRequest?.(data.id) : setIsModalOpen(true)}
                  className={`w-full flex items-center justify-center space-x-2 py-2.5 rounded-xl font-semibold transition-all ${
                    requestSent ? "bg-gray-100 text-gray-600 hover:bg-red-50 hover:text-red-600" : "bg-[#8B3A3A] text-white hover:bg-[#6b2d2d]"
                  }`}
                >
                  {requestSent ? <><XCircle size={18} /> <span>Cancel Request</span></> : <><UserPlus size={18} /> <span>Send Request</span></>}
                </button>
                <Link href={`/user-details/${data.id}`} className="w-full text-center text-sm font-medium text-gray-500 hover:text-[#8B3A3A] transition-colors">
                  View More Details
                </Link>
              </div>
            </div>
          </div>
        )}
      </div>

      {/* --- RESPONSIVE MODAL --- */}
      {isModalOpen && (
        <div className="fixed inset-0 z-[999] flex items-center justify-center p-4 bg-black/60 backdrop-blur-sm">
          <div className="bg-white w-full max-w-xl rounded-3xl shadow-2xl overflow-hidden animate-in zoom-in-95 duration-200">
            {/* Modal Header */}
            <div className="px-6 py-4 border-b border-gray-100 flex items-center justify-between bg-white sticky top-0">
              <div>
                <h2 className="text-xl font-bold text-gray-900">Request Mentorship</h2>
                <p className="flex flex-row  p-4 justify-center text-xs text-gray-500">Connecting with <span className='text-accent font-bold'>
                  {data.firstName} {data.lastName}
                  </span>
                  </p>
              </div>
              <button onClick={() => setIsModalOpen(false)} className="p-2 hover:bg-gray-100 rounded-full text-gray-400">
                <X size={20} />
              </button>
            </div>

            {/* Modal Body */}
            <div className="p-6 overflow-y-auto max-h-[70vh] space-y-5">
              {/* Field: Goal */}
              <div className="space-y-1.5">
                <label className="flex items-center gap-2 text-sm font-semibold text-gray-700">
                  Primary Goal
                </label>
                <input 
                  type="text"
                  name="goal"
                  placeholder="e.g. Code Review, Career Advice, Web3 Roadmap"
                  value={formData.goal}
                  onChange={handleInputChange}
                  className="w-full px-4 py-3 bg-gray-50 border border-gray-200 rounded-xl focus:ring-2 focus:ring-[#8B3A3A]/10 focus:border-[#8B3A3A] outline-none transition-all"
                />
              </div>

              {/* Field: Message */}
              <div className="space-y-1.5">
                <label className="flex items-center gap-2 text-sm font-semibold text-gray-700">
                  <MessageSquare size={16} className="text-[#8B3A3A]" /> Personal Message
                </label>
                <textarea 
                  name="message"
                  rows={4}
                  placeholder="Tell them a bit about yourself and why you're reaching out..."
                  value={formData.message}
                  onChange={handleInputChange}
                  className="w-full px-4 py-3 bg-gray-50 border border-gray-200 rounded-xl focus:ring-2 focus:ring-[#8B3A3A]/10 focus:border-[#8B3A3A] outline-none resize-none transition-all"
                />
              </div>
            </div>

            {/* Modal Footer */}
            <div className="p-6 bg-gray-50 border-t border-gray-100 flex flex-col sm:flex-row gap-3">
              <button 
                onClick={() => setIsModalOpen(false)}
                className="w-full sm:w-1/3 py-3 text-sm font-bold text-gray-500 hover:text-gray-700 transition-colors"
              >
                Cancel
              </button>
              <button 
                disabled={!formData.goal || !formData.message || isSubmitting}
                onClick={handleSend}
                className="w-full sm:w-2/3 py-3 active:scale-95 bg-[#8B3A3A] text-white rounded-xl font-bold flex items-center justify-center gap-2 hover:bg-[#6b2d2d] disabled:opacity-50 disabled:cursor-not-allowed transition-all shadow-lg shadow-[#8B3A3A]/20"
              >
                {isSubmitting ? "Sending..." : <> <Send size={18} /> Send Request</>}
              </button>
            </div>
          </div>
        </div>
      )}
    </>
  );
};