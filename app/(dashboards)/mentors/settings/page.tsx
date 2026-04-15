"use client";

import React from 'react';
import { Edit2, CheckCircle2, Mail, MapPin, Briefcase, GraduationCap, Calendar } from 'lucide-react';

/**
 * PROFILE SETTINGS VIEW
 * Organized for the Ashesi Mentor Portal
 */

export default function ProfileSettings() {
  return (
    <div className="flex-1 p-10 overflow-y-auto no-scrollbar rounded-tl-[60px] ml-[-60px] ">
      {/* --- PAGE HEADER --- */}
      <header className="mb-10">
        <h1 className="text-3xl font-serif font-bold text-[#241919]">
          Profile Settings: <span className="text-[#6A0A1D]">Kwame Mensah (Alumni Mentor)</span>
        </h1>
      </header>

      {/* --- GRID LAYOUT --- */}
      <div className="grid grid-cols-12 gap-8 items-start">
        
        {/* TOP LEFT: BASIC INFO CARD */}
        <div className="col-span-5 bg-[#F3E8E8]/30 rounded-[40px] p-8 border border-[#6A0A1D]/5">
          <div className="flex items-start justify-between mb-8">
            <div className="flex gap-6">
              <div className="w-32 h-32 bg-[#241919] rounded-[30px] flex items-center justify-center overflow-hidden border-4 border-white shadow-sm">
                {/* Silhouette or Profile Image */}
                <img src="/api/placeholder/128/128" alt="Profile" className="opacity-40 grayscale" />
              </div>
              <div className="pt-2">
                <h2 className="text-2xl font-bold text-[#6A0A1D]">Kwame Mensah</h2>
                <p className="text-sm text-gray-500 mb-4">kwame.mensah@alumninetwork.edu</p>
                <span className="px-4 py-1.5 bg-[#FDCBCB] text-[#6A0A1D] text-[10px] font-bold uppercase rounded-full tracking-widest">
                  Senior Mentor
                </span>
              </div>
            </div>
            <button className="p-2 text-[#6A0A1D] hover:bg-white rounded-full transition-colors"><Edit2 size={18} /></button>
          </div>
          <div className="grid grid-cols-2 gap-4 border-t border-[#6A0A1D]/10 pt-6">
            <div>
              <p className="text-[10px] font-bold text-gray-400 uppercase tracking-widest mb-1">Last Login</p>
              <p className="text-sm font-bold text-[#241919]">Today, 09:42 AM</p>
            </div>
            <div>
              <p className="text-[10px] font-bold text-gray-400 uppercase tracking-widest mb-1">Profile Updated</p>
              <p className="text-sm font-bold text-[#241919]">Jan 12, 2024</p>
            </div>
          </div>
        </div>

        {/* TOP RIGHT: BIO CARD */}
        <div className="col-span-7 bg-[#F3E8E8]/30 rounded-[40px] p-10 h-full border border-[#6A0A1D]/5">
          <div className="flex justify-between items-center mb-6">
            <h3 className="text-xl font-bold text-[#241919]">My Story: Alumni Bio</h3>
            <button className="flex items-center gap-2 px-4 py-2 bg-white rounded-xl text-[10px] font-bold text-[#241919] border border-gray-100 shadow-sm uppercase tracking-widest">
              <Edit2 size={12} /> Edit Story
            </button>
          </div>
          <p className="text-base text-gray-600 leading-relaxed font-medium">
            A passionate engineer with a journey that began at Ashesi. I'm dedicated to helping the next generation and enthusiasts guidance and educational to environmental concerns about in next generation, is for student-interest reading.
          </p>
        </div>

        {/* MIDDLE LEFT: PHILOSOPHY & INTERESTS */}
        <div className="col-span-5 bg-[#F3E8E8]/30 rounded-[40px] p-10 border border-[#6A0A1D]/5 space-y-8">
          <div className="flex justify-between items-center">
            <h3 className="text-xl font-bold text-[#241919]">Mentorship Philosophy & Interests</h3>
            <button className="p-2 text-[#6A0A1D] bg-white rounded-lg shadow-sm"><Edit2 size={14} /></button>
          </div>

          <div>
            <p className="text-[11px] font-bold text-gray-400 uppercase tracking-[0.15em] mb-4">Career Industries</p>
            <div className="flex flex-wrap gap-2">
              {['Telecom', 'Engineering', 'IT', 'Software Development'].map(tag => (
                <span key={tag} className="px-5 py-2 bg-white rounded-full text-xs font-bold text-[#241919] border border-gray-100">
                  {tag}
                </span>
              ))}
            </div>
          </div>

          <div>
            <p className="text-[11px] font-bold text-gray-400 uppercase tracking-[0.15em] mb-4">Career Goals</p>
            <div className="flex flex-wrap gap-2">
              {['Career Transitions', 'System Design', 'editable'].map(tag => (
                <span key={tag} className="px-5 py-2 bg-white rounded-full text-xs font-bold text-[#241919] border border-gray-100">
                  {tag}
                </span>
              ))}
            </div>
          </div>

          <div className="pt-6 border-t border-[#6A0A1D]/10">
            <p className="text-[11px] font-bold text-gray-400 uppercase tracking-[0.15em] mb-4">My Mentorship Style</p>
            <div className="bg-white p-6 rounded-2xl italic text-sm text-gray-600 leading-relaxed border border-white shadow-sm">
              "I believe in practical guidance and real-world projects. I offer structured check-ins, and active access to enhances and connection to real world material."
            </div>
          </div>
        </div>

        {/* MIDDLE CENTER: PROFESSIONAL DETAILS */}
        <div className="col-span-4 bg-[#F3E8E8]/30 rounded-[40px] p-10 border border-[#6A0A1D]/5">
          <h3 className="text-xl font-bold text-[#241919] mb-8 leading-tight">Professional Details & Experience</h3>
          
          <div className="bg-white/60 p-6 rounded-3xl border border-white shadow-sm">
            <div className="flex justify-between items-start mb-4">
              <h4 className="text-sm font-bold text-[#241919]">Career History & Key Projects</h4>
              <button className="text-[9px] font-bold uppercase tracking-widest text-[#6A0A1D] bg-[#6A0A1D]/5 px-3 py-1.5 rounded-lg border border-[#6A0A1D]/10">Edit Details</button>
            </div>
            
            <div className="space-y-4">
              <div className="text-sm">
                <p className="text-gray-400">Company: <span className="font-bold text-[#241919]">MTN Ghana</span></p>
                <p className="text-gray-400">Job Title: <span className="font-bold text-[#241919]">Senior Network Engineer</span></p>
              </div>

              <div className="pt-4 border-t border-gray-100">
                <p className="text-[10px] font-bold text-[#6A0A1D] uppercase mb-2">Key Professional Projects:</p>
                <ul className="text-xs text-gray-600 space-y-2 list-disc pl-4">
                  <li>Project: Submarine Cable Landing</li>
                  <li>Project: Comprehensive Development</li>
                  <li>Project: Serious Professionals Development</li>
                </ul>
              </div>

              <div className="pt-4 border-t border-gray-100">
                <p className="text-[10px] font-bold text-[#6A0A1D] uppercase mb-2">Career Highlights:</p>
                <ul className="text-xs text-gray-600 space-y-2 list-disc pl-4">
                  <li>Highlight: IEEE Africa Innovation Award</li>
                  <li>Highlight: IEEE Africa Innovation Award</li>
                </ul>
              </div>
            </div>
          </div>
        </div>

        {/* RIGHT COLUMN: PERSONAL & ACCOUNT LOG */}
        <div className="col-span-3 flex flex-col gap-8">
          
          {/* PERSONAL DETAILS */}
          <div className="bg-[#F3E8E8]/30 rounded-[40px] p-8 border border-[#6A0A1D]/5">
            <div className="flex justify-between items-center mb-6">
              <h3 className="text-lg font-bold text-[#241919]">Personal Details</h3>
              <button className="p-2 text-[#6A0A1D] bg-white rounded-lg"><Edit2 size={12} /></button>
            </div>
            <div className="grid grid-cols-2 gap-y-6 gap-x-2">
              <DetailItem label="Phone Number" value="**********" />
              <DetailItem label="Location" value="Accra, Ghana" />
              <DetailItem label="Major/Dept" value="Engineering" isTag />
              <DetailItem label="Year of Graduation" value="2005" isTag />
            </div>
          </div>

          {/* VERIFICATION & ACCOUNT LOG */}
          <div className="bg-[#F3E8E8]/30 rounded-[40px] p-8 border border-[#6A0A1D]/5">
            <h3 className="text-lg font-bold text-[#241919] mb-6">Verification Status & Account Log</h3>
            <div className="space-y-5">
              <div className="flex justify-between items-center text-xs">
                <span className="text-gray-500 font-medium">Grads Year Year Verified</span>
                <span className="flex items-center gap-1.5 font-bold text-green-600">Status: <CheckCircle2 size={14} className="fill-green-600 text-white" /> Yes</span>
              </div>
              <div className="flex justify-between items-center text-xs">
                <span className="text-gray-500 font-medium">ID Verified</span>
                <span className="flex items-center gap-1.5 font-bold text-green-600">Status: <CheckCircle2 size={14} className="fill-green-600 text-white" /> Yes</span>
              </div>
              <div className="flex justify-between items-center text-xs pt-4 border-t border-[#6A0A1D]/10">
                <span className="text-gray-500 font-medium">Account Created</span>
                <span className="font-bold text-[#241919]">Date: "2022-09-01"</span>
              </div>
            </div>
          </div>

        </div>

      </div>
    </div>
  );
}

// Helper component for uniform labels
function DetailItem({ label, value, isTag }: { label: string, value: string, isTag?: boolean }) {
  return (
    <div>
      <p className="text-[9px] font-bold text-gray-400 uppercase tracking-widest mb-1.5">{label}</p>
      {isTag ? (
        <span className="inline-block px-4 py-1.5 bg-white border border-gray-100 rounded-full text-xs font-bold text-[#241919]">
          {value}
        </span>
      ) : (
        <p className="text-sm font-bold text-[#241919]">{value}</p>
      )}
    </div>
  );
}