import { DashboardContainer } from '@/app/_components/dashboard';

export default function ProfilePage() {
  return (
    <DashboardContainer>
      <div className="space-y-8">
        <div>
          <h1 className="text-3xl font-bold text-gray-900">Profile</h1>
          <p className="mt-2 text-gray-600">
            View and manage your profile information.
          </p>
        </div>

        {/* Placeholder content */}
        <div className="bg-white rounded-lg border border-gray-200 p-8 text-center">
          <p className="text-gray-500">Profile editor coming soon...</p>
        </div>
      </div>
    </DashboardContainer>
  );
}
