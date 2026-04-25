// components/MenteeView.js
"use client";
import React from 'react';
import {  Target,  BookOpen,  Code2,  MessageSquare,  Calendar,  ExternalLink, GraduationCap,Circle} from 'lucide-react';

export  function MenteeView({ user }) {
  const handleMessage = () => console.log("Opening chat...");

  return (
    <div className="grid grid-cols-1 lg:grid-cols-3 gap-8">
      {/* Left Column: Learning & Projects */}
      <div className="lg:col-span-2 space-y-6">
        
        {/* Profile Header Card */}
        <div className="bg-white rounded-3xl p-8 border border-gray-100 shadow-sm">
          <div className="flex flex-col md:flex-row gap-6 items-center md:items-start">
            <div className="w-28 h-28 rounded-3xl bg-[#8B3A3A] flex items-center justify-center text-white text-3xl font-bold shadow-sm">
              {user.firstName[0]}{user.lastName[0]}
            </div>
            <div className="text-center md:text-left flex-1">
              <div className="flex flex-col md:flex-row md:items-center justify-between gap-4">
                <div>
                  <h1 className="text-3xl font-bold text-gray-900">{user.firstName} {user.lastName}</h1>
                  <p className="text-[#8B3A3A] font-semibold flex items-center justify-center md:justify-start gap-2 mt-1">
                    <GraduationCap size={18} /> Computer Science • Class of 2029
                  </p>
                </div>
                <button 
                  onClick={handleMessage}
                  className="bg-gray-900 text-white px-5 py-2.5 rounded-xl font-bold text-sm hover:bg-gray-800 transition-all flex items-center gap-2 justify-center"
                >
                  <MessageSquare size={16} /> Send Message
                </button>
              </div>
            </div>
          </div>
        </div>

        {/* Learning Roadmap / Goals */}
        <div className="bg-white rounded-3xl p-8 border border-gray-100 shadow-sm">
          <h2 className="text-xl font-bold text-gray-900 mb-6 flex items-center gap-2">
            <Target className="text-[#8B3A3A]" size={22} /> Learning Roadmap
          </h2>
          <div className="space-y-6">
            <div>
              <div className="flex justify-between mb-2">
                <span className="text-sm font-bold text-gray-700">Full-Stack Development</span>
                <span className="text-sm font-medium text-[#8B3A3A]">70%</span>
              </div>
              {/* Progress bar using brand color */}
              <div className="w-full bg-gray-100 rounded-full h-2.5">
                <div className="bg-[#8B3A3A] h-2.5 rounded-full" style={{ width: '70%' }}></div>
              </div>
            </div>
            
            <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
              <div className="p-4 rounded-2xl bg-stone-50 border border-stone-200">
                <h4 className="font-bold text-gray-900 text-sm mb-1 italic">Current Focus</h4>
                <p className="text-sm text-gray-600">Mastering TypeScript and Next.js API routes.</p>
              </div>
              <div className="p-4 rounded-2xl bg-stone-50 border border-stone-200">
                <h4 className="font-bold text-gray-900 text-sm mb-1 italic">Completed</h4>
                <p className="text-sm text-gray-600">Python Basics & Data Structures 101.</p>
              </div>
            </div>
          </div>
        </div>

        {/* Projects Section */}
        <div className="bg-white rounded-3xl p-8 border border-gray-100 shadow-sm">
          <h2 className="text-xl font-bold text-gray-900 mb-6 flex items-center gap-2">
            <Code2 className="text-[#8B3A3A]" size={22} /> Featured Projects
          </h2>
          <div className="grid grid-cols-1 gap-4">
            <div className="group p-5 border border-gray-100 rounded-2xl hover:border-[#8B3A3A]/30 hover:bg-[#8B3A3A]/5 transition-all">
              <div className="flex justify-between items-start">
                <div>
                  <h3 className="font-bold text-gray-900 group-hover:text-[#8B3A3A] transition-colors">Personal Portfolio</h3>
                  <p className="text-sm text-gray-500 mt-1">Built using Next.js and Tailwind CSS.</p>
                </div>
                <ExternalLink size={16} className="text-gray-400 group-hover:text-[#8B3A3A]" />
              </div>
            </div>
          </div>
        </div>
      </div>

      {/* Right Column: Status & Commitment */}
      <div className="lg:col-span-1 space-y-6">
        <div className="bg-white rounded-3xl p-6 border border-gray-100 shadow-sm sticky top-6">
          <h3 className="font-bold text-gray-900 mb-4">Availability</h3>
          
          <div className="space-y-4 mb-6 text-sm">
            <div className="flex justify-between">
              <span className="text-gray-500 flex items-center gap-2"><Calendar size={14}/> Weekly Commitment</span>
              <span className="font-medium text-gray-900">5-10 hrs</span>
            </div>
            <div className="flex justify-between">
              <span className="text-gray-500 flex items-center gap-2"><BookOpen size={14}/> Preferred Learning</span>
              <span className="font-medium text-gray-900">Project-based</span>
            </div>
          </div>

          <div className="p-4 bg-stone-50 rounded-2xl border border-stone-100 mb-6">
            <h4 className="text-[10px] font-bold text-gray-400 uppercase mb-3 tracking-widest">Top Interests</h4>
            <div className="flex flex-wrap gap-2">
              {['Fintech', 'SaaS', 'Open Source'].map(interest => (
                <span key={interest} className="px-2.5 py-1 bg-white text-gray-700 text-[10px] font-bold rounded-md border border-gray-200 uppercase">
                  {interest}
                </span>
              ))}
            </div>
          </div>

          <button className="w-full py-3 bg-white border-2 border-[#8B3A3A] text-[#8B3A3A] rounded-xl font-bold hover:bg-[#8B3A3A] hover:text-white transition-all shadow-sm">
            Invite to Group
          </button>
        </div>
      </div>
    </div>
  );
}