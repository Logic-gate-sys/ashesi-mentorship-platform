'use client'

import { useState, useEffect, useRef } from 'react'
import Link from 'next/link'

export default function PrivacyPage() {
  const [scrolledToBottom, setScrolledToBottom] = useState(false)
  const contentRef = useRef<HTMLDivElement>(null)

  useEffect(() => {
    const handleScroll = () => {
      if (!contentRef.current) return
      
      const { scrollTop, scrollHeight, clientHeight } = contentRef.current
      
      // Check if user has scrolled to the bottom (within 100px threshold)
      if (scrollTop + clientHeight >= scrollHeight - 100) {
        setScrolledToBottom(true)
        // Save to localStorage so registration form can detect it
        if (typeof window !== 'undefined') {
          localStorage.setItem('privacy_scrolled_to_bottom', 'true')
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
              Privacy Policy
            </h1>
            <p className="font-body text-[16px] text-text-sub">Last updated: March 2026</p>
          </div>

          {/* 1. Introduction */}
          <section className="mb-12">
            <h2 className="font-display font-bold text-[28px] text-brand mb-4">1. Introduction</h2>
            <p className="font-body text-[16px] text-text-sub leading-relaxed mb-4">
              AshesiConnect ("we," "us," "our," or "Company") is committed to protecting your privacy. This Privacy Policy explains how we collect, use, disclose, and safeguard your information when you use our website and mobile applications (collectively, the "Platform").
            </p>
            <p className="font-body text-[16px] text-text-sub leading-relaxed">
              Please read this Privacy Policy carefully. If you do not agree with our policies and practices, please do not use the Platform.
            </p>
          </section>

          {/* 2. Information We Collect */}
          <section className="mb-12">
            <h2 className="font-display font-bold text-[28px] text-brand mb-4">2. Information We Collect</h2>
            
            <h3 className="font-display font-semibold text-[20px] text-text mb-3 mt-6">A. Information You Provide</h3>
            <p className="font-body text-[16px] text-text-sub leading-relaxed mb-4">
              <strong>Registration Information:</strong> When you create an account, we collect your name, email address, password, academic major, graduation year (for alumni), and other profile information you choose to share.
            </p>
            <p className="font-body text-[16px] text-text-sub leading-relaxed mb-4">
              <strong>Profile Content:</strong> Any information you voluntarily add to your profile, including bio, skills, interests, professional links, and profile photos.
            </p>
            <p className="font-body text-[16px] text-text-sub leading-relaxed">
              <strong>Communication Data:</strong> Messages, session notes, and feedback you exchange with mentors or mentees on the Platform.
            </p>

            <h3 className="font-display font-semibold text-[20px] text-text mb-3 mt-6">B. Information Collected Automatically</h3>
            <p className="font-body text-[16px] text-text-sub leading-relaxed mb-4">
              <strong>Log Data:</strong> When you access the Platform, we automatically record information such as your IP address, browser type, operating system, referring URL, and timestamps of your activities.
            </p>
            <p className="font-body text-[16px] text-text-sub leading-relaxed">
              <strong>Cookies and Tracking Technologies:</strong> We use cookies, local storage, and similar tracking technologies to enhance your experience and understand how you use the Platform.
            </p>
          </section>

          {/* 3. How We Use Information */}
          <section className="mb-12">
            <h2 className="font-display font-bold text-[28px] text-brand mb-4">3. How We Use Your Information</h2>
            <p className="font-body text-[16px] text-text-sub leading-relaxed mb-4">
              We use the information we collect to:
            </p>
            <ul className="space-y-3 mb-4">
              <li className="font-body text-[16px] text-text-sub leading-relaxed flex gap-3">
                <span className="text-brand font-bold">•</span>
                <span>Provide, maintain, and improve the Platform</span>
              </li>
              <li className="font-body text-[16px] text-text-sub leading-relaxed flex gap-3">
                <span className="text-brand font-bold">•</span>
                <span>Facilitate mentorship connections and communications</span>
              </li>
              <li className="font-body text-[16px] text-text-sub leading-relaxed flex gap-3">
                <span className="text-brand font-bold">•</span>
                <span>Send service-related announcements and updates</span>
              </li>
              <li className="font-body text-[16px] text-text-sub leading-relaxed flex gap-3">
                <span className="text-brand font-bold">•</span>
                <span>Respond to your inquiries and customer support requests</span>
              </li>
              <li className="font-body text-[16px] text-text-sub leading-relaxed flex gap-3">
                <span className="text-brand font-bold">•</span>
                <span>Monitor and analyze usage trends and user behavior</span>
              </li>
              <li className="font-body text-[16px] text-text-sub leading-relaxed flex gap-3">
                <span className="text-brand font-bold">•</span>
                <span>Enforce our Terms of Service and prevent fraud</span>
              </li>
              <li className="font-body text-[16px] text-text-sub leading-relaxed flex gap-3">
                <span className="text-brand font-bold">•</span>
                <span>Comply with legal obligations</span>
              </li>
            </ul>
          </section>

          {/* 4. Sharing of Information */}
          <section className="mb-12">
            <h2 className="font-display font-bold text-[28px] text-brand mb-4">4. Sharing of Information</h2>
            <p className="font-body text-[16px] text-text-sub leading-relaxed mb-4">
              <strong>Public Profile Information:</strong> Your profile information (name, major, skills, bio, etc.) is visible to other users on the Platform to facilitate mentorship connections.
            </p>
            <p className="font-body text-[16px] text-text-sub leading-relaxed mb-4">
              <strong>Service Providers:</strong> We may share your information with third-party service providers who assist us in operating the Platform, including hosting providers, analytics services, and payment processors.
            </p>
            <p className="font-body text-[16px] text-text-sub leading-relaxed mb-4">
              <strong>Legal Requirements:</strong> We may disclose your information if required by law, legal process, or government request, or to protect our rights, privacy, safety, or property.
            </p>
            <p className="font-body text-[16px] text-text-sub leading-relaxed">
              <strong>No Sale of Data:</strong> We do not sell, rent, or trade your personal information to third parties for marketing purposes.
            </p>
          </section>

          {/* 5. Data Security */}
          <section className="mb-12">
            <h2 className="font-display font-bold text-[28px] text-brand mb-4">5. Data Security</h2>
            <p className="font-body text-[16px] text-text-sub leading-relaxed mb-4">
              We implement industry-standard security measures, including encryption, secure password storage, and access controls, to protect your personal information against unauthorized access, alteration, disclosure, or destruction.
            </p>
            <p className="font-body text-[16px] text-text-sub leading-relaxed mb-4">
              However, no method of transmission over the Internet or electronic storage is 100% secure. While we strive to use commercially acceptable means to protect your information, we cannot guarantee absolute security.
            </p>
          </section>

          {/* 6. Data Retention */}
          <section className="mb-12">
            <h2 className="font-display font-bold text-[28px] text-brand mb-4">6. Data Retention</h2>
            <p className="font-body text-[16px] text-text-sub leading-relaxed">
              We retain your personal information for as long as necessary to provide the Platform, fulfill the purposes outlined in this Privacy Policy, and comply with applicable laws. You may request deletion of your account and associated data at any time by contacting us.
            </p>
          </section>

          {/* 7. User Rights */}
          <section className="mb-12">
            <h2 className="font-display font-bold text-[28px] text-brand mb-4">7. Your Rights</h2>
            <p className="font-body text-[16px] text-text-sub leading-relaxed mb-4">
              Depending on your location, you may have the following rights:
            </p>
            <ul className="space-y-3 mb-4">
              <li className="font-body text-[16px] text-text-sub leading-relaxed flex gap-3">
                <span className="text-brand font-bold">•</span>
                <span>Access: You can request a copy of the personal information we hold about you</span>
              </li>
              <li className="font-body text-[16px] text-text-sub leading-relaxed flex gap-3">
                <span className="text-brand font-bold">•</span>
                <span>Correction: You can request corrections to inaccurate information</span>
              </li>
              <li className="font-body text-[16px] text-text-sub leading-relaxed flex gap-3">
                <span className="text-brand font-bold">•</span>
                <span>Deletion: You can request deletion of your account and associated data</span>
              </li>
              <li className="font-body text-[16px] text-text-sub leading-relaxed flex gap-3">
                <span className="text-brand font-bold">•</span>
                <span>Opt-out: You can opt out of marketing communications</span>
              </li>
            </ul>
          </section>

          {/* 8. Third-Party Links */}
          <section className="mb-12">
            <h2 className="font-display font-bold text-[28px] text-brand mb-4">8. Third-Party Links</h2>
            <p className="font-body text-[16px] text-text-sub leading-relaxed">
              The Platform may contain links to third-party websites and services that are not operated by us. This Privacy Policy does not apply to such external sites, and we are not responsible for their privacy practices. We encourage you to review the privacy policies of any third-party services before providing your information.
            </p>
          </section>

          {/* 9. Children's Privacy */}
          <section className="mb-12">
            <h2 className="font-display font-bold text-[28px] text-brand mb-4">9. Children's Privacy</h2>
            <p className="font-body text-[16px] text-text-sub leading-relaxed">
              AshesiConnect is not intended for children under the age of 13. We do not knowingly collect personal information from children under 13. If we become aware that a child under 13 has provided us with personal information, we will delete such information promptly.
            </p>
          </section>

          {/* 10. International Privacy */}
          <section className="mb-12">
            <h2 className="font-display font-bold text-[28px] text-brand mb-4">10. International Privacy</h2>
            <p className="font-body text-[16px] text-text-sub leading-relaxed">
              Your information may be transferred to, and maintained on, computers located in countries other than your country of residence. These countries may have data protection laws that differ from your home country. By using the Platform, you consent to such transfers.
            </p>
          </section>

          {/* 11. Changes to Privacy Policy */}
          <section className="mb-12">
            <h2 className="font-display font-bold text-[28px] text-brand mb-4">11. Changes to This Privacy Policy</h2>
            <p className="font-body text-[16px] text-text-sub leading-relaxed">
              We may update this Privacy Policy from time to time. We will notify you of any changes by posting the updated policy on the Platform with a new "Last updated" date. Your continued use of the Platform following such changes constitutes your acceptance of the updated Privacy Policy.
            </p>
          </section>

          {/* 12. Contact Us */}
          <section className="mb-12">
            <h2 className="font-display font-bold text-[28px] text-brand mb-4">12. Contact Us</h2>
            <p className="font-body text-[16px] text-text-sub leading-relaxed mb-4">
              If you have questions, concerns, or requests regarding this Privacy Policy or our privacy practices, please contact us at:
            </p>
            <div className="bg-brand/5 border border-brand/20 rounded-[12px] p-6">
              <p className="font-body text-[15px] text-text font-medium mb-2">AshesiConnect Privacy Team</p>
              <p className="font-body text-[15px] text-text-sub">Email: privacy@ashesiconnect.com</p>
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
            <Link href="/legal/terms" className="btn btn-ghost">
              Read Terms of Service →
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
