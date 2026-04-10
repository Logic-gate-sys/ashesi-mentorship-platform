'use client';

import React, { useState } from 'react';
import { Search, MapPin, Star, UserPlus } from 'lucide-react';

interface Mentor {
  id: string;
  name: string;
  title: string;
  company: string;
  location: string;
  rating: number;
  reviews: number;
  specialties: string[];
  bio: string;
  availability: string;
  mentees: number;
}

const mockMentors: Mentor[] = [
  {
    id: '1',
    name: 'Alex O.',
    title: 'Product Manager',
    company: 'Microsoft',
    location: 'San Francisco, CA',
    rating: 4.9,
    reviews: 47,
    specialties: ['Career Growth', 'Product Strategy', 'Leadership'],
    bio: 'Experienced PM with 8+ years in tech. Passionate about helping early-career professionals navigate their careers.',
    availability: '2-3 hours/week',
    mentees: 4,
  },
  {
    id: '2',
    name: 'Sarah M.',
    title: 'Senior Engineer',
    company: 'Google',
    location: 'Mountain View, CA',
    rating: 4.8,
    reviews: 52,
    specialties: ['Technical Skills', 'System Design', 'DSA'],
    bio: 'Full-stack engineer with expertise in scalable systems. Love mentoring junior developers.',
    availability: '3-4 hours/week',
    mentees: 3,
  },
  {
    id: '3',
    name: 'James R.',
    title: 'Founder',
    company: 'TechStart',
    location: 'Austin, TX',
    rating: 4.7,
    reviews: 38,
    specialties: ['Entrepreneurship', 'Business Development', 'Fundraising'],
    bio: 'Serial entrepreneur with multiple successful exits. Eager to help aspiring founders.',
    availability: '2 hours/week',
    mentees: 2,
  },
  {
    id: '4',
    name: 'Maria L.',
    title: 'UX Designer',
    company: 'Apple',
    location: 'Cupertino, CA',
    rating: 4.6,
    reviews: 31,
    specialties: ['Design Thinking', 'User Research', 'Design Systems'],
    bio: 'Award-winning designer with passion for human-centered design. Available for design mentorship.',
    availability: '2-3 hours/week',
    mentees: 5,
  },
];

