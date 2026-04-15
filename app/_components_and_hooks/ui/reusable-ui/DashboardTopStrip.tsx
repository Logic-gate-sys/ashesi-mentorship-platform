"use client";
import { User } from "@/prisma/generated/prisma/client";
import { BellIcon } from "lucide-react";
import Image from "next/image";
import TestImage from '@/comp&hooks/images/scott-moss.png'

interface UserProps {
  firstName: string;
  lastName: string;
  profession: string;
  avatarUrl: string;
}

export function TopLeftProfile(user: UserProps) {
  return (
<div id="top-most" className="flex flex-row justify-end items-center  border-b border-accent/10 gap-2 md:gap-4 p-1">
    <button className="relative rounded-full hover:bg-accent/5 transition-colors">
      <BellIcon className="w-6 h-fit text-accent" />
      <span className="absolute top-2 right-2 w-2 h-2 bg-red-500 rounded-full border-2 border-white" />
    </button>
    
    <section id='name-avatar' className="ml-24  flex flex-row items-center justify-center gap-1">
     <div id="name-title" className="flex flex-col justify-end items-end">
        <h1 className="text-lg font-bold ">
          {user?.firstName} {user?.lastName}
        </h1>
        <p className="text-sm text-gray-500">
          {user?.profession}
        </p>
      </div>
      
      <div className="relative w-12 h-12 rounded-full overflow-hidden border-2 border-accent/20">
        <Image 
          src={user?.avatarUrl || TestImage } 
          alt="Profile" 
          fill
          className="object-cover"
        />
      </div>
    </section>
     
</div>
  );
}
