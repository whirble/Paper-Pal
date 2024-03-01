'use client'
import React from 'react'
import { DrizzleChat } from '@/lib/db/schema'
import Link from 'next/link'
import {Button} from './ui/button'
import {ArrowRight, Bot, FilePlus2, GitBranchPlus, HelpCircle, Home, MessageCircleMore, Plus, PlusCircle, ShieldEllipsis, Sparkles} from 'lucide-react'
import {MessageCircle} from 'lucide-react'
import { cn } from '@/lib/utils'
import axios from 'axios'
import { checkSubscription } from '@/lib/subscription'
import { UserButton } from '@clerk/nextjs'


type Props = {
    chats: DrizzleChat[],
    chatId: number,
    isPro: boolean,
}


const ChatSideBar = ({chats, chatId, isPro}: Props) => {

    const [loading, setLoading] = React.useState(false);

    return (
        <div className='relative w-full h-screen p-4 bg-[#000]'>
            <Link href={'/'} className='p-2 rounded-lg text-sm text-white w-full border border-gray-700 flex items-center justify-between hover:bg-gray-900 group'>
                <div className='flex items-center'>
                    <GitBranchPlus className='mr-2 w-4 h-4' />
                    Nouveau conversation
                </div>
                <ArrowRight className='mr-5 w-4 h-4  invisible transform transition duration-200 group-hover:visible group-hover:translate-x-5 ' />
            </Link>


            <div className='flex flex-col gap-2 mt-4 h-[70%] overflow-y-auto scrollbar-thin-rounded text-gray-200'>
                {chats.map(chat => (
                    <Link key={chat.id} href={`/chat/${chat.id}`}>
                        <div className={
                            cn('rounded-lg p-2 text-slate-300 flex items-center ',{
                                'bg-blue-400 text-white' : chat.id === chatId,
                                'hover:bg-gray-900 hover:text-white' : chat.id !== chatId
                            })
                        }>
                            {/* <MessageCircleMore className='mr-2' /> */}
                            <p className='w-full overflow-hidden text-sm truncate whitespace-nowrap text-ellipsis'>{chat.pdfName}</p>
                        </div>
                    </Link>
                ))}
            </div>

            <div className='absolute bottom-2 left-6 w-5/6 border-gray-400 py-2'>
                <div className='flex items-start justify-end gap-2 flex-col w-full '>

                    {/* Subscription button */}
                    {/* <SubscriptionBtn isPro={isPro}/> */}
                    {/* user button */}
                    <UserButton afterSignOutUrl='/'/>

                </div>
            </div>


        </div>
    )
}

export default ChatSideBar;