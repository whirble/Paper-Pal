'use client'
import React from 'react'
import {Input} from './ui/input'
import {Button} from './ui/button'
import {useChat} from 'ai/react'
import {Send} from 'lucide-react'
import MessagesList from './MessagesList'
import { useQuery } from '@tanstack/react-query'
import { Message } from 'ai'
import axios from 'axios'


type Props = {
    chatId: number
}

const ChatContainer = ({chatId}: Props) => {

    const {data, isLoading} = useQuery({
        queryKey: ['chat', chatId],
        queryFn: async () => {
            const response = await axios.post<Message[]>('/api/getMessages', {chatId})
            return response.data
        }
    })

    const { input, handleInputChange, handleSubmit, messages} = useChat({
        api: '/api/chat',
        body: {
            chatId
        },
        initialMessages: data || []
    });
    React.useEffect(() => {
        const messagesContainer = document.getElementById('messages-container')
        if(messagesContainer) {
            messagesContainer.scrollTo({
                top: messagesContainer.scrollHeight,
                behavior: 'smooth'
            })
        }
    }, [messages]);
    return (
        <div className='relative max-h-screen overflow-y-auto scrollbar-thin-rounded' id='messages-container'>

            <div className='sticky top-0 inset-x-0 p-2 bg-white h-fit'>
                <h3 className='text-md font-bold'>Votre Chat</h3>
            </div>

            {/* messages list */}
            <MessagesList messages={messages} isLoading={isLoading} />

            <form onSubmit={handleSubmit} className='sticky bottom-0 inset-x-0 px-2 py-3 mt-1 bg-white'>
                <div className='flex'>
                <Input value={input} onChange={handleInputChange} placeholder='Ask Your PDF...' className='w-full'/>
                <Button className='bg-blue-600 ml-2'><Send className='h-4 w-4' /></Button>
                </div>
            </form>

        </div>
    )
}

export default ChatContainer;