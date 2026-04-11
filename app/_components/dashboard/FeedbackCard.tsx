'use client';

import React from 'react';

interface FeedbackCardProps {
  id: string;
  date: Date;
  topic: string;
  mentorName: string;
  mentorCompany: string;
  rating: number;
  feedback: string;
  duration: number;
}

export default function FeedbackCard({
  id,
  date,
  topic,
  mentorName,
  mentorCompany,
  rating,
  feedback,
  duration,
}: FeedbackCardProps) {
  const dateStr = date.toLocaleDateString('en-US', { month: 'short', day: 'numeric' });
  const stars = Array(rating).fill(0);
  const emptyStars = Array(5 - rating).fill(0);

  return (
    <div className="rounded-lg border border-border bg-surface p-6 space-y-4">
      {/* Header with checkmark and date */}
      <div className="flex items-start justify-between border-b border-border pb-3">
        <div className="flex items-start gap-3">
          <div className="text-2xl">✅</div>
          <div>
            <p className="text-sm font-semibold text-text">{dateStr}</p>
            <p className="text-sm text-text italic mt-1">"{topic}"</p>
            <p className="text-xs text-text-secondary mt-1">
              with {mentorName} ({mentorCompany})
            </p>
          </div>
        </div>
      </div>

      {/* Rating */}
      <div className="space-y-2">
        <p className="text-xs text-text-secondary">Your Rating</p>
        <div className="flex items-center gap-2">
          <div className="flex gap-1">
            {stars.map((_, i) => (
              <span key={`filled-${i}`} className="text-lg">
                ⭐
              </span>
            ))}
            {emptyStars.map((_, i) => (
              <span key={`empty-${i}`} className="text-lg opacity-30">
                ⭐
              </span>
            ))}
          </div>
          <span className="text-sm font-semibold text-text">
            {rating}/5{' '}
            <span className="text-xs text-text-secondary">
              ({rating === 5 ? 'Excellent!' : rating >= 4 ? 'Great!' : rating >= 3 ? 'Good' : 'Fair'})
            </span>
          </span>
        </div>
      </div>

      {/* Feedback Comment */}
      <div className="space-y-2">
        <p className="text-xs text-text-secondary">Your Feedback</p>
        <p className="text-sm text-text bg-page rounded p-3 leading-relaxed">{feedback}</p>
      </div>

      {/* Duration */}
      <div className="text-xs text-text-secondary">Duration: {duration} minutes</div>
    </div>
  );
}
