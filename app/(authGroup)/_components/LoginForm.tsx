"use client"

import { Button } from '@/components/ui/button'
import { Card } from '@/components/ui/card'
import React, { useActionState, useEffect } from 'react'
import { loginAction } from '../_actions/authActions'
import { toast } from 'sonner'
import { useSearchParams } from 'next/navigation'
// import { useRouter } from 'next/navigation'  // client side navigation

const LoginForm = () => {
    const searchParams = useSearchParams()
    const redirectto = searchParams.get("redirectTo") ?? "";
    const [state, action, pending] =useActionState(loginAction.bind(null, redirectto),false)

    
    // const router = useRouter()
    console.log("state from login form",state);
    useEffect(()=>{
        if(!state) return;

        if(state.success){
            toast.success(state.message || "Logins Successfull")
            // router.push("/dashboard")
        }

        if(!state.success){
            toast.error(state.message || "Login Failed")
        }
        
    },[state])
  return (
    <form action={action} className='space-y-4'>
        <Card className='p-5 space-y-4'>
            <input name="email" type='email' placeholder='Enter your Email'  required/>
            <input name="password" type="password" placeholder='Enter your Password' required />
            <Button type='submit'>
                {
                    pending? "Submitting..." : "Login"
                }
            </Button>
        </Card>
    </form>
  )
}

export default LoginForm