import {Configuration, OpenAIApi} from 'openai-edge'
import {Message, OpenAIStream, StreamingTextResponse} from 'ai'
import { getContext } from '@/lib/getcontext'
import { db } from '@/lib/db'
import { chats, messages as _messages } from '@/lib/db/schema'
import { eq } from 'drizzle-orm'
import { NextResponse } from 'next/server'

export const runtime = 'edge'

const config = new Configuration({
    apiKey: process.env.OPENAI_API_KEY,
})
const openai = new OpenAIApi(config)
if(openai) {
    console.log('Configured openAIApi')
}
export async function POST(req: Request) {

    try {

        const {messages, chatId} = await req.json()
        const activeChat = await db.select().from(chats).where(eq(chats.id, chatId))
        if(activeChat.length != 1) {
            return NextResponse.json({'Error': 'Chat not found'}, {status:404})
        }
        const fileKey = activeChat[0].fileKey
        const lastMessage = messages[messages.length - 1].content
        const context = await getContext(lastMessage, fileKey)
        const prompt = {
            role: 'system',
            content: `AI assistant is a brand new, powerful, human-like artificial intelligence.
            The traits of AI include expert knowledge, helpfulness, cleverness, and articulateness.
            AI is a well-behaved and well-mannered individual.
            AI has the sum of all knowledge in their brain, and is able to accurately answer nearly any question about any topic in conversation.
            START PDF DOCUMENT CONTEXT BLOCK
            ${context}
            END OF PDF DOCUMENT CONTEXT BLOCK
            AI assistant will take into account any CONTEXT BLOCK that is provided in a conversation.
            If the context does not provide the answer to question, the AI assistant will say, "I'm sorry, but I don't know the answer to that question".
            AI assistant will not invent anything that is not drawn directly from the context.
            `,
        }

        const response = await openai.createChatCompletion({
            model: 'gpt-3.5-turbo',
            messages: [
                prompt,
                ...messages.filter((message: Message) => message.role === 'user')
            ],
            stream: true
        })
        const stream = OpenAIStream(response, {
            onStart: async () => {
                // save user message to db
                await db.insert(_messages).values({
                    chatId,
                    content: lastMessage,
                    role: 'user'
                })
            },
            onCompletion: async (completion) => {
                // save openAI completion to db
                await db.insert(_messages).values({
                    chatId,
                    content: completion,
                    role: 'system'
                })
            }
        })
        return new StreamingTextResponse(stream)
        
    } catch (error) { 
        console.log('Failed to get a response from openAI, ', error)
        
    }

}