import React from 'react'
import Link from 'next/link';
import { UserButton, auth } from '@clerk/nextjs'
import { Button } from '@/components/ui/button'
import Image from 'next/image'
import { ArrowUpRight, LogIn, User, AudioLines, TextQuote, Quote } from 'lucide-react';
import FileUpload from '@/components/fileUpload';
import { checkSubscription } from '@/lib/subscription';
import { db } from '@/lib/db';
import { chats } from '@/lib/db/schema';
import { eq } from 'drizzle-orm';
import {ArrowRight, ArrowUpRightSquare} from 'lucide-react'
import SubscriptionBtn from '@/components/SubscriptionBtn'
import TypeEffect from '@/components/typeeffect'
import {Tilt} from 'react-tilt'
import { cn } from '@/lib/utils';

const defaultOptions = {
	reverse:        false,  // reverse the tilt direction
	max:            35,     // max tilt rotation (degrees)
	perspective:    1000,   // Transform perspective, the lower the more extreme the tilt gets.
	scale:          1.1,    // 2 = 200%, 1.5 = 150%, etc..
	speed:          1000,   // Speed of the enter/exit transition
	transition:     true,   // Set a transition on enter/exit.
	axis:           null,   // What axis should be disabled. Can be X or Y.
	reset:          true,    // If the tilt effect has to be reset on exit.
	easing:         "cubic-bezier(.03,.98,.52,.99)",    // Easing on enter/exit.
}


export default async function Home() {
  const { userId } = auth();
  const isAuth = !!userId;
  const isPro = await checkSubscription();
  let FirstChat
  if(userId) {
    FirstChat = await db.select().from(chats).where(eq(chats.userId, userId))
    if(FirstChat){
      FirstChat = FirstChat[0]
    }
  }
  return (

    <div className={cn('fixed w-screen h-screen overflow-auto', {
      '' : isAuth,
      'bg-black' : !isAuth,
    })}>
      {/* nav bar */}
      <div className={`absolute top-0 left-0 w-full h-auto border-b border-solid ${isAuth ? 'border-slate-300' : 'border-transparent'} px-10 py-5 flex items-center justify-between gap-5`}>
        <div className={`relative text-4xl tracking-normal font-normale ${isAuth ? 'text-[#00467F]' : 'text-white'}`}>
          <a href="/">PaperPal</a>
        </div>
        <div className='flex items-center gap-2'>
          {isAuth 
          ? (<>
          <SubscriptionBtn isPro={isPro} />
          <UserButton afterSignOutUrl='/'/>
          </>) 
          : (<>
          <Link href={'/sign-up'} className='flex items-center hover:bg-slate-900 text-white font-light p-2 bg-transparent border border-slate-300 rounded-md text-base'>Sign up</Link>
          <Link href={'/sign-in'} className='flex items-center hover:underline text-white font-semibold'>Login <ArrowUpRight className='h-5 w-5'/></Link>
          </>)}
        </div>
      </div>  
      {/* hero section */}
      <div className={cn('absolute ', {
        'left-1/2 top-1/2 -translate-x-1/2 w-3/4 -translate-y-1/2': isAuth,
        'left-0 top-1/4 w-full': !isAuth
      })}>

        <div className={cn('relative flex flex-col ',{
          ' items-center text-center' : isAuth,
          ' items-start pl-10 justify-start' : !isAuth
        })}>

          <div className={`flex items-center ${!isAuth ? 'w-1/2 text-slate-300': 'w-full justify-center'}`}>
            <h1 className='text-6xl p-auto'>
              {isAuth 
              ? <h1 className='font-semibold bg-gradient-to-r from-[#00467F] to-[#A5CC82] bg-clip-text text-transparent'>Get Instant PDF Insights</h1>
              : <h1 className='font-light'>Instant PDF Insights: <TypeEffect cursor={true} delay={500} string={['AI Chat Bot for Swift Document Analysis.']}/></h1> 
              }
            </h1>
          </div>
          {/* go to chats button */}
          <div className='flex mt-2'>
            {isAuth && FirstChat && 
              <Link href={`/chat/${FirstChat.id}`}>
                <Button className='bg-gradient-to-l from-blue-400 to-blue-600 group relative p-3 pr-9'>Open Chats <ArrowRight className=' absolute right-2.5 h-6 w-6 ml-2 transform group-hover:translate-x-1 transition duration-200 ease-in-out' /></Button>
              </Link>
            }
          </div>

          <p className={`max-w-xl my-2 font-light ${isAuth ? 'text-gray-700' : 'text-gray-300'}  text-medium`}>
            "Join millions of students, researchers, and professionals in using AI to quickly answer questions and enhance research understanding."
          </p>
          
          <div className='w-3/5 mt-4'>
            {isAuth 
            ? 
            (<FileUpload userId={userId} />) 
            : 
            ( <Link href='/sign-in'><Button className='bg-white text-dark hover:bg-white hover:underline'>Login to get started <LogIn className='w-5 h-5 ml-2' /></Button></Link>)}
          </div>

          {isAuth 
          ? ('') 
          : (<>
          <div className='absolute -top-[15%] xs:top-[100%] right-[5%] flex my-16 w-[40%] mx-3 flex flex-col gap-8'>

            <div className='flex flex-col items-start justify-start text-white font-light leading-tight text-base p-5 bg-gray-900 rounded-md'>
              <Quote className='w-4 h-4 my-4'/>
              <p className=''>Don&apos;t just read, revolutionize your document interactions with the revolutionary GPT-3.5 language model. Instead of sifting through pages, simply ask: &quot;Summarize this report&quot; or &quot;Extract key information.&quot; Need inspiration? Generate creative content based on your documents, brainstorm ideas, or even collaborate on tasks directly within the PDF. Unleash the full potential of your PDFs with GPT-3.5 - your intelligent document assistant is here.</p>
            </div>
  
          </div>
          </>)
          }

        </div>
        
      </div>
      {/* copyright */}
      <div className='absolute bottom-0 left-0 w-full p-2 items-center justify-start text-xs text-gray-400 font-light'>
        Made for pleasure by <span className='text-pink-800'>Elkortobi khalil</span>, &copy; 2024
      </div>

    </div>
  )
}
