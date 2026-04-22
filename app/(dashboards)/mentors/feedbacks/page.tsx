"use client";

import { useEffect, useMemo } from "react";
import Image from "next/image";
import { RefreshCw, Star, Users, CalendarCheck2, MessageSquareText } from "lucide-react";
import { useMentorFeedback, useMentorRealtime } from "#comp-hooks/hooks/mentor";

const STAR_FILL = "#6A0A1D";

function formatDate(dateText: string) {
  const date = new Date(dateText);
  if (Number.isNaN(date.getTime())) {
    return "Unknown date";
  }

  return date.toLocaleDateString([], {
    month: "short",
    day: "numeric",
    year: "numeric",
  });
}

function RatingStars({ value }: { value: number }) {
  return (
    <div className="flex items-center gap-0.5">
      {[1, 2, 3, 4, 5].map((star) => (
        <Star
          key={star}
          className="h-4 w-4"
          color={star <= value ? STAR_FILL : "#D1D5DB"}
          fill={star <= value ? STAR_FILL : "none"}
        />
      ))}
    </div>
  );
}

export default function MentorFeedbackPage() {
  const { feedback, metrics, topRatingCount, isLoading, error, refresh } = useMentorFeedback();
  const { enabled, on } = useMentorRealtime();

  useEffect(() => {
    if (!enabled) {
      return;
    }

    const unsubNotification = on("notification", () => {
      void refresh();
    });

    return () => {
      unsubNotification();
    };
  }, [enabled, on, refresh]);

  const averageRatingDisplay = useMemo(() => {
    return metrics.averageRating ? metrics.averageRating.toFixed(1) : "0.0";
  }, [metrics.averageRating]);

  const ratingBreakdown = useMemo(() => {
    const buckets = [5, 4, 3, 2, 1].map((rating) => ({ rating, count: 0 }));

    for (const item of feedback) {
      const bucket = buckets.find((entry) => entry.rating === item.rating);
      if (bucket) {
        bucket.count += 1;
      }
    }

    return buckets;
  }, [feedback]);

  return (
    <div className="flex flex-col gap-6 pb-8">
      <section className="flex flex-wrap items-start justify-between gap-4">
        <div>
          <h1 className="text-2xl font-bold text-[#241919]">Feedback Insights</h1>
          <p className="text-gray-500">Track mentee sentiment and session outcomes over time.</p>
        </div>

        <button
          onClick={() => void refresh()}
          className="inline-flex items-center gap-2 rounded-xl border border-gray-200 px-4 py-2 text-sm font-medium text-[#6A0A1D] hover:bg-[#FDF1F2]"
        >
          <RefreshCw className="h-4 w-4" />
          Refresh
        </button>
      </section>

      {error ? (
        <div className="rounded-xl border border-red-200 bg-red-50 p-3 text-sm text-red-700">{error}</div>
      ) : null}

      <section className="grid gap-4 sm:grid-cols-2 xl:grid-cols-5">
        <MetricCard label="Total Mentees" value={metrics.totalMentees} icon={<Users className="h-4 w-4" />} />
        <MetricCard
          label="Total Sessions"
          value={metrics.totalSessions}
          icon={<CalendarCheck2 className="h-4 w-4" />}
        />
        <MetricCard
          label="Completed Sessions"
          value={metrics.completedSessions}
          icon={<CalendarCheck2 className="h-4 w-4" />}
        />
        <MetricCard
          label="Average Rating"
          value={averageRatingDisplay}
          icon={<Star className="h-4 w-4" />}
        />
        <MetricCard
          label="Top Ratings (4-5)"
          value={topRatingCount}
          icon={<MessageSquareText className="h-4 w-4" />}
        />
      </section>

      <section className="grid gap-4 lg:grid-cols-[1fr_2fr]">
        <aside className="rounded-3xl border border-[#6A0A1D]/10 bg-white p-5 shadow-sm">
          <h2 className="mb-4 text-lg font-semibold text-[#241919]">Rating Distribution</h2>

          {!feedback.length && !isLoading ? (
            <p className="text-sm text-gray-500">No feedback submitted yet.</p>
          ) : null}

          <div className="space-y-3">
            {ratingBreakdown.map((entry) => {
              const total = metrics.totalFeedback || feedback.length || 1;
              const percentage = Math.round((entry.count / total) * 100);

              return (
                <div key={entry.rating} className="grid grid-cols-[32px_1fr_auto] items-center gap-2">
                  <span className="text-sm font-semibold text-[#241919]">{entry.rating}</span>
                  <div className="h-2 rounded-full bg-gray-100">
                    <div
                      className="h-2 rounded-full bg-[#6A0A1D] transition-all duration-300"
                      style={{ width: `${percentage}%` }}
                    />
                  </div>
                  <span className="text-xs text-gray-500">{entry.count}</span>
                </div>
              );
            })}
          </div>
        </aside>

        <main className="rounded-3xl border border-[#6A0A1D]/10 bg-white p-5 shadow-sm">
          <h2 className="mb-4 text-lg font-semibold text-[#241919]">Recent Feedback</h2>

          {isLoading ? <p className="text-sm text-gray-500">Loading feedback...</p> : null}

          {!isLoading && !feedback.length ? (
            <p className="text-sm text-gray-500">No feedback records yet.</p>
          ) : null}

          <div className="grid gap-3">
            {feedback.map((item) => (
              <article
                key={item.id}
                className="rounded-2xl border border-gray-100 bg-[#FAFAFA] p-4"
              >
                <div className="flex items-start justify-between gap-3">
                  <div className="flex items-center gap-3">
                    <div className="relative h-11 w-11 overflow-hidden rounded-full border border-gray-100">
                      <Image src={item.menteeAvatar} alt={item.menteeName} fill className="object-cover" />
                    </div>

                    <div>
                      <h3 className="text-sm font-semibold text-[#241919]">{item.menteeName}</h3>
                      <p className="text-xs text-gray-500">{item.topic}</p>
                    </div>
                  </div>

                  <RatingStars value={item.rating} />
                </div>

                <p className="mt-3 text-sm text-gray-700">{item.comment}</p>
                <p className="mt-2 text-xs text-gray-500">{formatDate(item.createdAt)}</p>
              </article>
            ))}
          </div>
        </main>
      </section>
    </div>
  );
}

function MetricCard({
  label,
  value,
  icon,
}: {
  label: string;
  value: number | string;
  icon: React.ReactNode;
}) {
  return (
    <div className="rounded-2xl border border-[#6A0A1D]/10 bg-white p-4 shadow-sm">
      <p className="mb-2 inline-flex items-center gap-2 text-xs font-semibold uppercase tracking-wide text-gray-500">
        {icon}
        {label}
      </p>
      <p className="text-2xl font-bold text-[#241919]">{value}</p>
    </div>
  );
}
