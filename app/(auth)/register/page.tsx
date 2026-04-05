'use client'

import Link from 'next/link'

export default function RegisterChoicePage() {
  return (
    <div className="w-full max-w-md">
      {/* Heading */}
      <h2
        className="text-3xl text-center mb-4 text-[#181821]"
        style={{ fontFamily: "'Bree Serif', serif", fontWeight: 400 }}
      >
        Create Your Account
      </h2>

      <p
        className="text-center text-sm text-[#666] mb-12"
        style={{ fontFamily: "'Quicksand', sans-serif" }}
      >
        Choose how you'd like to join us
      </p>

      {/* Student Registration Card */}
      <Link
        href="/register/student"
        className="block mb-6 p-6 border-2 border-[#D1D5DB] rounded-lg hover:border-[#923D41] hover:bg-[#FAF8F8] transition-all group"
      >
        <div className="flex items-start gap-4">
          <div className="flex-shrink-0 w-12 h-12 bg-[#923D41] text-white rounded-lg flex items-center justify-center group-hover:bg-[#7B1427] transition-all">
            <svg className="w-6 h-6" fill="none" stroke="currentColor" viewBox="0 0 24 24">
              <path
                strokeLinecap="round"
                strokeLinejoin="round"
                strokeWidth={2}
                d="M12 14l9-5-9-5-9 5m0 7l9 5 9-5m0 7l-9 5-9-5"
              />
            </svg>
          </div>
          <div className="flex-1">
            <h3
              className="text-lg font-bold text-[#181821] mb-2"
              style={{ fontFamily: "'Bree Serif', serif" }}
            >
              Student
            </h3>
            <p
              className="text-sm text-[#666]"
              style={{ fontFamily: "'Quicksand', sans-serif" }}
            >
              Get matched with experienced mentors and grow your career
            </p>
          </div>
        </div>
      </Link>

      {/* Alumni Registration Card */}
      <Link
        href="/register/alumni"
        className="block mb-8 p-6 border-2 border-[#D1D5DB] rounded-lg hover:border-[#923D41] hover:bg-[#FAF8F8] transition-all group"
      >
        <div className="flex items-start gap-4">
          <div className="flex-shrink-0 w-12 h-12 bg-[#923D41] text-white rounded-lg flex items-center justify-center group-hover:bg-[#7B1427] transition-all">
            <svg className="w-6 h-6" fill="none" stroke="currentColor" viewBox="0 0 24 24">
              <path
                strokeLinecap="round"
                strokeLinejoin="round"
                strokeWidth={2}
                d="M13 10V3L4 14h7v7l9-11h-7z"
              />
            </svg>
          </div>
          <div className="flex-1">
            <h3
              className="text-lg font-bold text-[#181821] mb-2"
              style={{ fontFamily: "'Bree Serif', serif" }}
            >
              Alumni / Mentor
            </h3>
            <p
              className="text-sm text-[#666]"
              style={{ fontFamily: "'Quicksand', sans-serif" }}
            >
              Share your experience and mentor the next generation
            </p>
          </div>
        </div>
      </Link>

      {/* Login Link */}
      <p
        className="text-center text-xs text-[#666]"
        style={{ fontFamily: "'Quicksand', sans-serif" }}
      >
        Already have an account?{' '}
        <Link
          href="/login"
          className="font-bold text-[#923D41] hover:text-[#7B1427]"
        >
          Log in here
        </Link>
      </p>
    </div>
  )
}
