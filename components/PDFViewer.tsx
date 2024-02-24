import React from 'react'

type Props = {PDF_url: string}

const PDFViewer = ({PDF_url}: Props) => {
    return (
        <iframe 
        // src={`https://docs.google.com/gview?url=${PDF_url}&embedded=true`}
        src={`https://docs.google.com/viewer?url=${PDF_url}&embedded=true`} 
        className='w-full h-full'>

        </iframe>
    )
}

export default PDFViewer;