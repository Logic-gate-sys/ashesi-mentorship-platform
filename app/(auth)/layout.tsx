'use client'

import type { ReactNode } from 'react'
import Link from 'next/link'
import Image from 'next/image'
import bgImage from '@/comp&hooks/images/login-bg.png';

export default function AuthLayout({ children }: {children: ReactNode}) {
  return (
    <div className="flex min-h-screen w-full bg-white overflow-hidden">
      <div className="hidden rounded-r-[120px] lg:flex lg:w-[50%] relative overflow-hidden flex-col items-center justify-center px-12 py-20">
        {/* Background Image */}
        <Image
          src={bgImage}
          alt="Mentorship Background"
          fill
          className="object-cover"
          priority
          sizes="(max-width: 1024px) 0px, 50vw"
        />
        
        {/* Overlay - reddish/maroon tint */}
        <div className="absolute inset-0 bg-[rgba(146,61,65,0.75)]" />
        
        {/* Content */}
        <div className="relative z-10 w-full h-full flex flex-col items-center justify-center">
          {/* Spacer */}
          <div />

          {/* Main Content */}
          <div className="text-center max-w-sm">
            <h1
              className="text-4xl leading-tight text-white mb-6"
              style={{ fontFamily: "'Bree Serif', serif", fontWeight: 400 }}
            >
              Discover Your Path.
            </h1>
            <h2
              className="text-4xl leading-tight text-white mb-6"
              style={{ fontFamily: "'Bree Serif', serif", fontWeight: 400 }}
            >
              Welcome to Ashesi Mentorship!
            </h2>

            <p
              className="text-lg text-white mb-12 font-bold"
              style={{ fontFamily: "'Quicksand', sans-serif" }}
            >
              Connect with alumni and peers.
            </p>

            <p
              className="text-base text-white mb-6 font-bold"
              style={{ fontFamily: "'Quicksand', sans-serif" }}
            >
              Don&apos;t have an account
            </p>

            <Link
              href="/register"
              className="inline-block px-8 py-3 border-2 border-white text-white font-bold rounded-lg hover:bg-white hover:text-[#923D41] transition-all duration-300"
              style={{ fontFamily: "'Quicksand', sans-serif" }}
            >
              Create Account
            </Link>
          </div>

          {/* Spacer */}
          <div />
        </div>
      </div>

      <div className="w-full lg:w-[70%] flex flex-col items-center justify-center px-6 sm:px-16 py-12 
      sm:py-20 overflow-y-auto bg-white">
        {children}
      </div>
    </div>
  )
}