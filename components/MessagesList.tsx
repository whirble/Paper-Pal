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
                        
                        <div className={cn('rounded-sm text-sm py-1 text-dark', {})}>
                            <div className='flex items-center justify-start gap-2'>
                                {message.role == 'user' 
                                ? (<><User className='w-4 h-4' /><p className='text-sm font-bold'>Vous</p></>) 
                                : (<><AudioLines className='w-4 h-4' /><p className='text-sm font-bold'>GPT</p></>) 
                                }
                            </div>
                            <div className='flex flex-col gap-2' dangerouslySetInnerHTML={{ __html: formatStringToHTML(message.content) }} ></div>
                        </div>
                    </div>
                )
            })}
        </div>
    )
}

export default MessagesList;