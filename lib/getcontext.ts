import {Pinecone} from '@pinecone-database/pinecone'
import { convertToAscii} from './utils'
import { getEmbeddings } from './embeddings'

export async function GetMachesFromEmbeddings(embeddings:number[], fileKey: string) {
    
    const pinecone = new Pinecone({
        apiKey: process.env.PINCONE_API_KEY || '',
    });
    if(!pinecone) {
        console.log('failed to initialize Pinecone Client')
    }

    
    const index = await pinecone.Index('chat-docs')
    
    try {
        const namespace = convertToAscii(fileKey)
        const queryResult = await index.namespace(namespace).query({
            vector: embeddings,
            topK: 3,
            includeMetadata: true,
        })
        return queryResult.matches || []
    } catch (error) {
        console.log(error);
        throw error;
    }

}

export async function getContext(query: string, fileKey: string) {
    const queryEmbeddings = await getEmbeddings(query)
    const matches  = await GetMachesFromEmbeddings(queryEmbeddings, fileKey)

    const qualifyyingDocs = matches?.filter((match) => match.score && match.score > 0.7)

    type Metadata = {
        text: string,
        pageNumber: number
    }

    let docs = qualifyyingDocs.map( match => (match.metadata as Metadata).text )
    // 5 vectors
    return docs?.join('\n').substring(0, 3000)
}