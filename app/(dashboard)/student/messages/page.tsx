import { DashboardContainer } from '@/app/_components/dashboard';

export default function StudentMessagesDashboard() {
  return (
    <DashboardContainer>
      <div className="space-y-8">
        <div>
          <h1 className="text-3xl font-bold text-gray-900">Messages</h1>
          <p className="mt-2 text-gray-600">
            Chat with your mentor and stay on track.
          </p>
        </div>

        {/* Placeholder content */}
        <div className="bg-white rounded-lg border border-gray-200 p-8 text-center">
          <p className="text-gray-500">Messages coming soon...</p>
        </div>
      </div>
    </DashboardContainer>
  );
}
