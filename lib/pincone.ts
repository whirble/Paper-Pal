// import { PineconeClient }  from '@pinecone-database/pinecone';
import { Pinecone, utils as PineconeUtils } from '@pinecone-database/pinecone';
import { Vector } from '@pinecone-database/pinecone';

import { downloadFromS3 } from './s3-server';
import { PDFLoader } from 'langchain/document_loaders/fs/pdf'
import {Document, RecursiveCharacterTextSplitter} from '@pinecone-database/doc-splitter'
import { getEmbeddings } from './embeddings';
import md5 from 'md5'
import { convertToAscii } from './utils';

let pinecone : Pinecone | null = null;

export const getPineconeClient = async () => {
    if(!pinecone) {
        pinecone = new Pinecone({
            apiKey: process.env.PINCONE_API_KEY || '',
            environment: 'gcp-starter'
        });
        if(!pinecone) {
            console.log('failed to initialize PineconeClient')
        }
    }
    return pinecone;
};

type PDFPage = {
    pageContent : string;
    metadata : {
        loc : {pageNumber : number}
    }
}

export async function loadS3IntoPinecone(fileKey: string) {

    // obtain the pdf => read from it
    console.log('downloading s3 into file system ...')
    const file_name = await downloadFromS3(fileKey);

    if(!file_name) {
        throw new Error('could not download from s3')
    }
    const loader = new PDFLoader(file_name);
    const pages = (await loader.load()) as PDFPage[];

    // split the PDF to paragraphs
    const documents = await Promise.all(pages.map(prepareDocument))

    // vectorise and ambed individual documents
    const vectors = await Promise.all(documents.flat().map(embedDocuments))
    console.log('embedded Documents from openAI API')

    // at last upload to pinecone
    const client = await getPineconeClient()
    const pineconeIndex = client.Index('chat-docs')

    console.log('uploading vectors into pinecone')
    const namespace = convertToAscii(fileKey)
    console.log(namespace)
    await pineconeIndex.namespace(namespace).upsert(vectors)
    return documents[0]

}

async function embedDocuments(doc:Document) {
    try {
        const embeddings = await getEmbeddings(doc.pageContent)
        const hash = md5(doc.pageContent)

        return {
            id: hash,
            values: embeddings,
            metadata: {
                text: doc.metadata.text,
                pageNumber: doc.metadata.pageNumber
            }
        } as Vector

    } catch (error) {
        console.log('error embedding documents', error)
        throw error
    }
}

export const truncateStringByBytes = (string: string, bytes: number) => {
    const enc = new TextEncoder()
    return new TextDecoder('utf-8').decode(enc.encode(string).slice(0, bytes))
}

async function prepareDocument(page:PDFPage) {
    let { pageContent, metadata} = page
    pageContent = pageContent.replace(/\n/g, ' ')
    // split the document to smaller docs
    const splitter = new RecursiveCharacterTextSplitter()
    const docs = await splitter.splitDocuments([
        new Document({
            pageContent,
            metadata: {
                pageNumber: metadata.loc.pageNumber,
                text:  truncateStringByBytes(pageContent, 36000)
            }
        })
    ])
    return docs
}