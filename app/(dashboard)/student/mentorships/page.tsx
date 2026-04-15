import { DashboardContainer } from '@/app/_components/dashboard';

export default function MentorshipsDashboard() {
  return (
    <DashboardContainer>
      <div className="space-y-8">
        <div>
          <h1 className="text-3xl font-bold text-gray-900">My Mentorships</h1>
          <p className="mt-2 text-gray-600">
            View your active mentorship relationships and progress.
          </p>
        </div>

        {/* Placeholder content */}
        <div className="bg-white rounded-lg border border-gray-200 p-8 text-center">
          <p className="text-gray-500">Mentorships list coming soon...</p>
        </div>
      </div>
    </DashboardContainer>
  );
}
