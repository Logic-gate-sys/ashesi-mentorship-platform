'use client'

import { useState, useEffect, useRef } from 'react'
import Link from 'next/link'
import { usePathname } from 'next/navigation'

export default function TermsPage() {
  const [scrolledToBottom, setScrolledToBottom] = useState(false)
  const contentRef = useRef<HTMLDivElement>(null)
  const pathname = usePathname()

  // Update topbar title based on route
  useEffect(() => {
    const title = pathname.includes('privacy') ? 'Privacy Policy' : 'Terms of Service'
    document.title = `${title} - AshesiConnect`
  }, [pathname])

  useEffect(() => {
    const handleScroll = () => {
      if (!contentRef.current) return
      
      const { scrollTop, scrollHeight, clientHeight } = contentRef.current
      
      // Check if user has scrolled to the bottom (within 100px threshold)
      if (scrollTop + clientHeight >= scrollHeight - 100) {
        setScrolledToBottom(true)
        // Save to localStorage so registration form can detect it
        if (typeof window !== 'undefined') {
          localStorage.setItem('terms_scrolled_to_bottom', 'true')
        }
      }
    }

    const element = contentRef.current
    if (element) {
      element.addEventListener('scroll', handleScroll)
      return () => element.removeEventListener('scroll', handleScroll)
    }
  }, [])

  return (
    <div 
      ref={contentRef}
      className="w-full bg-page"
    >
      <div className="max-w-4xl mx-auto px-6 py-16">
        <div className="prose prose-lg max-w-none">

          {/* Title Section */}
          <div className="mb-12">
            <h1 className="font-display font-bold text-[40px] text-brand tracking-tight leading-tight mb-3">
              Terms of Service
            </h1>
            <p className="font-body text-[16px] text-text-sub">Last updated: March 2026</p>
          </div>

          {/* 1. Introduction */}
          <section className="mb-12">
            <h2 className="font-display font-bold text-[28px] text-brand mb-4">1. Introduction</h2>
            <p className="font-body text-[16px] text-text-sub leading-relaxed mb-4">
              Welcome to AshesiConnect ("Platform," "we," "us," or "our"). These Terms of Service ("Terms") govern your use of our website, applications, and services related to mentorship connections between Ashesi University alumni and current students.
            </p>
            <p className="font-body text-[16px] text-text-sub leading-relaxed">
              By accessing, browsing, or using AshesiConnect, you agree to be bound by these Terms. If you do not agree to these Terms, please do not use the Platform.
            </p>
          </section>

          {/* 2. User Accounts */}
          <section className="mb-12">
            <h2 className="font-display font-bold text-[28px] text-brand mb-4">2. User Accounts and Registration</h2>
            <p className="font-body text-[16px] text-text-sub leading-relaxed mb-4">
              <strong>Account Creation:</strong> To use AshesiConnect, you must create an account by providing accurate, complete, and current information. You are responsible for maintaining the confidentiality of your password and account information.
            </p>
            <p className="font-body text-[16px] text-text-sub leading-relaxed mb-4">
              <strong>Eligibility:</strong> You represent that you are at least 18 years old and either a current student or alumnus/alumna of Ashesi University.
            </p>
            <p className="font-body text-[16px] text-text-sub leading-relaxed">
              <strong>Accuracy:</strong> You agree that all information you provide is true, accurate, and not misleading. We reserve the right to verify account information and may suspend or terminate accounts with false or fraudulent information.
            </p>
          </section>

          {/* 3. User Responsibilities */}
          <section className="mb-12">
            <h2 className="font-display font-bold text-[28px] text-brand mb-4">3. User Responsibilities and Conduct</h2>
            <p className="font-body text-[16px] text-text-sub leading-relaxed mb-4">
              You agree not to use the Platform to:
            </p>
            <ul className="space-y-3 mb-4">
              <li className="font-body text-[16px] text-text-sub leading-relaxed flex gap-3">
                <span className="text-brand font-bold">•</span>
                <span>Harass, threaten, defame, or abuse other users</span>
              </li>
              <li className="font-body text-[16px] text-text-sub leading-relaxed flex gap-3">
                <span className="text-brand font-bold">•</span>
                <span>Post obscene, offensive, or illegal content</span>
              </li>
              <li className="font-body text-[16px] text-text-sub leading-relaxed flex gap-3">
                <span className="text-brand font-bold">•</span>
                <span>Violate intellectual property rights or copyrights</span>
              </li>
              <li className="font-body text-[16px] text-text-sub leading-relaxed flex gap-3">
                <span className="text-brand font-bold">•</span>
                <span>Engage in unauthorized advertising or spam</span>
              </li>
              <li className="font-body text-[16px] text-text-sub leading-relaxed flex gap-3">
                <span className="text-brand font-bold">•</span>
                <span>Attempt to gain unauthorized access to the Platform or user data</span>
              </li>
              <li className="font-body text-[16px] text-text-sub leading-relaxed flex gap-3">
                <span className="text-brand font-bold">•</span>
                <span>Misrepresent your identity or credentials</span>
              </li>
            </ul>
          </section>

          {/* 4. Intellectual Property */}
          <section className="mb-12">
            <h2 className="font-display font-bold text-[28px] text-brand mb-4">4. Intellectual Property Rights</h2>
            <p className="font-body text-[16px] text-text-sub leading-relaxed mb-4">
              All content, features, and functionality on the Platform—including text, graphics, logos, and code—are the exclusive property of AshesiConnect or our licensors and are protected by copyright and other intellectual property laws.
            </p>
            <p className="font-body text-[16px] text-text-sub leading-relaxed">
              You may not reproduce, distribute, or transmit any content from the Platform without our express written permission. User-generated content (profiles, messages, etc.) remains your property, but you grant us a license to use, display, and distribute such content on the Platform.
            </p>
          </section>

          {/* 5. Mentorship Disclaimer */}
          <section className="mb-12">
            <h2 className="font-display font-bold text-[28px] text-brand mb-4">5. Mentorship Disclaimer</h2>
            <p className="font-body text-[16px] text-text-sub leading-relaxed mb-4">
              <strong>No Guarantee of Outcomes:</strong> We do not guarantee that mentorship connections will result in employment, advancement, or any specific outcome. Mentorship is a voluntary, informal relationship.
            </p>
            <p className="font-body text-[16px] text-text-sub leading-relaxed mb-4">
              <strong>No Professional Advice:</strong> Mentors are not providing professional, legal, financial, or medical advice. Users should consult qualified professionals for such guidance.
            </p>
            <p className="font-body text-[16px] text-text-sub leading-relaxed">
              <strong>User Responsibility:</strong> Each user is responsible for evaluating mentors and the mentorship relationship. AshesiConnect is not responsible for the conduct, reliability, or advice of mentors or students.
            </p>
          </section>

          {/* 6. Limitation of Liability */}
          <section className="mb-12">
            <h2 className="font-display font-bold text-[28px] text-brand mb-4">6. Limitation of Liability</h2>
            <p className="font-body text-[16px] text-text-sub leading-relaxed mb-4">
              TO THE MAXIMUM EXTENT PERMITTED BY LAW, ASHESICONNECT AND ITS OWNERS, EMPLOYEES, AND AGENTS SHALL NOT BE LIABLE FOR ANY INDIRECT, INCIDENTAL, SPECIAL, CONSEQUENTIAL, OR PUNITIVE DAMAGES ARISING FROM YOUR USE OF OR INABILITY TO USE THE PLATFORM.
            </p>
            <p className="font-body text-[16px] text-text-sub leading-relaxed">
              Our total liability to you for any claims arising from these Terms shall not exceed the amount you have paid to us, if any, in the 12 months preceding the claim.
            </p>
          </section>

          {/* 7. Termination */}
          <section className="mb-12">
            <h2 className="font-display font-bold text-[28px] text-brand mb-4">7. Termination of Service</h2>
            <p className="font-body text-[16px] text-text-sub leading-relaxed mb-4">
              We may terminate or suspend your account and access to the Platform immediately, without prior notice or liability, if you breach these Terms or engage in conduct we determine is inappropriate.
            </p>
            <p className="font-body text-[16px] text-text-sub leading-relaxed">
              Upon termination, your right to use the Platform ceases immediately. We may retain archived copies of your information as required by law.
            </p>
          </section>

          {/* 8. Modification of Terms */}
          <section className="mb-12">
            <h2 className="font-display font-bold text-[28px] text-brand mb-4">8. Modification of Terms</h2>
            <p className="font-body text-[16px] text-text-sub leading-relaxed">
              We reserve the right to modify these Terms at any time. Changes will be effective immediately upon posting to the Platform. Continued use of the Platform constitutes acceptance of modified Terms. We will notify users of material changes via email or prominent notice on the Platform.
            </p>
          </section>

          {/* 9. Dispute Resolution */}
          <section className="mb-12">
            <h2 className="font-display font-bold text-[28px] text-brand mb-4">9. Dispute Resolution</h2>
            <p className="font-body text-[16px] text-text-sub leading-relaxed mb-4">
              <strong>Governing Law:</strong> These Terms are governed by and construed in accordance with the laws of Ghana, without regard to its conflict of laws principles.
            </p>
            <p className="font-body text-[16px] text-text-sub leading-relaxed">
              <strong>Jurisdiction:</strong> Any legal action or proceeding arising under these Terms shall be brought exclusively in the courts of Ghana, and you consent to the personal jurisdiction of such courts.
            </p>
          </section>

          {/* 10. Contact */}
          <section className="mb-12">
            <h2 className="font-display font-bold text-[28px] text-brand mb-4">10. Contact Us</h2>
            <p className="font-body text-[16px] text-text-sub leading-relaxed mb-4">
              If you have questions about these Terms of Service, please contact us at:
            </p>
            <div className="bg-brand/5 border border-brand/20 rounded-[12px] p-6">
              <p className="font-body text-[15px] text-text font-medium mb-2">AshesiConnect Support</p>
              <p className="font-body text-[15px] text-text-sub">Email: support@ashesiconnect.com</p>
              <p className="font-body text-[15px] text-text-sub">Address: Ashesi University, Ghana</p>
            </div>
          </section>

          {/* Footer navigation */}
          <div className="mt-16 pt-8 border-t border-border flex gap-4">
            <button
              onClick={() => window.close()}
              className="btn btn-primary"
            >
              ← Back to registration
            </button>
            <Link href="/legal/privacy" className="btn btn-ghost">
              Read Privacy Policy →
            </Link>
            {scrolledToBottom && (
              <div className="ml-auto flex items-center gap-2 text-brand font-semibold">
                <span className="w-2 h-2 bg-brand rounded-full animate-pulse" />
                Marked as read
              </div>
            )}
          </div>

        </div>
      </div>
    </div>
  )
}
