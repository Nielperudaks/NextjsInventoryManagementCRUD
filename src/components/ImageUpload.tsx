import React from 'react'
import { UploadDropzone } from "@uploadthing/react";
import { OurFileRouter } from "@/app/api/uploadthing/core";
import { XIcon } from 'lucide-react';

interface ImageUploadProps{
    endpoint: "postImage",
    value: string,
    onChange: (url: string) => void;
}

function ImageUpload({endpoint, onChange, value}: ImageUploadProps) {
    console.log(value)
    if(value){
        return(
            <div className="relative size-40">
                <img src={value} alt="Upload image" className='rounded-md w-full object-cover'/>
                <button onClick={()=> onChange("")} className='absolute top-0 right-0 p-1 bg-red-500 rounded-full shadow-sm' type='button'>
                    <XIcon className='h-4 w-4 text-white'/>
                </button>

            </div>
        )
    }

    return (
        <div className="w-full h-full">
            <UploadDropzone<OurFileRouter, "postImage">
                endpoint="postImage"
                onClientUploadComplete={(res) => {
                    // Do something with the response
                    console.log("Files: ", res);
                    alert("Upload Completed");
                    console.log("Upload complete raw response:", res); 
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

                onDrop={(files) => console.log("Dropped files:", files)}
                
            />  

        </div>
    )
}

export default ImageUpload
