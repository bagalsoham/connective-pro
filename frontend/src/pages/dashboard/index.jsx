import { useRouter } from 'next/router'
import React, { useEffect, useState } from 'react'

export default function Dashboard() {
    const router =useRouter();
    const [isTokenThere, setIsTokenThere] = useState(false); // Declare a state variable 'isTokenThere' with initial value 'false'. It will be used to track whether a token exists in localStorage or not.
    /* Since the token was visible on the console*/
    useEffect(()=>{
        if(localStorage.getItem('token')===null){
            router.push("/login")
        }
        setIsTokenThere(true)
    })
    useEffect(()=>{
      if(isTokenThere){
        
      }
    },[isTokenThere])
    return (
    <div>
      Dashboard
    </div>
  )
}
