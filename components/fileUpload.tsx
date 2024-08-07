'use client'
import React from 'react'
import {useDropzone} from 'react-dropzone'
import {useMutation} from '@tanstack/react-query'
import {Inbox, Loader2} from 'lucide-react'
import { uploadToS3 } from '@/lib/s3'
import axios from 'axios'
import { toast } from 'react-hot-toast'
import {useRouter} from 'next/navigation'
import { db } from '@/lib/db'
import { chats } from '@/lib/db/schema'
import { eq } from 'drizzle-orm'
import { auth } from '@clerk/nextjs'


type Props = {
    userId: string
}
console.log('started fileUpload.tsx')
const FileUpload = ( {userId}:Props ) => {
    const router = useRouter()
    // const {userId} = auth() only in server component.
    const [uploading, setUploading] = React.useState(false);
    const { mutate } = useMutation({
        mutationFn: async ({
            file_key,
            file_name,
        }: {
            file_key: String;
            file_name: String;
        }) => {
            const response = await axios.post('/api/create-chat', {
                file_key,
                file_name
            });
            return response.data
        },
    });

    const { getRootProps, getInputProps} = useDropzone(
        {
        accept: { 'application/pdf': ['.pdf']},
        maxFiles: 1,
        onDrop: async (acceptedFiles) => {
            console.log('acceptedFiles: ',acceptedFiles);
            const file = acceptedFiles[0];
            if (file.size > 10 * 1024 * 1024) {
                // file size > 10 mb
                toast.error('please upload a file of size equal or less than 10MB')
                return
            }
            // file size < 10 mb
            try {
                // Limit chats creation in test mode
                // const _chats = await db.select().from(chats).where(eq(chats.userId, userId || ''))
                // if(_chats.length > 2) {
                //     toast.error("This app is on test mode!, You've reached the chats limit ")
                //     return
                // }
                // // ------------------------
                setUploading(true)
                console.log('started uploadToS3')
                const data = await uploadToS3(file)
                if(!data?.file_key || !data.file_name){
                    toast.error('Something went wrong!, pls try again.');
                    return;
                }
                console.log('started mutate')
                mutate(data, {
                    onSuccess: (chat_id) => {
                        toast.success(`chat created :), you're being redirected.`);
                        router.push(`/chat/${chat_id}`)
                    },
                    onError: (err) => {
                        toast.error("Something went wrong, please try again later.");
                        console.log(err)
                    }
                })
            } catch (error) {
                console.log(error)
            } finally {
                setUploading(false)
            }
        },
    }

    );
    return (
        <div className='p-2 bg-white rounded-xl border'>
            <div {...getRootProps({className:'border-dashed border-2 rounded-xl cursor-pointer bg-gray-50 py-8 flex justify-center items-center flex-col',})}>
                <input {...getInputProps()} />
                { uploading
                ? (
                    <>
                    <Loader2 className='h-10 w-10 text-blue-500 animate-spin' />
                    <p className='mt-2 text-sm text-slate-400'>Summoning the data spirits...</p>
                    </>
                ) : (
                    <>
                    <Inbox className='w-10 h-10 '/>
                    <p className='mt-2 text-sm text-slate-400'>Click to upload or drop document here</p>
                    </>
                ) 
                }
            </div>
        </div>
    )
}

export default FileUpload