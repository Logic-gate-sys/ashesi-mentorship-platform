// components/MentorView.js
"use client";
import { useState } from 'react';
import { UserPlus, XCircle, MapPin, Globe, Award, BookOpen, Clock } from 'lucide-react';

export  function MentorView({ user }) {
  const [requestStatus, setRequestStatus] = useState('none');

  return (
    <div className="grid grid-cols-1 lg:grid-cols-3 gap-8">
      {/* Left Column: Main Content */}
      <div className="lg:col-span-2 space-y-8">
        {/* Profile Header */}
        <div className="bg-white rounded-3xl p-8 border border-gray-100 shadow-sm">
          <div className="flex flex-col md:flex-row gap-6 items-center md:items-start">
            <div className="w-32 h-32 rounded-3xl bg-[#8B3A3A] flex items-center justify-center text-white text-4xl font-bold">
              KM
            </div>
            <div className="text-center md:text-left">
              <h1 className="text-3xl font-bold text-gray-900">{user.firstName} {user.lastName}</h1>
              <p className="text-gray-500 flex items-center justify-center md:justify-start gap-2 mt-1">
                <MapPin size={16} /> Accra, Ghana • Ashesi University
              </p>
              <div className="flex flex-wrap gap-2 mt-4 justify-center md:justify-start">
                {['Solidity', 'Next.js', 'Web3'].map(tag => (
                  <span key={tag} className="px-3 py-1 bg-gray-100 text-gray-600 rounded-full text-xs font-medium">
                    #{tag}
                  </span>
                ))}
              </div>
            </div>
          </div>
        </div>

        {/* Detailed Sections */}
        <div className="bg-white rounded-3xl p-8 border border-gray-100 shadow-sm space-y-8">
          <section>
            <h2 className="text-xl font-bold text-gray-900 mb-4 flex items-center gap-2">
              <BookOpen className="text-[#8B3A3A]" size={20} /> Professional Bio
            </h2>
            <p className="text-gray-600 leading-relaxed">
              Full-Stack Web and Web3 Developer with a focus on decentralized finance (DeFi). 
              Currently researching Account Abstraction (ERC-4337) to simplify blockchain onboarding 
              for mobile money users. I enjoy breaking down complex low-level concepts for peers.
            </p>
          </section>

          <section>
            <h2 className="text-xl font-bold text-gray-900 mb-4 flex items-center gap-2">
              <Award className="text-[#8B3A3A]" size={20} /> Mentorship Areas
            </h2>
            <ul className="grid grid-cols-1 md:grid-cols-2 gap-3 text-gray-600">
              <li className="flex items-center gap-2">✓ Smart Contract Auditing</li>
              <li className="flex items-center gap-2">✓ React & TypeScript Architecture</li>
              <li className="flex items-center gap-2">✓ Career Pathing in Web3</li>
              <li className="flex items-center gap-2">✓ Academic Excellence in CS</li>
            </ul>
          </section>
        </div>
      </div>

      {/* Right Column: Sticky Sidebar Actions */}
      <div className="lg:col-span-1 space-y-6">
        <div className="bg-white rounded-3xl p-6 border border-gray-100 shadow-sm sticky top-6">
          <h3 className="font-bold text-gray-900 mb-4">Mentorship Status</h3>
          
          <div className="space-y-4 mb-6">
            <div className="flex justify-between text-sm">
              <span className="text-gray-500 flex items-center gap-2"><Clock size={14}/> Response Time</span>
              <span className="font-medium text-gray-900">~24 hours</span>
            </div>
            <div className="flex justify-between text-sm">
              <span className="text-gray-500 flex items-center gap-2"><Globe size={14}/> Languages</span>
              <span className="font-medium text-gray-900">English, Twi, Spanish</span>
            </div>
          </div>

          <button
            onClick={() => setRequestStatus(requestStatus === 'none' ? 'pending' : 'none')}
            className={`w-full py-4 rounded-2xl font-bold transition-all flex items-center justify-center gap-2 ${
              requestStatus === 'pending'
                ? "bg-red-50 text-red-600 border border-red-100 hover:bg-red-100"
                : "bg-[#8B3A3A] text-white shadow-lg shadow-red-900/20 hover:bg-[#6b2d2d]"
            }`}
          >
            {requestStatus === 'pending' ? (
              <><XCircle size={20} /> Cancel Request</>
            ) : (
              <><UserPlus size={20} /> Request to Connect</>
            )}
          </button>
          
          <p className="text-[10px] text-gray-400 text-center mt-4 uppercase tracking-widest font-semibold">
            Member Since 2024
          </p>
        </div>
      </div>
    </div>
  );
}