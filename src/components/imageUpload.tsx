import React from 'react'
import { UploadDropzone } from "@uploadthing/react";
import { OurFileRouter } from "@/app/api/uploadthing/core";
import { XIcon } from 'lucide-react';

interface ImageUploadProps{
    endpoint: "postImage",
    value: string,
    onChange: (url: string) => void;
}

function imageUpload({endpoint, onChange, value}: ImageUploadProps) {
    if(value){
        return(
            <div className="relative size-40">
                <img src="{value}" alt="Upload image" className='rounded-md w-full object-cover'/>
                <button onClick={()=> onChange("")} className='absolute top-0 right-0 p-1 bg-red-500 rounded-full shadow-sm' type='button'>
                    <XIcon className='h-4 w-4 text-white'/>
                </button>

            </div>
        )
    }

    return (
        <div className="w-full">
            <UploadDropzone<OurFileRouter, "postImage">
                endpoint={endpoint}
                onClientUploadComplete={(res) => {
                    // Do something with the response
                    console.log("Files: ", res);
                    alert("Upload Completed");
                    if(res && res[0]?.ufsUrl ){
                        onChange(res[0].ufsUrl);
                    }
                }}
                onUploadError={(error: Error) => {
                    alert(`ERROR! ${error.message}`);
                }}
                onUploadBegin={(name) => {
                    // Do something once upload begins
                    console.log("Uploading: ", name);
                }}
                onDrop={(acceptedFiles) => {
                    // Do something with the accepted files
                    console.log("Accepted files: ", acceptedFiles);
                }}
            />

        </div>
    )
}

export default imageUpload