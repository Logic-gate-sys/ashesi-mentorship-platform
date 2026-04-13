'use client'
import { QuickInfoCard } from "@/app/_components_and_hooks/ui/reusable-ui/CickableStatCard";
import { useAuth } from "@/app/ _libs_and_schemas/context/auth-context";
import { BellIcon } from "lucide-react";
import Image from 'next/image'


export default function MentorHomePage(){
     const {user}= useAuth(); 
    return(
        <div id='mentor-dash-home' className=" text-4xl text-accent flex flex-row items-start">
            <div id='top-most' className="flex flex-row items-center gap-12 ">
             <section id='welcome-section' className="h-6 w-140.5 left-2">
                <h1 className="text-3xl">Welcome Back, {user?.firstName} </h1>
                <p className="font-normal text-[20px]"> Ready to guide the next generation of scholars !</p>
             </section>

             <section id='profile' className="flex flex-row gap-1 items-center ml-auto">
               <div id='icon'>
                <BellIcon className="text-accent" />
               </div>
               <div id="name-title">
                  <h1>{user?.firstName} {user?.lastName}</h1>
                   <p> {user?.profession}</p>
               </div>
               <Image src={user?.avatarUrl??""} alt="user-profile-image"/>
             </section>
            </div>

            <div id='stats' className="flex md:flex-row gap-4 p-2">
               

            </div>
            

            <div id='stats-section' className="">
                  
            </div>
        </div>
    )
}