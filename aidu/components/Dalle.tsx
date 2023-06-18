

'use client'

import { useEffect, useState } from "react"

import { Skeleton } from "@mui/material"

const Dalle = () => {

    let [image, setImage] = useState('')

    let generateImage = async () => {
        const apiKey = process.env.NEXT_PUBLIC_OPENAI_API_KEY;

        setTimeout(() => {
            return;
        }, 5000)

        return;
        const response = await fetch('https://api.openai.com/v1/images/generations', {
          method: 'POST',
          headers: {
            'Content-Type': 'application/json',
            'Authorization': `Bearer ${apiKey}`,
          },
          body: JSON.stringify({
            model: 'image-alpha-001',
            prompt: `painting of nature hyperrealistic`,
            num_images: 1,
            size:'256x256'
          })
        });
      
        const res = await response.json();
        return res.data;

    }


    useEffect(() => {
        generateImage()
            .then((res) => {
                setImage(res[0].url)
            
            })
            .catch((err) => {
                console.log(err)      
            })
    }, [])
    
    return (
        
        <>
     
        {
            image === '' ? (
                <div className="w-full max-w-sm ">
                    <Skeleton variant="rectangular" width={390} height={200} className="rounded-lg max-h-72 shadow-lg"  />
                </div>
            ): (
                <img
                    src={image}
                    className="w-full bg-black max-w-sm rounded-lg max-h-72 opacity-70 shadow-lg"
                />
            )
        }
       

        </>
  
    )
}

export default Dalle