import React from 'react'
import {auth} from '@clerk/nextjs'
import {redirect} from 'next/navigation'
import { eq } from 'drizzle-orm'
import { db } from "@/lib/db";
import { chats } from "@/lib/db/schema";
import ChatSideBar from '@/components/ChatSideBar'
import PDFViewer from '@/components/PDFViewer'
import ChatContainer from '@/components/ChatContainer'
import { checkSubscription } from '@/lib/subscription';


type Props = {
    params: { chatId: string}
}

const ChatPage = async ({params: {chatId}}: Props) => {
    const isPro = await checkSubscription()
    const {userId} = await auth()
    if (!userId) {
        return redirect('/sign-in')
    }
    const userChats = await db.select().from(chats).where(eq(chats.userId, userId))

    if (!userChats) {
        return redirect('/')
    }
    if (!userChats.find((chat) => chat.id == parseInt(chatId))) {
        return redirect('/')
    }
    const currentChat = userChats.find(chat => chat.id === parseInt(chatId))

    return (
        <div className='flex max-h-screen'>
            <div className='flex w-full max-h-screen '>

                {/* Sidebar */}
                <div className='flex-[1] min-w-md max-w-lg'>
                    <ChatSideBar chats={userChats} chatId={parseInt(chatId)} isPro={isPro} />
                </div>

                {/* PDF Viewer */}
                <div className='max-h-screen p-4 flex-[5] '>
                    <PDFViewer PDF_url={currentChat?.pdfUrl || ''} />
                </div>

                {/* Chat Messages */}
                <div className='flex-[3] border-1-4 border-1-slate-200 '>
                    <ChatContainer chatId={parseInt(chatId)}/>
                </div>

            </div>
        </div>
    )

};

export default ChatPage;