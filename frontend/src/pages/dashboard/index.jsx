import { useRouter } from 'next/router'
import React, { useEffect } from 'react'

export default function Dashboard() {
    const router =useRouter();
    /* Since the token was visible on the console*/
    useEffect(()=>{
        if(localStorage.getItem('token')===null){
            window.location.href='/login'
        }
    })
    return (
    <div>
      Dashboard
    </div>
  )
}
