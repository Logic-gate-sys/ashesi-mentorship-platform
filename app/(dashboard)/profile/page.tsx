import { DashboardContainer } from '@/app/_components/dashboard';

export default function ProfilePage() {
  return (
    <DashboardContainer>
      <div className="space-y-8">
        <div>
          <h1 className="text-3xl font-bold text-text">Profile</h1>
          <p className="mt-2 text-text-secondary">
            View and manage your profile information.
          </p>
        </div>

        {/* Placeholder content */}
        <div className="bg-surface rounded-lg border border-border p-8 text-center">
          <p className="text-text-tertiary">Profile editor coming soon...</p>
        </div>
      </div>
    </DashboardContainer>
  );
}
