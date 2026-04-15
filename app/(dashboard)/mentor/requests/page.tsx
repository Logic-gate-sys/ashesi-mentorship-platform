import { DashboardContainer } from '@/app/_components/dashboard';

export default function RequestsDashboard() {
  return (
    <DashboardContainer>
      <div className="space-y-8">
        <div>
          <h1 className="text-3xl font-bold text-gray-900">Mentorship Requests</h1>
          <p className="mt-2 text-gray-600">
            Review and respond to new mentorship requests from students.
          </p>
        </div>

        {/* Placeholder content */}
        <div className="bg-white rounded-lg border border-gray-200 p-8 text-center">
          <p className="text-gray-500">Requests list coming soon...</p>
        </div>
      </div>
    </DashboardContainer>
  );
}
