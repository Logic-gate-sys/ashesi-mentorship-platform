"use client";
import { User } from "@/prisma/generated/prisma/client";
import { BellIcon } from "lucide-react";
import Image from "next/image";

interface UserProps {
  firstName: string;
  lastName: string;
  profession: string;
  avatarUrl: string;
}

export function TopStrinp(user: UserProps) {
  return (
<div id="top-most" className="w-full max-h-24 flex flex-row justify-center items-start pb-6 border-b border-accent/10">

  <section id="welcome-sec" className="w-full flex flex-col items-start justify-center">
    <h1 className="text-3xl font-bold tracking-tight text-accent">
      Welcome Back, {user?.firstName}!
    </h1>
    <p className="text-gray-500 font-medium">
      Ready to guide the next generation of scholars!
    </p>
  </section>

  <section id="profile" className="ml-auto w-full flex flex-row justify-end gap-2 p-2">
    <button className="relative p-2 rounded-full hover:bg-accent/5 transition-colors">
      <BellIcon className="w-6 h-6 text-accent" />
      <span className="absolute top-2 right-2 w-2 h-2 bg-red-500 rounded-full border-2 border-white" />
    </button>

    <div className="flex flex-row items-center gap-4">
      <div id="name-title" className="text-right hidden sm:block">
        <h1 className="text-lg font-bold leading-none">
          {user?.firstName} {user?.lastName}
        </h1>
        <p className="text-sm text-gray-500 mt-1">
          {user?.profession}
        </p>
      </div>
      
      <div className="relative w-12 h-12 rounded-full overflow-hidden border-2 border-accent/20">
        <Image 
          src={user?.avatarUrl || "/default-avatar.png"} 
          alt="Profile" 
          fill
          className="object-cover"
        />
      </div>
    </div>
  </section>
</div>
  );
}
