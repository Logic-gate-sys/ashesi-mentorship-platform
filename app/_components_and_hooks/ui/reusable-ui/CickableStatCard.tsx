'use client'
import Image from 'next/image';

export function QuickInfoCard({title,icon, statsNum}:{title: string, icon: string, statsNum: number}){
    return (
        <div className='bg-[#FFF0F0] rounded-l-[40px] rounded-br-[40px] grid grid-cols-2 gap-4 p-8'>
            <div id='title-and-number' className="text-2xl flex flex-row gap-2">
                <h1 className='text-[#6A0A1DB2]'>{title.toUpperCase()}</h1>
                <p className='text-[#241919] font-bold'>{statsNum}</p>
            </div>
            <div>
            <Image src={icon} alt='statsicon' />
            </div>
        </div>
    )

}