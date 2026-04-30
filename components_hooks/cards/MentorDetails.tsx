'use client'
import React, { useState } from 'react';
import { ChevronDown, ChevronUp, UserPlus, XCircle, X, Send, MessageSquare } from 'lucide-react';
import Link from 'next/link';
import { useMentorshipCycle } from '#comp-hooks/hooks/shared/useMentorshipCycle';
import { useMenteeRequests } from '#comp-hooks/hooks/mentee/useRequest';

interface MentorDetailProp {
  id: string;
  firstName: string;
  lastName: string;
  graduationYear: string;
  company: string;
  skills?: string[];
  bio: string;
  onCancelRequest?: (requestId: string) => Promise<unknown>;
  requestSent?: boolean;
}

export const MentorDetailCard = ({ requestSent, onCancelRequest, ...data }: MentorDetailProp) => {
  const [isExpanded, setIsExpanded] = useState(true);
  const [isModalOpen, setIsModalOpen] = useState(false);
  const [isSubmitting, setIsSubmitting] = useState(false);
  const { sendRequest } = useMenteeRequests();
  const { getCurrentCycle } = useMentorshipCycle();

  const [formData, setFormData] = useState({ goal: '', message: '' });

  const handleInputChange = (e: React.ChangeEvent<HTMLInputElement | HTMLTextAreaElement | HTMLSelectElement>) => {
    const { name, value } = e.target;
    setFormData(prev => ({ ...prev, [name]: value }));
  };

  const handleSend = async () => {
    if (!formData.goal || !formData.message) return;
    setIsSubmitting(true);
    try {
      const cycle = await getCurrentCycle();
      await sendRequest({ mentorId: data.id, cycleId: cycle?.id, goal: formData.goal, message: formData.message });
      setIsModalOpen(false);
      setFormData({ goal: '', message: '' });
    } catch (error) {
      console.error("Submission failed", error);
    } finally {
      setIsSubmitting(false);
    }
  };

  return (
    <>
      <div className="w-full bg-white border border-gray-200 rounded-2xl shadow-sm overflow-hidden transition-all duration-300">

        {/* Header */}
        <div className="flex items-center justify-between gap-3 p-4 sm:p-5">
          <div className="flex items-center gap-3 min-w-0">
            <div className="shrink-0 w-12 h-12 sm:w-14 sm:h-14 rounded-full bg-red-50 flex items-center justify-center border-2 border-[#8B3A3A] text-sm font-bold text-[#8B3A3A]">
              {data.firstName[0]}{data.lastName[0]}
            </div>
            <div className="min-w-0">
              <h3 className="text-base sm:text-lg font-bold text-gray-900 truncate">
                {data.firstName} {data.lastName}
              </h3>
              <p className="text-xs sm:text-sm text-gray-500 truncate">
                {data.company} · Class of {data.graduationYear}
              </p>
            </div>
          </div>
          <button
            onClick={() => setIsExpanded(!isExpanded)}
            className="shrink-0 p-1.5 hover:bg-gray-100 rounded-full transition-colors text-gray-400"
            aria-label={isExpanded ? "Collapse" : "Expand"}
          >
            {isExpanded ? <ChevronUp size={18} /> : <ChevronDown size={18} />}
          </button>
        </div>

        {/* Expandable body */}
        {isExpanded && (
          <div className="px-4 pb-4 sm:px-5 sm:pb-5 animate-in fade-in slide-in-from-top-2">
            <div className="pt-4 border-t border-gray-100 space-y-4">

              {/* Bio */}
              <div>
                <p className="text-xs font-semibold text-gray-400 uppercase tracking-wider mb-1.5">Bio</p>
                <p className="text-sm text-gray-600 leading-relaxed line-clamp-3">{data.bio}</p>
              </div>

              {/* Skills */}
              {(data.skills ?? []).length > 0 && (
                <div className="flex flex-wrap gap-1.5">
                  {(data.skills ?? []).map((skill) => (
                    <span key={skill} className="px-2.5 py-1 bg-red-50 text-[#8B3A3A] text-xs font-medium rounded-lg">
                      {skill}
                    </span>
                  ))}
                </div>
              )}

              {/* Actions */}
              <div className="flex flex-col sm:flex-row items-stretch sm:items-center gap-2 pt-1">
                <button
                  onClick={() => requestSent ? onCancelRequest?.(data.id) : setIsModalOpen(true)}
                  className={`flex-1 flex items-center justify-center gap-2 py-2.5 rounded-xl text-sm font-semibold transition-all ${
                    requestSent
                      ? "bg-gray-100 text-gray-600 hover:bg-red-50 hover:text-red-600"
                      : "bg-[#8B3A3A] text-white hover:bg-[#6b2d2d]"
                  }`}
                >
                  {requestSent
                    ? <><XCircle size={16} /><span>Cancel Request</span></>
                    : <><UserPlus size={16} /><span>Send Request</span></>}
                </button>
                <Link
                  href={`/user-details/${data.id}`}
                  className="flex-1 sm:flex-none text-center text-sm font-medium text-gray-500 hover:text-[#8B3A3A] py-2.5 sm:py-0 transition-colors"
                >
                  View Details
                </Link>
              </div>

            </div>
          </div>
        )}
      </div>

      {/* Modal */}
      {isModalOpen && (
        <div className="fixed inset-0 z-[999] flex items-end sm:items-center justify-center bg-black/60 backdrop-blur-sm">
          <div className="bg-white w-full sm:max-w-lg sm:rounded-3xl rounded-t-3xl shadow-2xl overflow-hidden animate-in slide-in-from-bottom-4 sm:zoom-in-95 duration-200">

            {/* Modal Header */}
            <div className="flex items-start justify-between gap-3 px-5 py-4 border-b border-gray-100">
              <div>
                <h2 className="text-lg font-bold text-gray-900">Request Mentorship</h2>
                <p className="text-xs text-gray-500 mt-0.5">
                  Connecting with{" "}
                  <span className="text-[#8B3A3A] font-semibold">
                    {data.firstName} {data.lastName}
                  </span>
                </p>
              </div>
              <button
                onClick={() => setIsModalOpen(false)}
                className="shrink-0 p-1.5 hover:bg-gray-100 rounded-full text-gray-400 transition-colors"
              >
                <X size={18} />
              </button>
            </div>

            {/* Modal Body */}
            <div className="px-5 py-5 space-y-4 overflow-y-auto max-h-[55vh] sm:max-h-[60vh]">
              <div className="space-y-1.5">
                <label className="text-sm font-semibold text-gray-700">Primary Goal</label>
                <input
                  type="text"
                  name="goal"
                  placeholder="e.g. Code Review, Career Advice, Web3 Roadmap"
                  value={formData.goal}
                  onChange={handleInputChange}
                  className="w-full px-4 py-3 bg-gray-700 border border-gray-200 rounded-xl text-sm focus:ring-2 focus:ring-[#8B3A3A]/10 focus:border-[#8B3A3A] outline-none transition-all"
                />
              </div>

              <div className="space-y-1.5">
                <label className="flex items-center gap-1.5 text-sm font-semibold text-gray-700">
                  <MessageSquare size={14} className="text-[#8B3A3A]" />
                  Personal Message
                </label>
                <textarea
                  name="message"
                  rows={4}
                  placeholder="Tell them a bit about yourself and why you're reaching out..."
                  value={formData.message}
                  onChange={handleInputChange}
                  className="w-full text-gray-700 px-4 py-3 bg-gray-50 border border-gray-200 rounded-xl text-sm focus:ring-2 focus:ring-[#8B3A3A]/10 focus:border-[#8B3A3A] outline-none resize-none transition-all"
                />
              </div>
            </div>

            {/* Modal Footer */}
            <div className="flex gap-2 px-5 py-4 border-t border-gray-100 bg-gray-50">
              <button
                onClick={() => setIsModalOpen(false)}
                className="w-1/3 py-3 text-sm font-semibold text-gray-500 hover:text-gray-700 rounded-xl hover:bg-gray-100 transition-colors"
              >
                Cancel
              </button>
              <button
                disabled={!formData.goal || !formData.message || isSubmitting}
                onClick={handleSend}
                className="w-2/3 py-3 bg-[#8B3A3A] text-white rounded-xl text-sm font-bold flex items-center justify-center gap-2 hover:bg-[#6b2d2d] active:scale-95 disabled:opacity-50 disabled:cursor-not-allowed transition-all shadow-md shadow-[#8B3A3A]/20"
              >
                {isSubmitting ? "Sending…" : <><Send size={15} /> Send Request</>}
              </button>
            </div>

          </div>
        </div>
      )}
    </>
  );
};