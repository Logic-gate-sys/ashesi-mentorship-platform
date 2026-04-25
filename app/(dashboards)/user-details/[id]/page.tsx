import { notFound } from 'next/navigation';
import { MentorView } from '#/components_hooks/components/MentorView';
import { MenteeView } from '#/components_hooks/components/MenteeView';
// Mock data fetcher - replace this with your actual database/API call
async function getUserData(id) {
  // Simulate a database look-up
  // In a real app: const user = await db.user.findUnique({ where: { id } });
  
  const users = [
    {
      id: "mentor-kwesi",
      role: "mentor",
      firstName: "Kwesi",
      lastName: "Mensah",
      graduationYear: 2029,
      company: "Ashesi University",
      bio: "Full-Stack Web and Web3 Developer focused on DeFi. Currently researching Account Abstraction to simplify blockchain onboarding for mobile money users.",
      skills: ["Solidity", "Next.js", "Web3", "TypeScript"],
      languages: ["English", "Spanish", "Twi", "Haussa"]
    },
    {
      id: "mentee-daniel",
      role: "mentee",
      firstName: "Daniel",
      lastName: "Kpatamia",
      graduationYear: 2027,
      bio: "Computer Science student passionate about backend architecture and blockchain smart contracts.",
      skills: ["Python", "React", "Foundry"],
      interests: ["Fintech", "SaaS", "Open Source"]
    }
  ];

  return users.find(u => u.id === id) || null;
}

export default async function UserDetailPage({ params }) {
  const { id } = await params;
  const user = await getUserData(id);

  // If no user is found, trigger the Next.js 404 page
  if (!user) {
    notFound();
  }

  return (
    <div className="min-h-screen bg-[#FAFAFA]">
      {/* Optional: Global Breadcrumb/Navigation */}
      <nav className="max-w-6xl mx-auto px-6 py-4">
        <div className="text-sm text-gray-500">
          Profiles / <span className="text-[#8B3A3A] font-semibold">{user.firstName} {user.lastName}</span>
        </div>
      </nav>

      <main className="max-w-6xl mx-auto p-6 pb-20">
        {user.role === 'mentor' ? (
          <MentorView user={user} />
        ) : (
          <MenteeView user={user} />
        )}
      </main>
    </div>
  );
}