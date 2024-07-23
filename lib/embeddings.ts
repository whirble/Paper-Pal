import {OpenAIApi, Configuration} from 'openai-edge'

const config = new Configuration({
    apiKey: process.env.OPENAI_API_KEY
})

const openai = new OpenAIApi(config)

export async function getEmbeddings(text:String) {
    try {
        const Response = await openai.createEmbedding({
            model: 'text-embedding-ada-002',
            input: text.replace(/\n/g, ' ')
        });
        const result = await Response.json()
        console.log('embeddings:',result)
        return result.data[0].embedding as number[]
    } catch (error) {
        console.log('Error creating embeddings!', error)
        throw error
    }
}