import { db } from "@/lib/db";
import { chats } from "@/lib/db/schema";
import { loadS3IntoPinecone } from "@/lib/pincone";
import { getS3Url } from "@/lib/s3";
import { auth } from "@clerk/nextjs";
import { NextResponse } from "next/server";

export async function POST(req:Request, res:Response) {
    const {userId} = await auth()
    if(!userId) {
        return NextResponse.json({error: 'unauthorized'}, {status: 401})
    }
    try {

        const body = await req.json();
        const {file_key, file_name} = body;
        // console.log(file_key, file_name);
        // console.log('starting loadS3IntoPinecone');
        await loadS3IntoPinecone(file_key);

        const insertedRecord = await db.insert(chats).values({
            fileKey: file_key,
            pdfName: file_name,
            pdfUrl: getS3Url(file_key),
            userId
        })
        .returning({
            insertedId: chats.id,
        });
        const chat_id = Number(insertedRecord[0].insertedId)
        return NextResponse.json( chat_id );

    } catch (error) {

        console.error(error);
        return NextResponse.json(
            {error:'internal server error [2]'}, 
            {status: 500}
        );
        
    }
}