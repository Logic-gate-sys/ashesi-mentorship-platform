"use client";

import { FormEvent, useEffect, useMemo, useState } from "react";
import Image from "next/image";
import { Check, Loader2, RefreshCw, Save } from "lucide-react";
import { useMenteeProfile } from "#comp-hooks/hooks/mentee/useMenteeProfile";

type ProfileFormState = {
  firstName: string;
  lastName: string;
  avatarUrl: string;
  yearGroup: string;
  major: string;
  bio: string;
  linkedin: string;
  interestsText: string;
};

const EMPTY_FORM: ProfileFormState = {
  firstName: "",
  lastName: "",
  avatarUrl: "",
  yearGroup: "",
  major: "",
  bio: "",
  linkedin: "",
  interestsText: "",
};

export default function MenteeSettingsPage() {
  const { profile, isLoading, isSaving, saveSuccess, error, refresh, saveProfile } = useMenteeProfile();

  const [formState, setFormState] = useState<ProfileFormState>(EMPTY_FORM);
  const [avatarFile, setAvatarFile] = useState<File | null>(null);

  useEffect(() => {
    if (!profile) {
      return;
    }

    setFormState({
      firstName: profile.user.firstName || "",
      lastName: profile.user.lastName || "",
      avatarUrl: profile.user.avatarUrl || "",
      yearGroup: profile.menteeProfile.yearGroup || "",
      major: profile.menteeProfile.major || "",
      bio: profile.menteeProfile.bio || "",
      linkedin: profile.menteeProfile.linkedin || "",
      interestsText: Array.isArray(profile.menteeProfile.interests) ? profile.menteeProfile.interests.join(", ") : "",
    });
  }, [profile]);

  const previewAvatar = useMemo(() => {
    return formState.avatarUrl || profile?.user?.avatarUrl || "https://i.pravatar.cc/160?u=mentee-settings";
  }, [formState.avatarUrl]);

  const onSubmit = async (event: FormEvent<HTMLFormElement>) => {
    event.preventDefault();

    const parsedInterests = formState.interestsText
      .split(",")
      .map((item) => item.trim())
      .filter(Boolean);

    const payload = new FormData();
    payload.append("firstName", formState.firstName);
    payload.append("lastName", formState.lastName);
    payload.append("yearGroup", formState.yearGroup);
    payload.append("major", formState.major);
    if (formState.bio) payload.append("bio", formState.bio);
    if (formState.linkedin) payload.append("linkedin", formState.linkedin);
    payload.append("interests", JSON.stringify(parsedInterests));
    if (avatarFile) payload.append("avatar", avatarFile);

    await saveProfile(payload);
  };

  return (
    <div className="flex flex-col gap-6 pb-8">
      <section className="flex flex-wrap items-start justify-between gap-4">
        <div>
          <h1 className="text-2xl font-bold text-[#241919]">Profile Settings</h1>
          <p className="text-gray-500">Update your mentee profile and academic information.</p>
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
              <Image src={previewAvatar} alt="Mentee avatar" fill className="object-cover" />
            </div>

            <div className="text-center">
              <p className="text-lg font-semibold text-[#241919]">
                {formState.firstName || "Student"} {formState.lastName}
              </p>
              <p className="text-sm text-gray-500">{profile?.user.email || ""}</p>
            </div>
          </div>

          <div className="mt-5 space-y-3 border-t pt-4">
            <label className="flex flex-col gap-1 text-sm text-gray-600">
              Professional headshot photo
              <input
                type="file"
                accept="image/*"
                onChange={(event) => {
                  const file = event.target.files?.[0] ?? null;
                  setAvatarFile(file);
                }}
                className="rounded-xl border border-gray-200 px-3 py-2 outline-none focus:border-[#6A0A1D]/30"
              />
              <p className="text-xs text-gray-500">Leave empty to keep current photo</p>
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
              label="Year Group"
              value={formState.yearGroup}
              onChange={(value) => setFormState((prev) => ({ ...prev, yearGroup: value }))}
            />
            <Field
              label="Major"
              value={formState.major}
              onChange={(value) => setFormState((prev) => ({ ...prev, major: value }))}
            />
            <Field
              label="LinkedIn"
              value={formState.linkedin}
              onChange={(value) => setFormState((prev) => ({ ...prev, linkedin: value }))}
            />
          </div>

          <div className="mt-3 grid gap-3">
            <label className="flex flex-col gap-1 text-sm text-gray-600">
              Interests (comma-separated)
              <input
                value={formState.interestsText}
                onChange={(event) =>
                  setFormState((prev) => ({ ...prev, interestsText: event.target.value }))
                }
                className="rounded-xl border border-gray-200 px-3 py-2 outline-none focus:border-[#6A0A1D]/30"
                placeholder="Career development, Tech, Leadership"
              />
            </label>

            <label className="flex flex-col gap-1 text-sm text-gray-600">
              Bio
              <textarea
                value={formState.bio}
                onChange={(event) => setFormState((prev) => ({ ...prev, bio: event.target.value }))}
                rows={5}
                className="rounded-xl border border-gray-200 px-3 py-2 outline-none focus:border-[#6A0A1D]/30"
                placeholder="Tell mentors about your academic journey and mentorship goals"
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
