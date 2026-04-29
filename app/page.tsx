
"use client";

import { useState } from "react";
import Image from "next/image";
import Link from "next/link";

// ─── Types ───────────────────────────────────────────────────────────────────

interface Feature {
  icon: string;
  title: string;
  description: string;
}

interface Testimonial {
  quote: string;
  initials: string;
  name: string;
  role: string;
}

interface MentorCard {
  initials: string;
  name: string;
  role: string;
  company: string;
  industry: string;
  available: boolean;
}

interface ProgramCard {
  badge: string;
  title: string;
  description: string;
  duration: string;
  spots: string;
  tag: string;
}

interface ImpactStat {
  value: string;
  label: string;
  description: string;
}

interface CommunityEvent {
  date: string;
  month: string;
  title: string;
  type: string;
  location: string;
}

// ─── Data ────────────────────────────────────────────────────────────────────

const navLinks = [
  { label: "Mentorship", href: "#mentorship" },
  { label: "Programs",   href: "#programs"   },
  { label: "Legacy",     href: "#legacy"     },
  { label: "Impact",     href: "#impact"     },
  { label: "Community",  href: "#community"  },
];

const features: Feature[] = [
  { icon: "diversity_3",    title: "Personalized Matching", description: "AI-driven pairing based on career aspirations and shared values."                },
  { icon: "partner_exchange", title: "Industry Coaching",   description: "Direct access to leaders across Finance, Tech, and Public Service."              },
  { icon: "insights",       title: "Career Planning",       description: "Structured roadmap to navigate post-graduation complexities."                     },
  { icon: "stars",          title: "Exclusive Access",      description: "Invites to closed-door networking events and workshops."                          },
];

const testimonials: Testimonial[] = [
  {
    quote: "The mentorship program didn't just give me career advice; it gave me a lifelong advocate. My mentor, an Ashesi Alum at Google, helped me navigate the transition from campus to a global tech role seamlessly.",
    initials: "AN", name: "Abena Nyarko",  role: "Class of 2023 Mentee",
  },
  {
    quote: "Paying it forward is the Ashesi way. Seeing my mentees grow from curious students to impactful professionals is the most rewarding part of my career today.",
    initials: "JM", name: "John Mahama", role: "Class of 2012 Mentor",
  },
];

const mentors: MentorCard[] = [
  { initials: "KA", name: "Kofi Acheampong", role: "Senior Engineer",    company: "Google",   industry: "Technology",   available: true  },
  { initials: "EA", name: "Efua Asante",     role: "Investment Analyst", company: "Databank", industry: "Finance",      available: true  },
  { initials: "NB", name: "Nana Boateng",    role: "Policy Advisor",     company: "World Bank", industry: "Public Service", available: false },
  { initials: "AO", name: "Ama Owusu",       role: "Product Manager",    company: "Paystack", industry: "Fintech",      available: true  },
];

const programs: ProgramCard[] = [
  { badge: "TC",  title: "Tech & Innovation",         description: "Get mentored by software engineers, product managers, and AI specialists. Master emerging technologies and build scalable solutions.", duration: "Self-Paced", spots: "45 Mentors", tag: "Most Popular" },
  { badge: "FN",  title: "Finance & Fintech",         description: "Learn from investment professionals, fintech founders, and financial leaders. Build expertise in traditional and digital finance.",       duration: "Self-Paced", spots: "32 Mentors", tag: "Open"         },
  { badge: "LP",  title: "Leadership & Public Service", description: "Connect with policy advisors, executives, and public sector leaders. Develop leadership skills for social impact.",        duration: "Self-Paced", spots: "28 Mentors", tag: "Open"         },
  { badge: "EN",  title: "Entrepreneurship",          description: "Get guided by successful founders and business leaders. Launch and scale your startup with real-world mentorship.",          duration: "Self-Paced", spots: "38 Mentors", tag: "Growing" },
];

const legacyMilestones = [
  { year: "2018", title: "Mentorship Program Launch",description: "Structured alumni-to-student mentorship formally begins, pairing 200+ mentee-mentor pairs in year one."                          },
  { year: "2020", title: "Virtual Mentorship Scaled",   description: "Program adapts to digital-first model, enabling mentorship across borders and continents."                               },
  { year: "2022", title: "1,000+ Active Mentors",description: "The platform reaches 1,000 alumni mentors from 25+ countries ready to guide the next generation."                         },
  { year: "2023", title: "Career Transition Support",description: "Mentorship program expands to focus on career transitions, landing 500+ mentees in new roles."                          },
  { year: "2025", title: "Global Mentorship Hub",   description: "Platform becomes a premier mentorship destination for African talent, with 2,000+ active mentors and mentees."                                 },
];

const impactStats: ImpactStat[] = [
  { value: "2,000+", label: "Mentee-Mentor Pairs",    description: "Active mentorship relationships creating career breakthroughs."          },
  { value: "85%",   label: "Career Growth Rate",    description: "Mentees reporting significant career advancement within 12 months."               },
  { value: "35+",    label: "Industries Covered",     description: "Mentorship available across tech, finance, leadership, healthcare, and more."            },
  { value: "4.8★",label: "Average Mentor Rating",  description: "Highly-rated mentors dedicated to your success and professional growth."       },
];

