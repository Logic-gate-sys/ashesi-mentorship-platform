import { SectionHeader } from '@/app/_components/ui/_index';

export default function AlumniFeedbackPage() {
  return (
    <div className="px-8 py-7 max-w-300 mx-auto">
      <div className="flex items-center justify-between mb-8 flex-wrap gap-3">
        <div>
          <h1 className="font-display font-bold text-[26px] text-text tracking-tight">
            Feedback & Reviews
          </h1>
          <p className="font-body text-[14px] text-text-muted mt-1">
            Read reviews from your completed sessions
          </p>
        </div>
      </div>
      <div className="card p-6 min-h-[400px] flex items-center justify-center">
        <p className="text-text-muted">Content coming soon...</p>
      </div>
    </div>
  );
}
