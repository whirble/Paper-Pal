import React from 'react'
import {Message} from 'ai/react'
import { cn } from '@/lib/utils'
import { AudioLines, Loader2, LoaderIcon, User } from 'lucide-react'


function formatStringToHTML(inputString: string) {
    const lines = inputString.split('\n');
    let html = '';
  
    // Iterate through each line of the input string
    lines.forEach(line => {
      // Check if the line starts with a number followed by a dot
      if (/^\d+\./.test(line)) {
        // If yes, wrap it with <h3> tag
        html += `<h3 className='font-semi-bold '>${line}</h3>`;
      } else {
        // Otherwise, wrap it with <p> tag
        html += `<p>${line}</p>`;
      }
    });
  
    return html;
  }

type Props = {
    messages: Message[],
    isLoading: boolean
}

const MessagesList = ({messages, isLoading}: Props) => {
    if(isLoading) {
        return (
            <div className='absolute top-1/2 left-1/2 -translate-x-1/2 -translate-y-1/2'>
                <Loader2 className='h-5 w-5 animate-spin' />
            </div>
        )
    }
    if(!messages) return <></>
    return (
        <div className='flex flex-col gap-2 px-4 pl-2 rounded-sm'>
            {messages.map((message) => {
                return (
                    <div key={message.id} className={cn('flex', {})}>
                        
                        <div className={cn('flex flex-col rounded-sm text-base py-2 text-dark gap-2 font-costum', {})}>
                            <div className='flex items-center justify-start gap-2'>
                                {message.role == 'user' 
                                ? (<><div className='border-none rounded-full text-center bg-gradient-to-r from-gray-500 to-gray-200 p-2'><User className='w-5 h-5 text-white ' /></div><p className='text-base font-semibold'>Vous</p></>) 
                                : (<><div className='border-none rounded-full text-center bg-gradient-to-r from-gray-500 to-gray-200 p-2'><AudioLines className='w-5 h-4 text-white' /></div><p className='text-base font-semibold'>PaperPal</p></>) 
                                }
                            </div>
                            <div className='flex flex-col gap-2 leading-relaxed' dangerouslySetInnerHTML={{ __html: formatStringToHTML(message.content) }} ></div>
                        </div>
                    </div>
                )
            })}
        </div>
    )
}

export default MessagesList;