const communityEvents: CommunityEvent[] = [
  { date: "15", month: "May", title: "Mentorship Kickoff 2025",    type: "Virtual",           location: "Zoom + In-Person Accra"  },
  { date: "10", month: "Jun", title: "Tech Mentors Meetup",   type: "In-Person · Accra",            location: "Ashesi Campus"        },
  { date: "20", month: "Jun", title: "Career Transitions Workshop",    type: "Virtual",           location: "Zoom Webinar"                   },
  { date: "05", month: "Jul", title: "Finance Leadership Circle", type: "In-Person · Accra", location: "Movenpick Ambassador Hotel"   },
];

const footerLinks: Record<string, { label: string; href: string }[]> = {
  Programs: [
    { label: "Undergraduate", href: "#programs"    },
    { label: "Mentorship",    href: "#mentorship"  },
    { label: "Scholarships",  href: "#programs"    },
  ],
  Campus: [
    { label: "Berekuso Hills", href: "#legacy"    },
    { label: "Virtual Tour",   href: "#legacy"    },
    { label: "Events",         href: "#community" },
  ],
  Legacy: [
    { label: "Mentor Guidelines", href: "/terms"           },
    { label: "Alumni Portal",     href: "/login"           },
    { label: "Privacy Policy",    href: "/privacy"         },
    { label: "Giving to Ashesi",  href: "#impact"          },
  ],
};

// ─── Page ─────────────────────────────────────────────────────────────────────