export default function FindMentor() {
  const [searchQuery, setSearchQuery] = useState('');
  const [selectedSpecialty, setSelectedSpecialty] = useState('');
  const [filteredMentors, setFilteredMentors] = useState(mockMentors);

  const allSpecialties = [...new Set(mockMentors.flatMap((m) => m.specialties))];

  const handleSearch = (query: string) => {
    setSearchQuery(query);
    filterMentors(query, selectedSpecialty);
  };

  const handleSpecialtyFilter = (specialty: string) => {
    setSelectedSpecialty(specialty);
    filterMentors(searchQuery, specialty);
  };

  const filterMentors = (query: string, specialty: string) => {
    let filtered = mockMentors;

    if (query) {
      const lowerQuery = query.toLowerCase();
      filtered = filtered.filter(
        (m) =>
          m.name.toLowerCase().includes(lowerQuery) ||
          m.title.toLowerCase().includes(lowerQuery) ||
          m.company.toLowerCase().includes(lowerQuery)
      );
    }

    if (specialty) {
      filtered = filtered.filter((m) => m.specialties.includes(specialty));
    }

    setFilteredMentors(filtered);
  };

  return (
    <div className="space-y-8">
      {/* Header */}
      <div>
        <h1 className="text-3xl md:text-4xl font-bold text-text">Find Your Mentor</h1>
        <p className="mt-2 text-text-secondary">
          Connect with experienced professionals who can guide your career journey
        </p>
      </div>

      {/* Search and Filter Section */}
      <div className="bg-white rounded-lg border border-border shadow-primary p-6 space-y-6">
        {/* Search Bar */}
        <div className="relative">
          <Search className="absolute left-4 top-3.5 w-5 h-5 text-text-secondary" />
          <input
            type="text"
            placeholder="Search by name, title, or company..."
            value={searchQuery}
            onChange={(e) => handleSearch(e.target.value)}
            className="w-full bg-page border border-border rounded-lg pl-12 pr-4 py-3 text-text placeholder-text-secondary focus:outline-none focus:ring-2 focus:ring-primary transition-all"
          />
        </div>

        {/* Specialty Filter */}
        <div>
          <label className="block text-sm font-semibold text-text mb-3">Filter by Specialty</label>
          <div className="flex flex-wrap gap-2">
            <button
              onClick={() => handleSpecialtyFilter('')}
              className={`px-4 py-2 rounded-full font-medium transition-colors ${
                selectedSpecialty === ''
                  ? 'bg-primary text-white'
                  : 'bg-page text-text hover:bg-impact-bg'
              }`}
            >
              All
            </button>
            {allSpecialties.map((specialty) => (
              <button
                key={specialty}
                onClick={() => handleSpecialtyFilter(specialty)}
                className={`px-4 py-2 rounded-full font-medium transition-colors ${
                  selectedSpecialty === specialty
                    ? 'bg-primary text-white'
                    : 'bg-page text-text hover:bg-impact-bg'
                }`}
              >
                {specialty}
              </button>
            ))}
          </div>
        </div>
      </div>

      {/* Mentors Grid */}
      <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6">
        {filteredMentors.length === 0 ? (
          <div className="col-span-full bg-page rounded-lg border border-border-light p-12 text-center">
            <p className="text-text-secondary">No mentors found matching your criteria. Try adjusting your filters.</p>
          </div>
        ) : (
          filteredMentors.map((mentor) => (
            <div
              key={mentor.id}
              className="bg-white rounded-lg border border-border shadow-sm hover:shadow-primary transition-shadow overflow-hidden flex flex-col"
            >
              {/* Mentor Header */}
              <div className="bg-impact-bg p-6 space-y-4">
                <div className="flex items-start justify-between">
                  <div>
                    <h3 className="text-lg font-semibold text-text">{mentor.name}</h3>
                    <p className="text-sm text-text-secondary">{mentor.title}</p>
                  </div>
                  <div className="w-12 h-12 rounded-full bg-accent text-white flex items-center justify-center font-semibold">
                    {mentor.name
                      .split(' ')
                      .map((n) => n[0])
                      .join('')}
                  </div>
                </div>

                <div className="space-y-2">
                  <p className="text-sm text-text font-medium">{mentor.company}</p>
                  <div className="flex items-center gap-2 text-xs text-text-secondary">
                    <MapPin className="w-4 h-4" />
                    {mentor.location}
                  </div>
                </div>
              </div>

              {/* Mentor Content */}
              <div className="p-6 space-y-4 flex-1">
                {/* Rating */}
                <div className="flex items-center gap-2">
                  <div className="flex items-center gap-1">
                    {Array.from({ length: 5 }).map((_, i) => (
                      <Star
                        key={i}
                        className={`w-4 h-4 ${
                          i < Math.floor(mentor.rating)
                            ? 'fill-accent text-accent'
                            : 'text-border'
                        }`}
                      />
                    ))}
                  </div>
                  <span className="text-sm font-semibold text-text">
                    {mentor.rating} ({mentor.reviews})
                  </span>
                </div>

                {/* Bio */}
                <p className="text-sm text-text-secondary line-clamp-3">{mentor.bio}</p>

                {/* Specialties */}
                <div className="flex flex-wrap gap-2">
                  {mentor.specialties.slice(0, 2).map((specialty) => (
                    <span
                      key={specialty}
                      className="bg-accent text-white text-xs px-3 py-1 rounded-full font-medium"
                    >
                      {specialty}
                    </span>
                  ))}
                  {mentor.specialties.length > 2 && (
                    <span className="bg-page text-text-secondary text-xs px-3 py-1 rounded-full">
                      +{mentor.specialties.length - 2} more
                    </span>
                  )}
                </div>

                {/* Availability and Mentees */}
                <div className="grid grid-cols-2 gap-2 text-xs bg-page rounded-lg p-3">
                  <div>
                    <p className="text-text-secondary">Availability</p>
                    <p className="font-semibold text-text">{mentor.availability}</p>
                  </div>
                  <div>
                    <p className="text-text-secondary">Current Mentees</p>
                    <p className="font-semibold text-text">{mentor.mentees}/5</p>
                  </div>
                </div>
              </div>

              {/* Action Button */}
              <div className="border-t border-border p-4">
                <button className="w-full bg-primary hover:bg-primary-dark text-white font-semibold py-2 rounded-lg transition-colors flex items-center justify-center gap-2">
                  <UserPlus className="w-4 h-4" />
                  Send Request
                </button>
              </div>
            </div>
          ))
        )}
      </div>
    </div>
  );
}
