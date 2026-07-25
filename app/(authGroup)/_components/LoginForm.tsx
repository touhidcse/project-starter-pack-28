"use client"

import { Button } from '@/components/ui/button'
import { Card } from '@/components/ui/card'
import React from 'react'

const LoginForm = () => {
  return (
    <form className='space-y-4'>
        <Card className='p-5 space-y-4'>
            <input name="email" type='email' placeholder='Enter your Email'  required/>
            <input name="password" type="password" placeholder='Enter your Password' required />
            <Button type='submit'>
                Login
            </Button>
        </Card>
    </form>
  )
}

export default LoginForm