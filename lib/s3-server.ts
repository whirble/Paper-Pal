import AWS from 'aws-sdk'
import fs from 'fs'
import os from 'os'
import path from 'path'


// THE PROBLEM IS HERE, NOT FINDING THE PATH TO SAVE THE FILE :(

// STOPPED AT ' GETTING THE PAGES OF THE PDF ' !!!!

export async function downloadFromS3(file_key:string) {
    // starting downloadFromS3 
    try {
        AWS.config.update({
            accessKeyId : process.env.NEXT_PUBLIC_S3_ACCESS_KEY_ID,
            secretAccessKey : process.env.NEXT_PUBLIC_S3_SECRET_ACCESS_KEY,
        });
        const s3 = new AWS.S3({
            params: {
                Bucket: process.env.NEXT_PUBLIC_S3_BUCKET_NAME
            },
            region: 'eu-north-1',
        });
        const params: AWS.S3.GetObjectRequest = {
            Bucket: process.env.NEXT_PUBLIC_S3_BUCKET_NAME || '',
            Key: file_key
        };

        const obj = await s3.getObject(params).promise(); 
        if (!obj.Body) {
            console.log('Received empty object body from S3');
        }
        const file_name = path.join(os.tmpdir(),`pdf-${Date.now()}.pdf`);
        fs.writeFileSync(file_name, obj.Body as Buffer);
        return file_name;


    } catch (error) {
        console.error(error)
        return null
    }
}