export default function AshesiAlumniPage() {
  const [searchQuery, setSearchQuery] = useState("");
  const [form, setForm] = useState({ phone: "", location: "", major: "", gradYear: "" });

  const handleFormChange = (e: React.ChangeEvent<HTMLInputElement>) =>
    setForm({ ...form, [e.target.name]: e.target.value });

  const handleNavClick = (e: React.MouseEvent<HTMLAnchorElement>, href: string) => {
    if (href.startsWith("#")) {
      e.preventDefault();
      const el = document.getElementById(href.slice(1));
      if (el) el.scrollIntoView({ behavior: "smooth" });
    }
  };

  return (
    <>
      <style>{`
        @import url('https://fonts.googleapis.com/css2?family=Bree+Serif&family=Brawler:wght@400;700&family=Newsreader:opsz,wght@6-72,400;6-72,500;6-72,700&family=Manrope:wght@400;500;700;800&display=swap');
        @import url('https://fonts.googleapis.com/css2?family=Material+Symbols+Outlined:wght,FILL@100..700,0..1&display=swap');
        .material-symbols-outlined {
          font-family: 'Material Symbols Outlined'; font-weight: normal; font-style: normal;
          font-size: 24px; line-height: 1; letter-spacing: normal; text-transform: none;
          display: inline-block; white-space: nowrap; word-wrap: normal; direction: ltr;
          font-feature-settings: 'liga'; -webkit-font-smoothing: antialiased;
          font-variation-settings: 'FILL' 0, 'wght' 400, 'GRAD' 0, 'opsz' 48;
        }
        .asymmetric-hero { border-radius: 64px 4px 64px 4px; }
        .asymmetric-card { border-radius: 24px 8px 24px 8px; }
        ::selection { background-color: #8a2432; color: white; }
        .font-bree      { font-family: 'Bree Serif', serif; }
        .font-brawler   { font-family: 'Brawler', serif; }
        .font-newsreader{ font-family: 'Newsreader', serif; }
        .font-manrope   { font-family: 'Manrope', sans-serif; }
        html { scroll-behavior: smooth; }
      `}</style>

      <div className="bg-[#fff8f7] text-[#241919] font-['Brawler',serif] min-h-screen">

        {/* ── Navbar ──────────────────────────────────────────────────────── */}
        <header className="fixed top-0 w-full z-50 bg-[#fff8f7] transition-all duration-300">
          <nav className="flex justify-between items-center w-full px-8 py-4 max-w-7xl mx-auto">
            <div className="flex items-center gap-8">
              <a
                href="#"
                onClick={(e) => { e.preventDefault(); window.scrollTo({ top: 0, behavior: "smooth" }); }}
                className="text-2xl font-newsreader font-bold text-[#6a0a1d]"
              >
                Ashesi Alumni
              </a>
              <div className="hidden md:flex items-center gap-6">
                {navLinks.map((item) => (
                  <a
                    key={item.label}
                    href={item.href}
                    onClick={(e) => handleNavClick(e, item.href)}
                    className="text-[#241919] font-medium hover:text-[#8a2432] transition-colors duration-300 cursor-pointer"
                  >
                    {item.label}
                  </a>
                ))}
              </div>
            </div>
            <div className="flex items-center gap-4">
              <Link href="/login" className="hidden lg:block text-[#241919] font-medium px-4 py-2 hover:bg-[#fff0f0] rounded-full transition-all">
                Sign In
              </Link>
              <Link href="/register" className="bg-[#8a2432] text-white px-6 py-2.5 rounded-full font-bold shadow-lg hover:scale-105 active:scale-95 transition-all">
                Join the Network
              </Link>
            </div>
          </nav>
        </header>

        <main className="pt-24">

          {/* ── Hero ────────────────────────────────────────────────────────── */}
          <section className="max-w-7xl mx-auto px-8 py-16 grid grid-cols-1 lg:grid-cols-2 gap-12 items-center">
            <div className="space-y-8">
              <h1 className="font-bree text-5xl lg:text-7xl leading-tight text-[#6a0a1d]">
                Get Matched with Your Ideal Mentor
              </h1>
              <p className="text-lg text-[#564242] font-brawler max-w-xl">
                Connect with Ashesi alumni leaders who are ready to guide your career journey.
                Get personalized mentorship from industry experts across tech, finance, and beyond.
              </p>
              <div className="flex flex-wrap gap-4">
                <a href="#mentorship" onClick={(e) => handleNavClick(e, "#mentorship")}
                  className="px-8 py-4 bg-[#8a2432] text-white rounded-full font-bold flex items-center gap-2 hover:shadow-xl transition-all">
                  Explore Now <span className="material-symbols-outlined">arrow_forward</span>
                </a>
                <a href="#legacy" onClick={(e) => handleNavClick(e, "#legacy")}
                  className="px-8 py-4 border-2 border-[#8a2432] text-[#8a2432] rounded-full font-bold hover:bg-[#fff0f0] transition-all">
                  Learn More
                </a>
              </div>
            </div>
            <div className="relative">
              <div className="asymmetric-hero overflow-hidden shadow-2xl">
                <Image
                  src="https://lh3.googleusercontent.com/aida-public/AB6AXuDC632zR3JPB3MBu4jvsSLF9Pue7wwHcjZvVFBfaSgumzie_3NH8PSJe0ylx41HOdBIm3e9VgQLGQpR5Bqb3FL0XZ8GlnrUEVZ6kCFSEakEBJ7duz5yy5-Gx8fupBgOCUZP7Q1e5499hxFShcu4Dkves5U7_BK9aKDauM78Ze6_I_wmPKatCnVEFFns13Q5k1_F5ZUgcEqBQZVkmdNskBeMiM0rvsdoTwAa-3bm7JdmQmbJ5Im1wRu2_k7StqhgEYtJX87KNIOd5Mc"
                  alt="Smiling Ashesi University student" width={700} height={500}
                  className="w-full h-[500px] object-cover" unoptimized
                />
              </div>
              <div className="absolute -bottom-6 -left-6 bg-white p-8 rounded-3xl shadow-xl flex gap-8 items-center border border-[#ddc0c0]/10">
                <div className="text-center">
                  <p className="font-bree text-3xl text-[#6a0a1d]">5k+</p>
                  <p className="text-xs uppercase font-bold text-[#564242] tracking-wider">Alumni</p>
                </div>
                <div className="w-px h-12 bg-[#ddc0c0]" />
                <div className="text-center">
                  <p className="font-bree text-3xl text-[#6a0a1d]">120</p>
                  <p className="text-xs uppercase font-bold text-[#564242] tracking-wider">Startups</p>
                </div>
              </div>
            </div>
          </section>

          {/* ── Search ──────────────────────────────────────────────────────── */}
          <section className="bg-[#fff0f0] py-20 px-8">
            <div className="max-w-4xl mx-auto text-center space-y-10">
              <h2 className="font-bree text-4xl text-[#6a0a1d]">Find a Mentor by Focus Area</h2>
              <div className="relative">
                <input type="text" value={searchQuery} onChange={(e) => setSearchQuery(e.target.value)}
                  placeholder="What are you looking for?"
                  className="w-full h-20 px-12 rounded-full border-none bg-white text-xl shadow-sm focus:outline-none focus:ring-4 focus:ring-[#8a2432]/10 transition-all"
                />
                <button className="absolute right-3 top-3 h-14 px-10 bg-[#8a2432] text-white rounded-full font-bold uppercase tracking-widest hover:bg-[#6a0a1d] transition-all">
                  Search
                </button>
                <span className="material-symbols-outlined absolute left-4 top-7 text-[#6a0a1d]/40">search</span>
              </div>
            </div>
          </section>

          {/* ── Mentorship Feature Cards ─────────────────────────────────────── */}
          <section className="max-w-7xl mx-auto px-8 py-24">
            <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-8">
              {features.map((feature) => (
                <div key={feature.title} className="bg-white p-10 asymmetric-card hover:bg-[#fff0f0] transition-all duration-300 group border border-[#ddc0c0]/5">
                  <div className="w-16 h-16 bg-[#f2dede] rounded-2xl flex items-center justify-center mb-6 text-[#6a0a1d] group-hover:scale-110 transition-transform">
                    <span className="material-symbols-outlined text-4xl">{feature.icon}</span>
                  </div>
                  <h3 className="font-bree text-xl mb-4">{feature.title}</h3>
                  <p className="text-[#564242] font-brawler leading-relaxed">{feature.description}</p>
                </div>
              ))}
            </div>
          </section>

          {/* ── Career Journey ───────────────────────────────────────────────── */}
          <section className="max-w-7xl mx-auto px-8 pb-24">
            <div className="bg-[#8a2432] rounded-[64px] p-12 lg:p-20 text-white relative overflow-hidden">
              <div className="relative z-10">
                <h2 className="font-bree text-4xl lg:text-5xl mb-12">Your Career Journey Starts Here</h2>
                <div className="space-y-6">
                  <div className="bg-white/10 backdrop-blur-md rounded-3xl p-6 flex flex-col md:flex-row items-center justify-between gap-6 border border-white/20">
                    <div className="flex items-center gap-6">
                      <div className="w-16 h-16 rounded-full overflow-hidden border-2 border-white/50 flex-shrink-0">
                        <Image
                          src="https://lh3.googleusercontent.com/aida-public/AB6AXuAuHyCDM3_JxoMEqHDxShX2xl1ho_uu9CQsyEKxUySmzrwOjenVogFpiFHamj9LPdpq_986FF-XfHLUEJ53Q-LoXJzjmMCfjwAX-M2QIC3A_oPFsLHT-hz-h4A0o6UQjK0AJzmue7qeB7OHPFBE9XThqEgeI2C5GhEbzHYNkJRuC3pe9HOQpC4jA0cNXmgSUFkdgxXVQLEzM6X3_8EZjeSagbSKvq7uT4uM-z4DIm-HZ0mwnM5-Y_MsV3SRlhyt6vpOXwvQQLOtqBE"
                          alt="Kwame Mensah" width={64} height={64} className="w-full h-full object-cover" unoptimized
                        />
                      </div>
                      <div>
                        <h4 className="text-xl font-bold">Kwame Mensah</h4>
                        <p className="text-white/80 font-brawler">Electrical Engineering | Class of 2021</p>
                      </div>
                      <span className="bg-[#fee9e9] text-[#8a2432] px-3 py-1 rounded-full text-xs font-bold flex items-center gap-1">
                        <span className="material-symbols-outlined text-sm">verified</span> Verified
                      </span>
                    </div>
                    <div className="flex gap-4">
                      <Link href="/mentors/settings" className="px-6 py-2 bg-white text-[#8a2432] rounded-full font-bold hover:bg-[#ffdada] transition-colors">View Profile</Link>
                      <Link href="/mentors/settings" className="px-6 py-2 border border-white/40 rounded-full font-bold hover:bg-white/10 transition-colors">Edit</Link>
                    </div>
                  </div>
                  <div className="bg-white/10 backdrop-blur-md rounded-3xl p-6 flex flex-col md:flex-row items-center justify-between gap-6 border border-white/20">
                    <div className="flex items-center gap-6">
                      <div className="w-16 h-16 rounded-full bg-[#fee9e9] flex items-center justify-center text-[#6a0a1d] text-2xl font-bold flex-shrink-0">BA</div>
                      <div>
                        <h4 className="text-xl font-bold">Business Administration</h4>
                        <p className="text-white/80 font-brawler">Cohort Open | Applications Ongoing</p>
                      </div>
                    </div>
                    <a href="#programs" onClick={(e) => handleNavClick(e, "#programs")}
                      className="px-6 py-2 bg-white text-[#8a2432] rounded-full font-bold hover:bg-[#ffdada] transition-colors">
                      Apply Now
                    </a>
                  </div>
                </div>
              </div>
              <div className="absolute -right-20 -top-20 w-80 h-80 bg-white/5 rounded-full blur-3xl pointer-events-none" />
            </div>
          </section>

          {/* ── Support ─────────────────────────────────────────────────────── */}
          <section className="bg-[#fff8f7] py-24">
            <div className="max-w-7xl mx-auto px-8 grid grid-cols-1 lg:grid-cols-2 gap-20 items-center">
              <div className="space-y-10 order-2 lg:order-1">
                <h2 className="font-bree text-4xl text-[#6a0a1d]">Share Your Expertise & Mentor</h2>
                <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
                  {[
                    { label: "Company",   name: "phone",    placeholder: "Your Current Company" },
                    { label: "Focus Area", name: "location", placeholder: "e.g., Tech, Finance, Leadership" },
                    { label: "Industry",   name: "major",    placeholder: "Your Industry" },
                    { label: "Grad Year", name: "gradYear", placeholder: "2015"             },
                  ].map((field) => (
                    <div key={field.name} className="space-y-2">
                      <label className="text-sm font-bold text-[#564242] uppercase tracking-wider">{field.label}</label>
                      <input type="text" name={field.name} value={form[field.name as keyof typeof form]}
                        onChange={handleFormChange} placeholder={field.placeholder}
                        className="w-full bg-[#fff0f0] border-none rounded-2xl h-14 px-4 focus:outline-none focus:ring-2 focus:ring-[#8a2432]/20"
                      />
                    </div>
                  ))}
                  <div className="md:col-span-2 flex gap-4 pt-6">
                    <button type="button" className="px-10 py-4 bg-[#8a2432] text-white rounded-full font-bold shadow-lg hover:scale-105 transition-transform">Save Story</button>
                    <button type="button" className="px-10 py-4 border-2 border-[#ddc0c0] text-[#564242] rounded-full font-bold hover:bg-[#fff0f0] transition-colors">Edit Fields</button>
                  </div>
                </div>
              </div>
              <div className="order-1 lg:order-2">
                <div className="asymmetric-hero overflow-hidden rotate-2 hover:rotate-0 transition-transform duration-500 shadow-2xl">
                  <Image
                    src="https://imgs.search.brave.com/xw-LlQBXedLodkZBttMVOfpRpgXA7GJR5dOofU9HMxo/rs:fit:500:0:1:0/g:ce/aHR0cHM6Ly9tZWRp/YS5nZXR0eWltYWdl/cy5jb20vaWQvMTQ1/Nzc0NDQyMi9waG90/by90ZWFjaGVyLWlu/LWNsYXNzcm9vbS1w/b2ludHMtdG8tc3R1/ZGVudC1yYWlzaW5n/LWhhbmQuanBnP3M9/NjEyeDYxMiZ3PTAm/az0yMCZjPVJmbzBy/UVYyNy1MZjFTb29G/b0Z0czN2TXNVdVRv/UnpBTl9MZDZpMVVQ/THc9"
                    alt="Ashesi student in a high-tech lab" width={700} height={600}
                    className="w-full h-[600px] object-cover" unoptimized
                  />
                </div>
              </div>
            </div>
          </section>

          {/* ── Testimonials ────────────────────────────────────────────────── */}
          <section className="max-w-7xl mx-auto px-8 py-24">
            <h2 className="font-bree text-4xl text-[#6a0a1d] text-center mb-16">Voices from our Ecosystem</h2>
            <div className="grid grid-cols-1 md:grid-cols-2 gap-12">
              {testimonials.map((t) => (
                <div key={t.name} className="relative p-12 bg-white rounded-[40px] shadow-sm border border-[#ddc0c0]/10">
                  <span className="material-symbols-outlined text-6xl text-[#8a2432]/10 absolute top-8 left-8">format_quote</span>
                  <blockquote className="text-xl font-brawler italic text-[#241919] leading-relaxed relative z-10">
                    &quot;{t.quote}&quot;
                  </blockquote>
                  <div className="mt-8 flex items-center gap-4">
                    <div className="w-12 h-12 rounded-full bg-[#8a2432] text-white flex items-center justify-center font-bold flex-shrink-0">{t.initials}</div>
                    <div>
                      <p className="font-bold text-[#6a0a1d]">{t.name}</p>
                      <p className="text-xs uppercase font-bold tracking-widest text-[#564242]">{t.role}</p>
                    </div>
                  </div>
                </div>
              ))}
            </div>
          </section>

          {/* ════════════════════════════════════════════════════════════════════
              MENTORSHIP  id="mentorship"
          ════════════════════════════════════════════════════════════════════ */}
          <section id="mentorship" className="bg-[#fff0f0] py-24 scroll-mt-24">
            <div className="max-w-7xl mx-auto px-8">

              {/* Header */}
              <div className="flex flex-col md:flex-row md:items-end justify-between gap-6 mb-16">
                <div className="space-y-4">
                  <h2 className="font-bree text-4xl lg:text-5xl text-[#6a0a1d]">Find Your Mentor</h2>
                  <p className="text-[#564242] font-brawler text-lg max-w-xl">
                    Connect with experienced Ashesi alumni who have walked the path you&apos;re on — and are ready to guide you forward.
                  </p>
                </div>
                <Link href="/register" className="flex-shrink-0 px-8 py-4 bg-[#8a2432] text-white rounded-full font-bold flex items-center gap-2 hover:shadow-xl transition-all self-start md:self-auto">
                  Become a Mentor <span className="material-symbols-outlined">arrow_forward</span>
                </Link>
              </div>

              {/* Mentor Cards */}
              <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-6 mb-16">
                {mentors.map((mentor) => (
                  <div key={mentor.name} className="bg-white p-8 asymmetric-card border border-[#ddc0c0]/10 group hover:shadow-lg transition-all duration-300">
                    <div className="flex items-start justify-between mb-6">
                      <div className="w-14 h-14 rounded-full bg-[#8a2432] text-white flex items-center justify-center text-lg font-bold">{mentor.initials}</div>
                      <span className={`text-xs font-bold px-3 py-1 rounded-full ${mentor.available ? "bg-[#fee9e9] text-[#8a2432]" : "bg-[#f2dede] text-[#564242]"}`}>
                        {mentor.available ? "Available" : "Waitlist"}
                      </span>
                    </div>
                    <h4 className="font-bree text-lg text-[#241919] mb-1">{mentor.name}</h4>
                    <p className="text-sm text-[#8a2432] font-bold mb-1">{mentor.role}</p>
                    <p className="text-sm text-[#564242] font-brawler mb-4">{mentor.company}</p>
                    <span className="inline-block text-xs font-bold uppercase tracking-wider bg-[#fff0f0] text-[#564242] px-3 py-1 rounded-full mb-6">{mentor.industry}</span>
                    <button className="w-full py-2.5 border-2 border-[#8a2432] text-[#8a2432] rounded-full font-bold text-sm hover:bg-[#8a2432] hover:text-white transition-all group-hover:bg-[#8a2432] group-hover:text-white">
                      Request Session
                    </button>
                  </div>
                ))}
              </div>

              {/* How it works */}
              <div className="bg-[#8a2432] rounded-[48px] p-12 text-white relative overflow-hidden">
                <div className="relative z-10">
                  <h3 className="font-bree text-3xl mb-10">How Mentorship Works</h3>
                  <div className="grid grid-cols-1 md:grid-cols-3 gap-8">
                    {[
                      { step: "01", icon: "person_search",     title: "Get Matched",     desc: "Complete your profile and our algorithm finds your ideal mentor based on career goals and interests."         },
                      { step: "02", icon: "calendar_month",    title: "Schedule Sessions",desc: "Book 1-on-1 sessions at a pace that works for both mentor and mentee — weekly or fortnightly."             },
                      { step: "03", icon: "workspace_premium", title: "Grow Together",   desc: "Track milestones, share resources, and build a relationship that lasts well beyond graduation."             },
                    ].map((s) => (
                      <div key={s.step} className="flex gap-5">
                        <div className="flex-shrink-0">
                          <div className="w-12 h-12 rounded-2xl bg-white/10 flex items-center justify-center text-white">
                            <span className="material-symbols-outlined">{s.icon}</span>
                          </div>
                        </div>
                        <div>
                          <p className="text-white/40 text-xs font-bold tracking-widest mb-1">{s.step}</p>
                          <h4 className="font-bree text-lg mb-2">{s.title}</h4>
                          <p className="text-white/70 font-brawler text-sm leading-relaxed">{s.desc}</p>
                        </div>
                      </div>
                    ))}
                  </div>
                </div>
                <div className="absolute -right-16 -bottom-16 w-64 h-64 bg-white/5 rounded-full blur-3xl pointer-events-none" />
              </div>
            </div>
          </section>

          {/* ════════════════════════════════════════════════════════════════════
              PROGRAMS  id="programs"
          ════════════════════════════════════════════════════════════════════ */}
          <section id="programs" className="py-24 scroll-mt-24">
            <div className="max-w-7xl mx-auto px-8">

              <div className="text-center space-y-4 mb-16">
                <h2 className="font-bree text-4xl lg:text-5xl text-[#6a0a1d]">Mentorship Pathways</h2>
                <p className="text-[#564242] font-brawler text-lg max-w-2xl mx-auto">
                  Choose your mentorship track based on your career goals and interests. Get guided by alumni excelling in these specialized fields.
                </p>
              </div>

              <div className="grid grid-cols-1 md:grid-cols-2 gap-8 mb-16">
                {programs.map((prog) => (
                  <div key={prog.title} className="bg-white border border-[#ddc0c0]/10 asymmetric-card p-10 group hover:shadow-lg transition-all duration-300">
                    <div className="flex items-start justify-between mb-6">
                      <div className="w-16 h-16 rounded-2xl bg-[#f2dede] flex items-center justify-center text-[#6a0a1d] text-xl font-bold font-bree">{prog.badge}</div>
                      <span className={`text-xs font-bold px-3 py-1 rounded-full ${
                        prog.tag === "Most Popular" ? "bg-[#8a2432] text-white" :
                        prog.tag === "Filling Fast" ? "bg-[#fee9e9] text-[#8a2432]" :
                        "bg-[#fee9e9] text-[#8a2432]"
                      }`}>{prog.tag}</span>
                    </div>
                    <h3 className="font-bree text-2xl text-[#241919] mb-3">{prog.title}</h3>
                    <p className="text-[#564242] font-brawler leading-relaxed mb-6">{prog.description}</p>
                    <div className="flex items-center gap-6 mb-8 text-sm">
                      <span className="flex items-center gap-1.5 text-[#564242] font-bold">
                        <span className="material-symbols-outlined text-base text-[#8a2432]">schedule</span>{prog.duration}
                      </span>
                      <span className="flex items-center gap-1.5 text-[#564242] font-bold">
                        <span className="material-symbols-outlined text-base text-[#8a2432]">group</span>{prog.spots}
                      </span>
                    </div>
                    <Link href="/register/mentee" className="inline-flex items-center gap-2 px-8 py-3 bg-[#8a2432] text-white rounded-full font-bold text-sm hover:shadow-lg transition-all">
                      Apply Now <span className="material-symbols-outlined text-sm">arrow_forward</span>
                    </Link>
                  </div>
                ))}
              </div>

              {/* Scholarship Banner */}
              <div className="bg-[#fff0f0] rounded-[48px] p-12 flex flex-col md:flex-row items-center justify-between gap-8 border border-[#ddc0c0]/20">
                <div className="space-y-3">
                  <div className="flex items-center gap-3">
                    <span className="material-symbols-outlined text-[#8a2432] text-3xl">workspace_premium</span>
                    <h3 className="font-bree text-2xl text-[#6a0a1d]">Mentorship Impact Fund</h3>
                  </div>
                  <p className="text-[#564242] font-brawler max-w-lg">
                    Join our community of mentors giving back. We provide resources, training, and support to help you become the best mentor possible.
                  </p>
                </div>
                <div className="flex gap-4 flex-shrink-0">
                  <Link href="/register/mentee" className="px-8 py-3.5 bg-[#8a2432] text-white rounded-full font-bold hover:shadow-lg transition-all">Apply for Aid</Link>
                  <Link href="/register/mentor" className="px-8 py-3.5 border-2 border-[#8a2432] text-[#8a2432] rounded-full font-bold hover:bg-[#ffdada] transition-all">Give Back</Link>
                </div>
              </div>
            </div>
          </section>

          {/* ════════════════════════════════════════════════════════════════════
              LEGACY  id="legacy"
          ════════════════════════════════════════════════════════════════════ */}
          <section id="legacy" className="bg-[#fff0f0] py-24 scroll-mt-24">
            <div className="max-w-7xl mx-auto px-8">

              <div className="grid grid-cols-1 lg:grid-cols-2 gap-16 items-center mb-20">
                <div className="space-y-6">
                  <h2 className="font-bree text-4xl lg:text-5xl text-[#6a0a1d]">The Mentorship Legacy</h2>
                  <p className="text-[#564242] font-brawler text-lg leading-relaxed">
                    For over two decades, Ashesi alumni have been leading across continents. Now, we&apos;re formalizing this power of mentorship—connecting experienced leaders with the next generation of African changemakers.
                  </p>
                  <a href="#impact" onClick={(e) => handleNavClick(e, "#impact")}
                    className="inline-flex items-center gap-2 text-[#8a2432] font-bold hover:gap-3 transition-all">
                    See Our Impact <span className="material-symbols-outlined">arrow_forward</span>
                  </a>
                </div>
                <div className="asymmetric-hero overflow-hidden shadow-2xl">
                  <Image
                    src="https://lh3.googleusercontent.com/aida-public/AB6AXuDC632zR3JPB3MBu4jvsSLF9Pue7wwHcjZvVFBfaSgumzie_3NH8PSJe0ylx41HOdBIm3e9VgQLGQpR5Bqb3FL0XZ8GlnrUEVZ6kCFSEakEBJ7duz5yy5-Gx8fupBgOCUZP7Q1e5499hxFShcu4Dkves5U7_BK9aKDauM78Ze6_I_wmPKatCnVEFFns13Q5k1_F5ZUgcEqBQZVkmdNskBeMiM0rvsdoTwAa-3bm7JdmQmbJ5Im1wRu2_k7StqhgEYtJX87KNIOd5Mc"
                    alt="Ashesi campus" width={700} height={420} className="w-full h-[420px] object-cover" unoptimized
                  />
                </div>
              </div>

              {/* Timeline */}
              <div className="relative">
                <div className="absolute left-6 top-0 bottom-0 w-px bg-[#ddc0c0] hidden md:block" />
                <div className="space-y-10">
                  {legacyMilestones.map((m, i) => (
                    <div key={m.year} className="flex gap-8 items-start">
                      <div className="relative flex-shrink-0 hidden md:flex flex-col items-center">
                        <div className={`w-12 h-12 rounded-full flex items-center justify-center text-xs font-bold z-10 ${i === legacyMilestones.length - 1 ? "bg-[#8a2432] text-white" : "bg-white border-2 border-[#ddc0c0] text-[#8a2432]"}`}>
                          {m.year.slice(2)}
                        </div>
                      </div>
                      <div className={`flex-1 p-8 rounded-3xl border ${i === legacyMilestones.length - 1 ? "bg-[#8a2432] text-white border-transparent" : "bg-white border-[#ddc0c0]/20"}`}>
                        <div className="flex items-center gap-3 mb-2">
                          <span className={`font-bree text-sm ${i === legacyMilestones.length - 1 ? "text-white/60" : "text-[#8a2432]"}`}>{m.year}</span>
                          <h4 className={`font-bree text-xl ${i === legacyMilestones.length - 1 ? "text-white" : "text-[#241919]"}`}>{m.title}</h4>
                        </div>
                        <p className={`font-brawler leading-relaxed ${i === legacyMilestones.length - 1 ? "text-white/80" : "text-[#564242]"}`}>{m.description}</p>
                      </div>
                    </div>
                  ))}
                </div>
              </div>
            </div>
          </section>

          {/* ════════════════════════════════════════════════════════════════════
              IMPACT  id="impact"
          ════════════════════════════════════════════════════════════════════ */}
          <section id="impact" className="py-24 scroll-mt-24">
            <div className="max-w-7xl mx-auto px-8">

              <div className="text-center space-y-4 mb-16">
                <h2 className="font-bree text-4xl lg:text-5xl text-[#6a0a1d]">The Numbers Tell the Story</h2>
                <p className="text-[#564242] font-brawler text-lg max-w-2xl mx-auto">
                  See the real impact of mentorship—career transitions, new opportunities, and lasting professional relationships transforming lives.
                </p>
              </div>

              <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-6 mb-16">
                {impactStats.map((stat) => (
                  <div key={stat.label} className="bg-white p-10 asymmetric-card border border-[#ddc0c0]/10 text-center group hover:bg-[#8a2432] transition-all duration-300">
                    <p className="font-bree text-4xl text-[#6a0a1d] mb-2 group-hover:text-white transition-colors">{stat.value}</p>
                    <p className="font-bold text-sm uppercase tracking-wider text-[#8a2432] mb-3 group-hover:text-[#ffdada] transition-colors">{stat.label}</p>
                    <p className="text-[#564242] font-brawler text-sm leading-relaxed group-hover:text-white/80 transition-colors">{stat.description}</p>
                  </div>
                ))}
              </div>

              <div className="bg-[#6a0a1d] rounded-[64px] p-12 lg:p-20 text-white flex flex-col lg:flex-row items-center justify-between gap-12 relative overflow-hidden">
                <div className="space-y-4 relative z-10">
                  <h3 className="font-bree text-3xl lg:text-4xl">Add Your Story to the Legacy</h3>
                  <p className="font-brawler text-white/70 max-w-lg text-lg">
                    Whether you&apos;re starting your career or leading an organization, join our mentorship community to guide the next generation of African leaders.
                  </p>
                </div>
                <div className="flex flex-wrap gap-4 relative z-10 flex-shrink-0">
                  <Link href="/register" className="px-10 py-4 bg-white text-[#6a0a1d] rounded-full font-bold hover:scale-105 transition-transform">Join the Network</Link>
                  <a href="#community" onClick={(e) => handleNavClick(e, "#community")}
                    className="px-10 py-4 border-2 border-white/40 text-white rounded-full font-bold hover:bg-white/10 transition-colors">
                    See Events
                  </a>
                </div>
                <div className="absolute -left-10 -bottom-10 w-72 h-72 bg-white/5 rounded-full blur-3xl pointer-events-none" />
              </div>
            </div>
          </section>

          {/* ════════════════════════════════════════════════════════════════════
              COMMUNITY  id="community"
          ════════════════════════════════════════════════════════════════════ */}
          <section id="community" className="bg-[#fff0f0] py-24 scroll-mt-24">
            <div className="max-w-7xl mx-auto px-8">

              <div className="flex flex-col md:flex-row md:items-end justify-between gap-6 mb-16">
                <div className="space-y-4">
                  <h2 className="font-bree text-4xl lg:text-5xl text-[#6a0a1d]">Events & Community</h2>
                  <p className="text-[#564242] font-brawler text-lg max-w-xl">
                    Join mentorship workshops, industry meetups, and networking events designed to strengthen our community of mentors and mentees.
                  </p>
                </div>
                <Link href="/register" className="flex-shrink-0 px-8 py-4 bg-[#8a2432] text-white rounded-full font-bold flex items-center gap-2 hover:shadow-xl transition-all self-start md:self-auto">
                  Browse All Events <span className="material-symbols-outlined">arrow_forward</span>
                </Link>
              </div>

              {/* Upcoming Events */}
              <div className="grid grid-cols-1 md:grid-cols-2 gap-6 mb-16">
                {communityEvents.map((event) => (
                  <div key={event.title} className="bg-white asymmetric-card p-8 border border-[#ddc0c0]/10 flex items-start gap-6 group hover:shadow-lg transition-all duration-300">
                    <div className="flex-shrink-0 w-16 h-16 bg-[#8a2432] rounded-2xl flex flex-col items-center justify-center text-white">
                      <span className="font-bree text-xl leading-none">{event.date}</span>
                      <span className="text-xs font-bold uppercase tracking-wider text-white/70">{event.month}</span>
                    </div>
                    <div className="flex-1 min-w-0">
                      <h4 className="font-bree text-xl text-[#241919] mb-1">{event.title}</h4>
                      <span className="text-xs font-bold uppercase tracking-wider text-[#8a2432]">{event.type}</span>
                      <p className="text-sm text-[#564242] font-brawler flex items-center gap-1.5 mt-1">
                        <span className="material-symbols-outlined text-base text-[#8a2432]">location_on</span>
                        {event.location}
                      </p>
                    </div>
                    <button className="flex-shrink-0 w-10 h-10 rounded-full border-2 border-[#ddc0c0] flex items-center justify-center text-[#8a2432] group-hover:bg-[#8a2432] group-hover:text-white group-hover:border-[#8a2432] transition-all">
                      <span className="material-symbols-outlined text-base">arrow_forward</span>
                    </button>
                  </div>
                ))}
              </div>

              {/* Community Channels */}
              <div className="grid grid-cols-1 md:grid-cols-3 gap-6">
                {[
                  { icon: "forum",     title: "Alumni Forum",       desc: "A moderated space to discuss industry trends, share opportunities, and ask for advice.",                cta: "Join Forum",        href: "/register" },
                  { icon: "groups_2",  title: "Industry Chapters",  desc: "Niche groups for Tech, Finance, Healthcare, and Public Service alumni to connect deeply.",             cta: "Find Your Chapter", href: "/register" },
                  { icon: "rss_feed",  title: "Alumni Newsletter",  desc: "Monthly stories of impact, event recaps, and opportunities curated for the Ashesi network.",           cta: "Subscribe",         href: "/register" },
                ].map((ch) => (
                  <div key={ch.title} className="bg-white p-8 asymmetric-card border border-[#ddc0c0]/10 space-y-4 group hover:bg-[#8a2432] transition-all duration-300">
                    <div className="w-12 h-12 bg-[#f2dede] rounded-2xl flex items-center justify-center text-[#8a2432] group-hover:bg-white/20 group-hover:text-white transition-all">
                      <span className="material-symbols-outlined">{ch.icon}</span>
                    </div>
                    <h4 className="font-bree text-xl text-[#241919] group-hover:text-white transition-colors">{ch.title}</h4>
                    <p className="text-[#564242] font-brawler text-sm leading-relaxed group-hover:text-white/80 transition-colors">{ch.desc}</p>
                    <Link href={ch.href} className="inline-flex items-center gap-1.5 text-sm font-bold text-[#8a2432] group-hover:text-white transition-colors">
                      {ch.cta} <span className="material-symbols-outlined text-base">arrow_forward</span>
                    </Link>
                  </div>
                ))}
              </div>
            </div>
          </section>

        </main>

        {/* ── Footer ──────────────────────────────────────────────────────────── */}
        <footer className="bg-[#fff0f0] text-[#6a0a1d] mt-20">
          <div className="grid grid-cols-1 md:grid-cols-4 gap-8 px-12 py-16 w-full max-w-7xl mx-auto font-manrope text-sm tracking-wide">
            <div className="space-y-6">
              <div className="font-newsreader text-lg font-bold">Ashesi Alumni</div>
              <p className="text-[#241919]/70 leading-relaxed">© 2024 Ashesi University. Connecting Ghana&apos;s Legacy with its Future.</p>
              <div className="flex gap-4">
                {[{ icon: "public", href: "/" }, { icon: "share", href: "/register" }].map((item) => (
                  <a key={item.icon} href={item.href}
                    className="w-10 h-10 rounded-full bg-white/50 flex items-center justify-center hover:bg-[#8a2432] hover:text-white transition-all duration-300">
                    <span className="material-symbols-outlined">{item.icon}</span>
                  </a>
                ))}
              </div>
            </div>
            {Object.entries(footerLinks).map(([heading, links]) => (
              <div key={heading} className="space-y-4">
                <h4 className="font-bold uppercase tracking-widest text-xs">{heading}</h4>
                <ul className="space-y-2">
                  {links.map((link) => (
                    <li key={link.label}>
                      <a href={link.href}
                        onClick={(e) => { if (link.href.startsWith("#")) handleNavClick(e as unknown as React.MouseEvent<HTMLAnchorElement>, link.href); }}
                        className="text-[#241919]/70 hover:text-[#6a0a1d] transition-all">
                        {link.label}
                      </a>
                    </li>
                  ))}
                </ul>
              </div>
            ))}
          </div>
        </footer>

      </div>
    </>
  );
}