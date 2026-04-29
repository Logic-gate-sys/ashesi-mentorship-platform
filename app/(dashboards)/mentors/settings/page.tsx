"use client";

import { FormEvent, useEffect, useMemo, useState } from "react";
import Image from "next/image";
import { Check, Loader2, RefreshCw, Save } from "lucide-react";
import { useMentorProfile } from "#comp-hooks/hooks/mentor";

type ProfileFormState = {
  firstName: string;
  lastName: string;
  avatarUrl: string;
  graduationYear: string;
  major: string;
  company: string;
  jobTitle: string;
  industry: string;
  bio: string;
  linkedin: string;
  skillsText: string;
  isAvailable: boolean;
  maxMentees: string;
};

const EMPTY_FORM: ProfileFormState = {
  firstName: "",
  lastName: "",
  avatarUrl: "",
  graduationYear: "",
  major: "",
  company: "",
  jobTitle: "",
  industry: "",
  bio: "",
  linkedin: "",
  skillsText: "",
  isAvailable: true,
  maxMentees: "5",
};

export default function MentorSettingsPage() {
  const { profile, isLoading, isSaving, saveSuccess, error, refresh, saveProfile } = useMentorProfile();

  const [formState, setFormState] = useState<ProfileFormState>(EMPTY_FORM);

  useEffect(() => {
    if (!profile) {
      return;
    }

    setFormState({
      firstName: profile.user.firstName || "",
      lastName: profile.user.lastName || "",
      avatarUrl: profile.user.avatarUrl || "",
      graduationYear: String(profile.mentorProfile.graduationYear || ""),
      major: profile.mentorProfile.major || "",
      company: profile.mentorProfile.company || "",
      jobTitle: profile.mentorProfile.jobTitle || "",
      industry: profile.mentorProfile.industry || "",
      bio: profile.mentorProfile.bio || "",
      linkedin: profile.mentorProfile.linkedin || "",
      skillsText: profile.mentorProfile.skills.join(", "),
      isAvailable: profile.mentorProfile.isAvailable,
      maxMentees: String(profile.mentorProfile.maxMentees || 5),
    });
  }, [profile]);

  const previewAvatar = useMemo(() => {
    return formState.avatarUrl || "https://i.pravatar.cc/160?u=mentor-settings";
  }, [formState.avatarUrl]);

  const onSubmit = async (event: FormEvent<HTMLFormElement>) => {
    event.preventDefault();

    const parsedSkills = formState.skillsText
      .split(",")
      .map((item) => item.trim())
      .filter(Boolean);

    await saveProfile({
      user: {
        firstName: formState.firstName,
        lastName: formState.lastName,
        avatarUrl: formState.avatarUrl || null,
      },
      mentorProfile: {
        graduationYear: Number(formState.graduationYear),
        major: formState.major,
        company: formState.company,
        jobTitle: formState.jobTitle,
        industry: formState.industry,
        bio: formState.bio || null,
        linkedin: formState.linkedin || null,
        skills: parsedSkills,
        isAvailable: formState.isAvailable,
        maxMentees: Number(formState.maxMentees),
      },
    });
  };

  return (
    <div className="flex flex-col gap-6 pb-8">
      <section className="flex flex-wrap items-start justify-between gap-4">
        <div>
          <h1 className="text-2xl font-bold text-[#241919]">Profile Settings</h1>
          <p className="text-gray-500">Update your public mentor profile and availability preferences.</p>
        </div>

        <button
          onClick={() => void refresh()}
          className="inline-flex items-center gap-2 rounded-xl border border-gray-200 px-4 py-2 text-sm font-medium text-[#6A0A1D] hover:bg-[#FDF1F2]"
        >
          <RefreshCw className="h-4 w-4" />
          Reload Profile
        </button>
      </section>

      {error ? (
        <div className="rounded-xl border border-red-200 bg-red-50 p-3 text-sm text-red-700">{error}</div>
      ) : null}

      {isLoading && !profile ? (
        <p className="text-sm text-gray-500">Loading profile...</p>
      ) : null}

      <form onSubmit={onSubmit} className="grid gap-4 lg:grid-cols-[1fr_2fr]">
        <aside className="rounded-3xl border border-[#6A0A1D]/10 bg-white p-5 shadow-sm">
          <div className="flex flex-col items-center gap-3">
            <div className="relative h-24 w-24 overflow-hidden rounded-full border border-gray-200">
              <Image src={previewAvatar} alt="Mentor avatar" fill className="object-cover" />
            </div>

            <div className="text-center">
              <p className="text-lg font-semibold text-[#241919]">
                {formState.firstName || "Mentor"} {formState.lastName}
              </p>
              <p className="text-sm text-gray-500">{profile?.user.email || ""}</p>
            </div>
          </div>

          <div className="mt-5 space-y-3 border-t pt-4">
            <label className="flex flex-col gap-1 text-sm text-gray-600">
              Avatar URL
              <input
                value={formState.avatarUrl}
                onChange={(event) =>
                  setFormState((prev) => ({ ...prev, avatarUrl: event.target.value }))
                }
                className="rounded-xl border border-gray-200 px-3 py-2 outline-none focus:border-[#6A0A1D]/30"
                placeholder="https://..."
              />
            </label>

            <label className="inline-flex items-center gap-2 text-sm text-[#241919]">
              <input
                type="checkbox"
                checked={formState.isAvailable}
                onChange={(event) =>
                  setFormState((prev) => ({ ...prev, isAvailable: event.target.checked }))
                }
                className="h-4 w-4 rounded border-gray-300"
              />
              Open to new mentees
            </label>

            <label className="flex flex-col gap-1 text-sm text-gray-600">
              Max Mentees
              <input
                type="number"
                min={1}
                value={formState.maxMentees}
                onChange={(event) =>
                  setFormState((prev) => ({ ...prev, maxMentees: event.target.value }))
                }
                className="rounded-xl border border-gray-200 px-3 py-2 outline-none focus:border-[#6A0A1D]/30"
              />
            </label>
          </div>
        </aside>

        <section className="rounded-3xl border border-[#6A0A1D]/10 bg-white p-5 shadow-sm">
          <div className="grid gap-3 sm:grid-cols-2">
            <Field
              label="First Name"
              value={formState.firstName}
              onChange={(value) => setFormState((prev) => ({ ...prev, firstName: value }))}
            />
            <Field
              label="Last Name"
              value={formState.lastName}
              onChange={(value) => setFormState((prev) => ({ ...prev, lastName: value }))}
            />
            <Field
              label="Graduation Year"
              value={formState.graduationYear}
              onChange={(value) => setFormState((prev) => ({ ...prev, graduationYear: value }))}
              type="number"
            />
            <Field
              label="Major"
              value={formState.major}
              onChange={(value) => setFormState((prev) => ({ ...prev, major: value }))}
            />
            <Field
              label="Company"
              value={formState.company}
              onChange={(value) => setFormState((prev) => ({ ...prev, company: value }))}
            />
            <Field
              label="Job Title"
              value={formState.jobTitle}
              onChange={(value) => setFormState((prev) => ({ ...prev, jobTitle: value }))}
            />
            <Field
              label="Industry"
              value={formState.industry}
              onChange={(value) => setFormState((prev) => ({ ...prev, industry: value }))}
            />
            <Field
              label="LinkedIn"
              value={formState.linkedin}
              onChange={(value) => setFormState((prev) => ({ ...prev, linkedin: value }))}
            />
          </div>

          <div className="mt-3 grid gap-3">
            <label className="flex flex-col gap-1 text-sm text-gray-600">
              Skills (comma-separated)
              <input
                value={formState.skillsText}
                onChange={(event) =>
                  setFormState((prev) => ({ ...prev, skillsText: event.target.value }))
                }
                className="rounded-xl border border-gray-200 px-3 py-2 outline-none focus:border-[#6A0A1D]/30"
                placeholder="System Design, Leadership, Python"
              />
            </label>

            <label className="flex flex-col gap-1 text-sm text-gray-600">
              Bio
              <textarea
                value={formState.bio}
                onChange={(event) => setFormState((prev) => ({ ...prev, bio: event.target.value }))}
                rows={5}
                className="rounded-xl border border-gray-200 px-3 py-2 outline-none focus:border-[#6A0A1D]/30"
                placeholder="Share your mentorship approach and professional background"
              />
            </label>
          </div>

          <button
            type="submit"
            disabled={isSaving}
            className={`mt-4 inline-flex items-center gap-2 rounded-xl px-4 py-2 text-sm font-semibold text-white transition ${
              saveSuccess ? "bg-[#1B5E20]" : "bg-[#6A0A1D] hover:brightness-110"
            } disabled:cursor-not-allowed disabled:opacity-60`}
          >
            {isSaving ? (
              <>
                <Loader2 className="h-4 w-4 animate-spin" />
                Saving...
              </>
            ) : saveSuccess ? (
              <>
                <Check className="h-4 w-4" />
                Saved
              </>
            ) : (
              <>
                <Save className="h-4 w-4" />
                Save Changes
              </>
            )}
          </button>
        </section>
      </form>
    </div>
  );
}

function Field({
  label,
  value,
  onChange,
  type = "text",
}: {
  label: string;
  value: string;
  onChange: (value: string) => void;
  type?: string;
}) {
  return (
    <label className="flex flex-col gap-1 text-sm text-gray-600">
      {label}
      <input
        type={type}
        value={value}
        onChange={(event) => onChange(event.target.value)}
        className="rounded-xl border border-gray-200 px-3 py-2 outline-none focus:border-[#6A0A1D]/30"
      />
    </label>
  );
}
